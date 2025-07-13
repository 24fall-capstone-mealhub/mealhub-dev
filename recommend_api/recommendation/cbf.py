import math
import numpy as np
import random
from sqlalchemy.orm import Session
from sklearn.metrics.pairwise import cosine_similarity

from core.database import get_db
from models.menu import Menu
from models.feature import Feature
from models.feedback import Feedback
from utils.score import calculate_adjusted_score
from utils.time_feature_map import TIME_FEATURE_MAP
from utils.weather_feature_map import get_weather_feature_map
from virtual.settings import FEATURES


class CBFRecommender:
    def __init__(self, db: Session = next(get_db())):
        self.db = db

    def recommend(self, user_id: int, time_slot: str, temp: float, humidity: float, recent_satisfied: list=None) -> dict:
        menus = self.db.query(Menu).all()
        menu_id_to_idx = {menu.id: idx for idx, menu in enumerate(menus)}
        idx_to_menu_id = {idx: menu.id for idx, menu in enumerate(menus)}

        features = self.db.query(Feature).all()
        feature_matrix = np.array([[
            f.spicy, f.salty, f.sweet, f.greasy, f.soup, f.fried,
            f.cold, f.rice_based, f.noodle_based, f.healthy
        ] for f in features])

        is_fall_back = False
        if recent_satisfied:
            liked_indices = [menu_id_to_idx[mid] for mid in recent_satisfied if mid in menu_id_to_idx]
            liked_vectors = feature_matrix[liked_indices]
            avg_vector = np.mean(liked_vectors, axis=0, keepdims=True)
            similarities = cosine_similarity(avg_vector, feature_matrix)[0]
        else:
            feedbacks = self.db.query(Feedback).filter(Feedback.user_id == user_id).all()
            
            scored_menu_ids = []
            for f in feedbacks:
                score = calculate_adjusted_score(f.satisfied_count, f.skipped_count)
                if score >= 4.0:
                    scored_menu_ids.append(f.menu_id)

            if scored_menu_ids:
                liked_indices = [menu_id_to_idx[mid] for mid in scored_menu_ids if mid in menu_id_to_idx]
                liked_vectors = feature_matrix[liked_indices]
                avg_vector = np.mean(liked_vectors, axis=0, keepdims=True)
                similarities = cosine_similarity(avg_vector, feature_matrix)[0]

            else:
                similarities = np.ones(len(menus))
                is_fall_back = True
        
        menu_scores = {idx_to_menu_id[idx]: sim for idx, sim in enumerate(similarities)}

        for mid in recent_satisfied:
            if mid in menu_scores:
                menu_scores[mid] *= 0.7

        time_weights = TIME_FEATURE_MAP.get(time_slot, {})
        weather_weights = get_weather_feature_map(temp, humidity)

        feature_names = FEATURES

        for f_idx, menu_id in enumerate(idx_to_menu_id.values()):
            for feature_name in feature_names:
                idx = feature_names.index(feature_name)
                if feature_matrix[f_idx][idx]:
                    if feature_name in time_weights:
                        menu_scores[menu_id] *= time_weights[feature_name]
                    if feature_name in weather_weights:
                        menu_scores[menu_id] *= weather_weights[feature_name]

        if is_fall_back:
            sim_min, sim_max = min(similarities), max(similarities)
            if sim_min != sim_max:
                low = sim_min + (sim_max - sim_min) * 0.2
                high = sim_max - (sim_max - sim_min) * 0.2
                for mid in menu_scores:
                    if math.isclose(menu_scores[mid], 1.0):
                        menu_scores[mid] = random.uniform(low, high)

        total_menus = list(menu_scores.keys())
        exploration_ratio = 0.2
        exploration_count = int(len(total_menus) * exploration_ratio)
        exploration_samples = random.sample(total_menus, k=exploration_count)

        for mid in exploration_samples:
            menu_scores[mid] *= random.uniform(1.05, 1.2)  # 소폭 boost

        return menu_scores