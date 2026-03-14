from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from ..database import SessionLocal
from ..controllers.transaction_controller import TransactionController
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


@router.post("/import")
async def import_transactions(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    """
    Bulk import inventory transactions from CSV file
    
    CSV should contain columns: sku, warehouse, transaction_type, quantity, timestamp
    - transaction_type: restock, sale, adjustment
    - timestamp: ISO format (YYYY-MM-DD HH:MM:SS)
    """
    content = await file.read()
    result = TransactionController.import_transactions_csv(content, db)
    return result


@router.get("/history")
def get_transaction_history(
    sku: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    """Get transaction history"""
    transactions = TransactionController.get_transaction_history(db, sku, limit)
    return {"transactions": transactions}
