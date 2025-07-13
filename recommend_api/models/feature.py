from sqlalchemy import Column, Integer, Boolean, ForeignKey
from core.database import Base

class Feature(Base):
    __tablename__ = "food_feature"

    food_id = Column(Integer, ForeignKey("food.id"), primary_key=True)
    spicy = Column(Boolean, nullable=False)
    salty = Column(Boolean, nullable=False)
    sweet = Column(Boolean, nullable=False)
    greasy = Column(Boolean, nullable=False)
    fried = Column(Boolean, nullable=False)
    soup = Column(Boolean, nullable=False)
    cold = Column(Boolean, nullable=False)
    rice_based = Column(Boolean, nullable=False)
    noodle_based = Column(Boolean, nullable=False)
    healthy = Column(Boolean, nullable=False)