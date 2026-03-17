from sqlalchemy import Column, Integer, String
from database import Base

class ApplicationModel(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    role = Column(String, index=True)
    status = Column(String, index=True)
    notes = Column(String)