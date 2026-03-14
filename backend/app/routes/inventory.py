
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from ..database import SessionLocal
from ..controllers.inventory_controller import InventoryController
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


class InventoryCreateRequest(BaseModel):
    sku: str
    name: str
    category: str
    warehouse: str
    quantity_on_hand: int
    reorder_threshold: int


class InventoryUpdateRequest(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    warehouse: Optional[str] = None
    quantity_on_hand: Optional[int] = None
    reorder_threshold: Optional[int] = None


@router.get("/")
def list_inventory(db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    return InventoryController.get_all_inventory(db)


@router.get("/{item_id}")
def get_inventory(item_id: int, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = InventoryController.get_inventory_by_id(item_id, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result["error"])
    return result


@router.post("/")
def create_inventory(request: InventoryCreateRequest, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = InventoryController.create_inventory(request.dict(), db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result["item"]


@router.put("/{item_id}")
def update_inventory(item_id: int, request: InventoryUpdateRequest, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = InventoryController.update_inventory(item_id, request.dict(exclude_unset=True), db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["error"])
    return result["item"]


@router.delete("/{item_id}")
def delete_inventory(item_id: int, db: Session = Depends(get_db), current_user: str = Depends(verify_bearer_token)):
    result = InventoryController.delete_inventory(item_id, db)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result["error"])
    return result


@router.post("/import")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    content = await file.read()
    result = InventoryController.import_inventory_csv(content, db)
    InventoryController.save_inventory_import_log(content, db, result)
    return result

