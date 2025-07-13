from sqlalchemy import Column, Integer, String, Boolean
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)
