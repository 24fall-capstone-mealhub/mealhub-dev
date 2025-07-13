from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base

class FoodIngredient(Base):
    __tablename__ = "food_ingredients"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("food.id"))
    ingredients = Column(String)