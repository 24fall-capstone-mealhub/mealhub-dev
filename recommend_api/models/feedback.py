from sqlalchemy import Column, Integer, ForeignKey
from core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    menu_id = Column(Integer, ForeignKey("food.id"))
    satisfied_count = Column(Integer, default=0)
    skipped_count = Column(Integer, default=0)
