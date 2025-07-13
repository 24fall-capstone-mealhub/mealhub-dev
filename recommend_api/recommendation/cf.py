import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from collections import defaultdict

from core.database import get_db
from models.feedback import Feedback
from utils.score import calculate_adjusted_score


class CFRecommender:
    def __init__(self, db: Session = next(get_db())):
        self.db = db

    def recommend(self, user_id: int) -> dict:
        feedbacks = self.db.query(Feedback).all()

        user_ids = sorted({f.user_id for f in feedbacks})
        menu_ids = sorted({f.menu_id for f in feedbacks})

        uid_to_idx = {uid: idx for idx, uid in enumerate(user_ids)}
        mid_to_idx = {mid: idx for idx, mid in enumerate(menu_ids)}
        idx_to_mid = {idx: mid for mid, idx in mid_to_idx.items()}

        score_matrix = np.zeros((len(user_ids), len(menu_ids)))
        for f in feedbacks:
            u_idx = uid_to_idx[f.user_id]
            m_idx = mid_to_idx[f.menu_id]
            score_matrix[u_idx][m_idx] = calculate_adjusted_score(f.satisfied_count, f.skipped_count)

        menu_scores = defaultdict(list)
        if user_id not in uid_to_idx:
            from models.users import User
            target = self.db.query(User).first()
            similar_user_ids = [
                u.id for u in self.db.query(User).all()
                if u.gender == target.gender and u.age == target.age
            ]
            if not similar_user_ids:
                return {}

            for uid in similar_user_ids:
                u_idx = uid_to_idx[uid]
                for m_idx in range(len(menu_ids)):
                    score = score_matrix[u_idx][m_idx]
                    if score > 0:
                        menu_scores[idx_to_mid[m_idx]].append(score)

        else:
            target_idx = uid_to_idx[user_id]
            similarities = cosine_similarity([score_matrix[target_idx]], score_matrix)[0]

            for other_idx, sim in enumerate(similarities):
                if other_idx == target_idx:
                    continue
                for m_idx in range(len(menu_ids)):
                    menu_scores[idx_to_mid[m_idx]].append(sim * score_matrix[other_idx][m_idx])

        avg_scores = {mid: np.mean(scores) for mid, scores in menu_scores.items() if scores}
        return avg_scores