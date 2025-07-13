from sqlalchemy import Column, Integer, Float, String
from core.database import Base

class Menu(Base):
    __tablename__ = "food"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    calories = Column(Float)
    category_big = Column(String)
    category_med = Column(String)
    category_small = Column(String)