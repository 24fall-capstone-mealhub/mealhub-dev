from pydantic import BaseModel
from typing import List

class RecommendRequest(BaseModel):
    user_id: List[int]
    timestamp: str
    lat: float
    lon: float

class RecommendItem(BaseModel):
    menu_id: int
    menu_name: str

class RecommendResponse(BaseModel):
    recommendations: List[RecommendItem]