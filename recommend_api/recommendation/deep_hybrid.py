from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from recommendation.cbf import CBFRecommender
from recommendation.cf import CFRecommender
from recommendation.hybrid import HybridRecommender
from recommendation.ueca import UECARecommender
from core.database import get_db
from models.food_ingredients import FoodIngredient
from models.feedback_log import FeedbackLog
from models.allergies import UserAllergy
from utils.allergy_mapping import INGREDIENT_ALLERGY_MAP
from collections import defaultdict

class DeepHybridRecommender:
    def __init__(self, db: Session = next(get_db())):
        self.db = db
        self.hybrid = HybridRecommender(self.db)
        self.ueca = UECARecommender(self.db)

    def normalize(self, scores: dict) -> dict:
        if not scores:
            return {}
        vals = list(scores.values())
        min_val, max_val = min(vals), max(vals)
        if max_val == min_val:
            return {k: 0.0 for k in scores}
        return {k: (v - min_val) / (max_val - min_val) for k, v in scores.items()}

    def recommend(self, user_id: int, timestamp: str, temp: float, humidity: float, allergies=None, recent_satisfied: list=None) -> dict:
        is_main = False
        if not recent_satisfied:
            logs = (
                self.db.query(FeedbackLog)
                .filter(FeedbackLog.user_id == user_id)
            )
            feedback_cnt = len(logs.all())
            one_days_ago = datetime.utcnow() - timedelta(days=1)
            day1_logs = logs.filter(FeedbackLog.timestamp >= one_days_ago).all()
            recent_satisfied, recent_viewed = [], []
            for log in day1_logs:
                if log.satisfied > 0:
                    recent_satisfied.append(log.menu_id)
                recent_viewed.append(log.menu_id)
            recent_satisfied = set(recent_satisfied)
            recent_viewed = set(recent_viewed)
            is_main = True
            print(recent_viewed)

        hybrid_scores = self.hybrid.recommend(user_id, timestamp, temp, humidity, allergies, recent_satisfied)
        ueca_scores = self.ueca.recommend(user_id, timestamp, temp, humidity)

        hybrid_weight = 0.7
        ueca_weight = 0.3

        hybrid_scores_norm = self.normalize(hybrid_scores)
        ueca_scores_norm = self.normalize(ueca_scores)

        menu_ids = set(hybrid_scores_norm) | set(ueca_scores_norm)
        final_scores = {}
        for mid in menu_ids:
            hybrid = hybrid_scores_norm.get(mid, 0)
            ueca = ueca_scores_norm.get(mid, 0)
            final_scores[mid] = hybrid_weight * hybrid + ueca_weight * ueca
            if is_main and mid in recent_viewed:
                final_scores[mid] *= 0.7

        if is_main:
            ingredient_map = defaultdict(list)
            for row in self.db.query(FoodIngredient).all():
                ingredient_map[row.food_id].append(row.ingredients)

            allergy_set = None
            if allergies:
                allergy_set = allergies
            else:
                allergies = self.db.query(UserAllergy).filter(UserAllergy.user_id == user_id).all()
                allergy_set = {a.allergy_name for a in allergies}

            allergic_ids = set()
            for mid, ingredients in ingredient_map.items():
                for ing in ingredients:
                    if INGREDIENT_ALLERGY_MAP.get(ing.strip()) in allergy_set:
                        allergic_ids.add(mid)
                        break

            for mid in allergic_ids:
                if mid in final_scores:
                    del final_scores[mid]

        return dict(sorted(final_scores.items(), key=lambda x: x[1], reverse=True))
