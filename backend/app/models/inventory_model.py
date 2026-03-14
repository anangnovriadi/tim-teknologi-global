from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..database import Base


class InventoryItem(Base):
    __tablename__ = "inventory"

    item_id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True)
    name = Column(String(255))
    category = Column(String(100))
    warehouse = Column(String(100))
    quantity_on_hand = Column(Integer)
    reorder_threshold = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
