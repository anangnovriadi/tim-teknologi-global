from sqlalchemy.orm import Session
from ..models import User
from ..utils.jwt_utils import hash_password, verify_password, create_access_token
from datetime import timedelta


class UserController:

    @staticmethod
    def register_user(fullname: str, email: str, password: str, db: Session) -> dict:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return {"error": "Email already registered"}

        hashed_password = hash_password(password)
        new_user = User(
            fullname=fullname,
            email=email,
            password=hashed_password,
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        access_token = create_access_token(data={"sub": new_user.email, "user_id": new_user.id})

        return {
            "user_id": new_user.id,
            "fullname": new_user.fullname,
            "email": new_user.email,
            "access_token": access_token,
            "token_type": "bearer"
        }

    @staticmethod
    def login_user(email: str, password: str, db: Session) -> dict:
        """
        Authenticate user and return access token
        
        Args:
            email: User's email
            password: Plain text password
            db: Database session
            
        Returns:
            Dictionary with user info and access token, or error message
        """
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"error": "Invalid credentials"}

        if not verify_password(password, user.password):
            return {"error": "Invalid credentials"}

        if not user.is_active:
            return {"error": "User account is inactive"}

        access_token = create_access_token(data={"sub": user.email, "user_id": user.id})

        return {
            "user_id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "access_token": access_token,
            "token_type": "bearer"
        }

    @staticmethod
    def get_user_by_email(email: str, db: Session) -> User:
        """
        Get user by email
        
        Args:
            email: User's email
            db: Database session
            
        Returns:
            User object or None
        """
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(user_id: int, db: Session) -> User:
        """
        Get user by ID
        
        Args:
            user_id: User's ID
            db: Database session
            
        Returns:
            User object or None
        """
        return db.query(User).filter(User.id == user_id).first()
