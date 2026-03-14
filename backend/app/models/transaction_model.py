from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..database import Base


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), index=True)
    warehouse = Column(String(100))
    transaction_type = Column(String(50))  # restock, sale, adjustment
    quantity = Column(Integer)
    timestamp = Column(DateTime, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    notes = Column(String(255), nullable=True)
