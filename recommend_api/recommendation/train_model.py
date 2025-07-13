from collections import defaultdict
from datetime import datetime
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader, random_split
import torch.nn.functional as F
import torch.nn as nn
from sklearn.cluster import KMeans

from core.database import get_db
from models.users import User
from models.feature import Feature
from models.feedback_log import FeedbackLog

class MetaGuidedDataset(Dataset):
    def _load_all_metadata_from_db(self):
        user_df = pd.read_sql(self.db.query(User).statement, self.db.bind)
        feature_df = pd.read_sql(self.db.query(Feature).statement, self.db.bind)
        log_df = pd.read_sql(self.db.query(FeedbackLog).statement, self.db.bind)
        return user_df, feature_df, log_df

    def __init__(self, db = next(get_db()), n_clusters=10):
        self.db = db
        self.user_df, self.feature_df, self.log_df = self._load_all_metadata_from_db()

        self.feature_cols = [col for col in self.feature_df.columns if col not in ["id", "food_id"]]
        
        satisfied_log = self.log_df[self.log_df["satisfied"] == 1]
        context_to_features = defaultdict(list)

        for _, row in satisfied_log.iterrows():
            key = (row["user_id"], row["timestamp"], row["temperature"], row["humidity"])
            feature_row = self.feature_df[self.feature_df["food_id"] == row["menu_id"]]
            if not feature_row.empty:
                context_to_features[key].append(feature_row[self.feature_cols].values[0])

        context_keys, context_vecs = [], []
        for ctx, vecs in context_to_features.items():
            context_keys.append(ctx)
            context_vecs.append(sum(vecs) / len(vecs))

        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_ids = kmeans.fit_predict(context_vecs)
        self.context_to_cluster = {ctx: cid for ctx, cid in zip(context_keys, cluster_ids)}
        self.cluster_to_vec = {cid: vec for cid, vec in enumerate(kmeans.cluster_centers_)}

        cluster_array = np.array(list(self.cluster_to_vec.values()))  # (n_clusters, n_features)
        min_vals = cluster_array.min(axis=0)
        max_vals = cluster_array.max(axis=0)
        range_vals = np.clip(max_vals - min_vals, 1e-5, None)  # division by zero 방지

        # 정규화된 벡터로 대체
        self.cluster_to_vec = {
            cid: (vec - min_vals) / range_vals
            for cid, vec in self.cluster_to_vec.items()
        }

        self.user_ids = sorted(self.user_df["id"].unique())
        self.user_id_to_index = {uid: idx for idx, uid in enumerate(self.user_ids)}

        def split_age_group(age_string):
            for detail in ["초반", "중반", "후반"]:
                if detail in age_string:
                    age_group = age_string.replace(detail, "")
                    return age_group, detail
            return age_string, ""

        self.user_df[["age_group", "age_detail"]] = self.user_df["age"].apply(lambda x: pd.Series(split_age_group(x)))
        self.gender_map = {"남성": [1, 0], "여성": [0, 1]}
        self.age_group_map = {"10대": [1, 0, 0, 0, 0], "20대": [0, 1, 0, 0, 0], "30대": [0, 0, 1, 0, 0], "40대": [0, 0, 0, 1, 0], "50대": [0, 0, 0, 0, 1]}
        self.age_detail_map = {"초반": [1, 0, 0], "중반": [0, 1, 0], "후반": [0, 0, 1]}

        self.samples = list(self.context_to_cluster.keys())

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        uid, timestamp, temp, humid = self.samples[idx]

        urow = self.user_df[self.user_df["id"] == uid].iloc[0]
        gender_vec = self.gender_map.get(urow["gender"], [0, 0])
        age_vec = self.age_group_map[urow["age_group"]] + self.age_detail_map[urow["age_detail"]]
        user_meta = torch.tensor(gender_vec + age_vec, dtype=torch.float32)

        def time_to_float(timestamp_str):
            try:
                dt = datetime.fromisoformat(timestamp_str.replace(" ", "T"))
                return dt.hour + dt.minute / 60.0
            except:
                return 0.0
            
        context_vec = torch.tensor([
            time_to_float(timestamp) / 24.0,
            temp / 50.0,
            humid / 100.0
        ], dtype=torch.float32)

        cluster_id = self.context_to_cluster[(uid, timestamp, temp, humid)]
        label_vec = torch.tensor(self.cluster_to_vec[cluster_id], dtype=torch.float32)
        label_vec = torch.clamp(label_vec, 0.0, 1.0)
        label_vec = (label_vec >= 0.5).float()

        return user_meta, context_vec, label_vec
    
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
        logits = self.model[:-1](x)
        return torch.sigmoid(logits * 5.0)
    
def train_model(dataset, epochs=10, batch_size=64, lr=0.001, device='cuda' if torch.cuda.is_available() else 'cpu'):
    # 데이터셋 분할
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size)

    model = UECAModel(input_dim=13, num_features=10).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = nn.BCELoss()  # 멀티라벨 확률 회귀 -> Binary Cross Entropy

    for epoch in range(epochs):
        model.train()
        total_loss = 0
        for user_meta, context_vec, label_vec in train_loader:
            inputs = torch.cat([user_meta, context_vec], dim=1).to(device)
            labels = label_vec.to(device)
            assert not torch.isnan(inputs).any()
            assert not torch.isnan(labels).any()


            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(train_loader)

    return model

if __name__ == "__main__":
    dataset = MetaGuidedDataset(n_clusters=20)
    model = train_model(dataset)
    torch.save(model.state_dict(), "recommendation/ueca_model.pt")