from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..controllers.user_controller import UserController
from ..utils.jwt_utils import verify_token

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_bearer_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid authentication scheme")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload.get("sub")


class RegisterRequest(BaseModel):
    fullname: str
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "John Doe",
                "email": "john@example.com",
                "password": "password123"
            }
        }


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "password123"
            }
        }


class UpdateProfileRequest(BaseModel):
    fullname: str

    class Config:
        json_schema_extra = {
            "example": {
                "fullname": "John Doe Updated"
            }
        }


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    result = UserController.register_user(
        fullname=request.fullname,
        email=request.email,
        password=request.password,
        db=db
    )

    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])

    return result


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    result = UserController.login_user(
        email=request.email,
        password=request.password,
        db=db
    )

    if "error" in result:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result["error"])

    return result


@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    user = UserController.get_user_by_email(current_user, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return {
        "user_id": user.id,
        "fullname": user.fullname,
        "email": user.email
    }


@router.put("/profile")
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    user = UserController.get_user_by_email(current_user, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    result = UserController.update_user_profile(user.id, request.fullname, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    
    return result