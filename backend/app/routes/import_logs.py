from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import ImportLog
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


@router.get("/logs")
def get_import_logs(
    import_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    query = db.query(ImportLog).order_by(ImportLog.created_at.desc())
    
    if import_type:
        query = query.filter(ImportLog.import_type == import_type)
    
    logs = query.limit(limit).all()
    
    return [
        {
            "log_id": log.log_id,
            "import_type": log.import_type,
            "total_rows": log.total_rows,
            "accepted_rows": log.accepted_rows,
            "rejected_rows": log.rejected_rows,
            "errors": log.errors,
            "status": log.status,
            "created_at": log.created_at.isoformat(),
        }
        for log in logs
    ]


@router.get("/logs/{log_id}")
def get_import_log_detail(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(verify_bearer_token)
):
    log = db.query(ImportLog).filter(ImportLog.log_id == log_id).first()
    
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log not found")
    
    return {
        "log_id": log.log_id,
        "import_type": log.import_type,
        "total_rows": log.total_rows,
        "accepted_rows": log.accepted_rows,
        "rejected_rows": log.rejected_rows,
        "errors": log.errors,
        "status": log.status,
        "created_at": log.created_at.isoformat(),
    }


@router.get("/verify/count")
def verify_import_logs_count(db: Session = Depends(get_db)):
    try:
        count = db.query(ImportLog).count()
        all_logs = db.query(ImportLog).all()
        return {
            "status": "ok",
            "total_logs": count,
            "details": [
                {
                    "log_id": log.log_id,
                    "import_type": log.import_type,
                    "total_rows": log.total_rows,
                    "accepted_rows": log.accepted_rows,
                    "rejected_rows": log.rejected_rows,
                    "status": log.status,
                    "created_at": log.created_at.isoformat(),
                }
                for log in all_logs
            ]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
