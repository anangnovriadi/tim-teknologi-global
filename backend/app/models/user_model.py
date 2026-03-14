from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from ..database import Base


class User(Base):
    """
    User model for authentication and user management
    
    Attributes:
        id: Primary key, unique identifier
        fullname: User's full name
        email: User's email (unique)
        password: Hashed password
        is_active: Whether the user account is active
        created_at: Account creation timestamp
        updated_at: Last update timestamp
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
