from sqlalchemy import Column, Integer, String, ForeignKey
from core.database import Base

class UserAllergy(Base):
    __tablename__ = "users_allergy"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    allergy_name = Column(String)