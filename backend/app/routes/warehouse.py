from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from ..database import SessionLocal
from ..controllers.warehouse_controller import WarehouseController
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


class WarehouseCreateRequest(BaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None


class WarehouseUpdateRequest(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


@router.get("/")
def list_warehouses(db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    return WarehouseController.get_all_warehouses(db)


@router.get("/{warehouse_id}")
def get_warehouse(warehouse_id: int, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = WarehouseController.get_warehouse_by_id(warehouse_id, db)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result["error"])
    return result


@router.post("/")
def create_warehouse(request: WarehouseCreateRequest, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = WarehouseController.create_warehouse(request.dict(), db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result["warehouse"]


@router.put("/{warehouse_id}")
def update_warehouse(warehouse_id: int, request: WarehouseUpdateRequest, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = WarehouseController.update_warehouse(warehouse_id, request.dict(exclude_unset=True), db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result["warehouse"]


@router.delete("/{warehouse_id}")
def delete_warehouse(warehouse_id: int, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = WarehouseController.delete_warehouse(warehouse_id, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result
