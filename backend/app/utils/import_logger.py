from sqlalchemy.orm import Session
from datetime import datetime
from ..models import ImportLog


def save_import_log(
    db: Session,
    import_type: str,
    total_rows: int,
    accepted_rows: int,
    rejected_rows: int,
    errors: list = None,
    user_id: int = None
):
    status = "success" if rejected_rows == 0 and total_rows > 0 else "failed"
    
    log = ImportLog(
        import_type=import_type,
        total_rows=total_rows,
        accepted_rows=accepted_rows,
        rejected_rows=rejected_rows,
        errors=errors or [],
        status=status,
        user_id=user_id
    )
    
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return log
