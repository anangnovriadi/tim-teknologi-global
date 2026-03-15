from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from ..database import SessionLocal
from ..controllers.category_controller import CategoryController
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


class CategoryCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


@router.get("/")
def list_categories(db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    return CategoryController.get_all_categories(db)


@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = CategoryController.get_category_by_id(category_id, db)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result["error"])
    return result


@router.post("/")
def create_category(request: CategoryCreateRequest, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = CategoryController.create_category(request.dict(), db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result["category"]


@router.put("/{category_id}")
def update_category(category_id: int, request: CategoryUpdateRequest, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = CategoryController.update_category(category_id, request.dict(exclude_unset=True), db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result["category"]


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = CategoryController.delete_category(category_id, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result
