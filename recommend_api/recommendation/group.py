from collections import defaultdict
from sqlalchemy.orm import Session

from core.database import get_db
from models.allergies import UserAllergy
from recommendation.deep_hybrid import DeepHybridRecommender

class GroupRecommender:
    def __init__(self, db: Session = next(get_db())):
        self.db = db
        self.deep_hybrid = DeepHybridRecommender(self.db)

    def recommend(self, user_ids: list[int], timestamp: str, temp: float, humidity: float) -> dict:

        group_scores = defaultdict(float)
        count_scores = defaultdict(int)

        allergies = self.db.query(UserAllergy).filter(UserAllergy.user_id.in_(user_ids)).all()

        allergy_set = {a.allergy_name for a in allergies}

        for user_id in user_ids:
            result = self.deep_hybrid.recommend(
                user_id=user_id,
                timestamp=timestamp,
                temp=temp,
                humidity=humidity,
                allergies=list(allergy_set),
            )
            for rank, mid in enumerate(result):
                group_scores[mid] += (len(result) - rank)
                count_scores[mid] += 1

        final_scores = {
            mid: group_scores[mid] / count_scores[mid]
            for mid in group_scores
        }

        return dict(sorted(final_scores.items(), key=lambda x: x[1], reverse=True))