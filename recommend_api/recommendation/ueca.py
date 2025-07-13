from datetime import datetime
import torch
import torch.nn as nn
import torch.nn.functional as F
from sqlalchemy.orm import Session

from core.database import get_db
from models.feedback import Feedback
from models.menu import Menu
from models.feature import Feature
from models.users import User
from utils.convert_time import convert_timestamp_to_slot
from utils.weather_api import get_temp_and_humidity

MODEL_PATH = "recommendation/ueca_model.pt"

class UECAModel(nn.Module):
    def __init__(self, input_dim=13, num_features=10):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, num_features),
            nn.Sigmoid()
        )

    def forward(self, x):
        logits = self.model[:-1](x)  # 마지막 Sigmoid 전까지
        return torch.sigmoid(logits * 5.0)  # sharpening (온도 계수 5.0)

class UECARecommender:
    def __init__(self, db: Session = next(get_db())):
        self.db = db

        features = self.db.query(Feature).all()
        self.feature_map = {
            f.food_id: [
                f.spicy, f.salty, f.sweet, f.greasy, f.fried,
                f.soup, f.cold, f.rice_based, f.noodle_based, f.healthy
            ]
            for f in db.query(Feature).all()
        }

        self.gender_map = {"남성": [1, 0], "여성": [0, 1]}
        self.age_group_map = {"10대": [1, 0, 0, 0, 0], "20대": [0, 1, 0, 0, 0], "30대": [0, 0, 1, 0, 0], "40대": [0, 0, 0, 1, 0], "50대": [0, 0, 0, 0, 1]}
        self.age_detail_map = {"초반": [1, 0, 0], "중반": [0, 1, 0], "후반": [0, 0, 1]}

        # 모델 불러오기
        self.model = UECAModel()
        self.model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
        self.model.eval()

    def recommend(self, user_id: int, timestamp: str, temp: float, humidity: float):
        u = self.db.query(User).filter(User.id == user_id).first()
        age_group = u.age[:3]
        age_detail = u.age[-2:]
        gender_vec = self.gender_map[u.gender]
        age_vec = self.age_group_map[age_group] + self.age_detail_map[age_detail]

        def time_to_float(timestamp_str):
            try:
                dt = datetime.fromisoformat(timestamp_str.replace(" ", "T"))
                return dt.hour + dt.minute / 60.0
            except:
                return 0.0
            
        context_vec = [
            time_to_float(timestamp) / 24.0,
            temp / 50.0,
            humidity / 100.0
        ]

        input_vec = torch.tensor(gender_vec + age_vec + context_vec, dtype=torch.float32).unsqueeze(0)

        with torch.no_grad():
            user_pref = self.model(input_vec).squeeze(0)  # [10]

        # 모든 메뉴와 코사인 유사도 비교
        menu_ids, menu_vecs = [], []
        for mid, vec in self.feature_map.items():
            menu_ids.append(mid)
            menu_vecs.append(torch.tensor(vec, dtype=torch.float32))

        menu_tensor = torch.stack(menu_vecs)  # [num_menus, 10]
        scores = F.cosine_similarity(menu_tensor, user_pref.unsqueeze(0).expand_as(menu_tensor), dim=1)

        score_dict = {mid: s.item() for mid, s in zip(menu_ids, scores)}
        return dict(sorted(score_dict.items(), key=lambda x: x[1], reverse=True))