from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.feedback import Feedback
from models.feedback_log import FeedbackLog
from schemas.feedback import InitFeedbackRequest, FeedbackActionRequest
from utils.convert_time import convert_timestamp_to_slot
from utils.weather_api import get_temp_and_humidity
from datetime import datetime

router = APIRouter()

@router.post("/init")
def init_feedback(request: InitFeedbackRequest, db: Session = Depends(get_db)):
    try:
        for menu_id in request.favorite_menu_ids:
            feedback = db.query(Feedback).filter_by(user_id=request.user_id, menu_id=menu_id).first()
            if feedback:
                feedback.satisfied_count = max(feedback.satisfied_count, 5)
            else:
                feedback = Feedback(
                    user_id=request.user_id,
                    menu_id=menu_id,
                    satisfied_count=5,
                    skipped_count=0
                )
                db.add(feedback)

        db.commit()
        return {"message": "Initial favorite feedback recorded."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/satisfy")
def satisfy_feedback(request: FeedbackActionRequest, db: Session = Depends(get_db)):
    try:
        for u in request.user_id:
            feedback = db.query(Feedback).filter_by(user_id=u, menu_id=request.menu_id).first()
            if feedback:
                feedback.satisfied_count += 2
            else:
                feedback = Feedback(
                    user_id=request.user_id,
                    menu_id=request.menu_id,
                    satisfied_count=2,
                    skipped_count=0
                )
                db.add(feedback)

            time_slot = convert_timestamp_to_slot(request.timestamp)
            temp, humidity = get_temp_and_humidity(request.lat, request.lon)

            log = FeedbackLog(
                timestamp=datetime.fromisoformat(request.timestamp),
                user_id=request.user_id,
                menu_id=request.menu_id,
                time_slot=time_slot,
                temperature = temp,
                humidity = humidity,
                satisfied=1
            )
            db.add(log)
            db.flush()
        db.commit()
        return {"message": "Satisfaction feedback recorded."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/skip")
def skip_feedback(request: FeedbackActionRequest, db: Session = Depends(get_db)):
    try:
        for u in request.user_id:
            feedback = db.query(Feedback).filter_by(user_id=u, menu_id=request.menu_id).first()
            if feedback:
                feedback.skipped_count += 1
            else:
                feedback = Feedback(
                    user_id=request.user_id,
                    menu_id=request.menu_id,
                    satisfied_count=0,
                    skipped_count=1
                )
                db.add(feedback)

            time_slot = convert_timestamp_to_slot(request.timestamp)
            temp, humidity = get_temp_and_humidity(request.lat, request.lon)

            log = FeedbackLog(
                timestamp=datetime.fromisoformat(request.timestamp),
                user_id=request.user_id,
                menu_id=request.menu_id,
                time_slot=time_slot,
                temperature = temp,
                humidity = humidity,
                satisfied=1
            )
            db.add(log)
            db.flush()
        db.commit()
        return {"message": "Skip feedback recorded."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))