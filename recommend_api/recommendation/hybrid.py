from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from recommendation.cbf import CBFRecommender
from recommendation.cf import CFRecommender
from core.database import get_db
from models.food_ingredients import FoodIngredient
from models.feedback_log import FeedbackLog
from models.allergies import UserAllergy
from utils.convert_time import convert_timestamp_to_slot
from utils.allergy_mapping import INGREDIENT_ALLERGY_MAP
from collections import defaultdict

class HybridRecommender:
    def __init__(self, db: Session = next(get_db())):
        self.db = db
        self.cbf = CBFRecommender(self.db)
        self.cf = CFRecommender(self.db)

    def _normalize(self, scores: dict) -> dict:
        if not scores:
            return {}
        vals = list(scores.values())
        min_val, max_val = min(vals), max(vals)
        if max_val == min_val:
            return {k: 0.0 for k in scores}
        return {k: (v - min_val) / (max_val - min_val) for k, v in scores.items()}

    def recommend(self, user_id: int, timestamp: str, temp: float, humidity: float, allergies=None, recent_satisfied: list=None) -> dict:
        is_main = False
        logs = (
                self.db.query(FeedbackLog)
                .filter(FeedbackLog.user_id == user_id)
            )
        feedback_cnt = len(logs.all())
        if not recent_satisfied:
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

        time_slot = convert_timestamp_to_slot(timestamp)
        cbf_scores = self.cbf.recommend(user_id, time_slot, temp, humidity, recent_satisfied)
        cf_scores = self.cf.recommend(user_id)

        max_feedback = 50
        feedback_ratio = min(feedback_cnt / max_feedback, 1.0)  # 0.0 ~ 1.0 사이 값
        
        cbf_weight = 1.0 - 0.4 * feedback_ratio  # 최소 0.6, 최대 1.0
        cf_weight = 0.2 + 0.4 * feedback_ratio  # 최소 0.2, 최대 0.6

        cbf_scores_norm = self._normalize(cbf_scores)
        cf_scores_norm = self._normalize(cf_scores)

        menu_ids = set(cbf_scores_norm) | set(cf_scores_norm)
        final_scores = {}
        for mid in menu_ids:
            cbf = cbf_scores_norm.get(mid, 0)
            cf = cf_scores_norm.get(mid, 0)
            final_scores[mid] = cbf_weight * cbf + cf_weight * cf
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
