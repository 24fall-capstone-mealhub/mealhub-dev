from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
import sys
import traceback

from core.database import get_db
from models.menu import Menu
from schemas.recommend import RecommendRequest, RecommendItem, RecommendResponse
from utils.weather_api import get_temp_and_humidity
from recommendation.deep_hybrid import DeepHybridRecommender
from recommendation.group import GroupRecommender

router = APIRouter()

@router.post("/")
def get_recommendations(
    request: RecommendRequest, db: Session = Depends(get_db)
):
    try:
        menus = db.query(Menu.id, Menu.name).all()
        mid_to_name = {mid: name for mid, name in menus} 

        temp, humidity = get_temp_and_humidity(request.lat, request.lon)
        hr= DeepHybridRecommender(db).recommend(request.user_id[0], request.timestamp, temp, humidity)

        result = [
            RecommendItem(menu_id=mid, menu_name=mid_to_name.get(mid, "unknown"))
            for mid in hr.keys()
        ]

        return RecommendResponse(recommendations=result)
    
    except Exception as e:
        print(f"[ERROR] Exception Type: {type(e).__name__}", file=sys.stderr)
        print(f"[ERROR] Exception Message: {e}", file=sys.stderr)
        print(f"[ERROR] Exception Args: {e.args}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        raise HTTPException(
        status_code=500,
        detail="Internal server error"
    )
    
@router.post("/group")
def get_recommendations(
    request: RecommendRequest, db: Session = Depends(get_db)
):
    try:
        menus = db.query(Menu.id, Menu.name).all()
        mid_to_name = {mid: name for mid, name in menus}        

        temp, humidity = get_temp_and_humidity(request.lat, request.lon)
        gr= GroupRecommender(db).recommend(request.user_id, request.timestamp, temp, humidity)

        result = [
            RecommendItem(menu_id=mid, menu_name=mid_to_name.get(mid, "unknown"))
            for mid in gr.keys()
        ]

        return RecommendResponse(recommendations=result)
    
    except Exception as e:
        print(f"[ERROR] Exception Type: {type(e).__name__}", file=sys.stderr)
        print(f"[ERROR] Exception Message: {e}", file=sys.stderr)
        print(f"[ERROR] Exception Args: {e.args}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        raise HTTPException(
        status_code=500,
        detail="Internal server error"
    )
    