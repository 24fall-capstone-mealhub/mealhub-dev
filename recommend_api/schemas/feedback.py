from pydantic import BaseModel
from typing import List

class InitFeedbackRequest(BaseModel):
    user_id: int
    favorite_menu_ids: List[int]

class FeedbackActionRequest(BaseModel):
    user_id: List[int]
    menu_id: int
    timestamp: str
    lat: float
    lon: float