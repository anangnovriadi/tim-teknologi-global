from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..controllers.user_controller import UserController

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
