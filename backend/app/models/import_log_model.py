from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from ..database import Base


class ImportLog(Base):
    __tablename__ = "import_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    import_type = Column(String(50), index=True)  # inventory or transaction
    total_rows = Column(Integer)
    accepted_rows = Column(Integer)
    rejected_rows = Column(Integer)
    errors = Column(JSON, nullable=True)
    status = Column(String(20))  # success or failed
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(Integer, nullable=True)
