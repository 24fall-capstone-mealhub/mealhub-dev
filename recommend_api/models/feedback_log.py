from sqlalchemy import Column, Integer, Float, ForeignKey, String, DateTime
from core.database import Base
from datetime import datetime

class FeedbackLog(Base):
    __tablename__ = "feedback_log"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, index=True)
    menu_id = Column(Integer, ForeignKey("food.id"))
    time_slot = Column(String)
    temperature = Column(Float)
    humidity = Column(Float)
    satisfied = Column(Integer)
    