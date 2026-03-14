import csv
import io
from sqlalchemy.orm import Session
from ..models import InventoryItem
from pydantic import BaseModel
from typing import Optional


class InventoryController:

    @staticmethod
    def get_all_inventory(db: Session):
        return db.query(InventoryItem).all()

    @staticmethod
    def get_inventory_by_id(item_id: int, db: Session):
        item = db.query(InventoryItem).filter(InventoryItem.item_id == item_id).first()
        if not item:
            return {"error": "Item not found"}
        return item

    @staticmethod
    def create_inventory(data: dict, db: Session) -> dict:
        try:
            if not data.get("sku") or not data.get("name"):
                return {"error": "SKU and name are required"}
            
            existing = db.query(InventoryItem).filter(InventoryItem.sku == data["sku"]).first()
            if existing:
                return {"error": "SKU already exists"}
            
            item = InventoryItem(
                sku=data["sku"],
                name=data["name"],
                category=data.get("category", ""),
                warehouse=data.get("warehouse", ""),
                quantity_on_hand=int(data.get("quantity_on_hand", 0)),
                reorder_threshold=int(data.get("reorder_threshold", 0))
            )
            db.add(item)
            db.commit()
            db.refresh(item)
            return {"success": True, "item": item}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def update_inventory(item_id: int, data: dict, db: Session) -> dict:
        try:
            item = db.query(InventoryItem).filter(InventoryItem.item_id == item_id).first()
            if not item:
                return {"error": "Item not found"}
            
            if "sku" in data and data["sku"] != item.sku:
                existing = db.query(InventoryItem).filter(InventoryItem.sku == data["sku"]).first()
                if existing:
                    return {"error": "SKU already exists"}
            
            for key, value in data.items():
                if hasattr(item, key) and key != "item_id":
                    if key in ["quantity_on_hand", "reorder_threshold"]:
                        setattr(item, key, int(value))
                    else:
                        setattr(item, key, value)
            
            db.commit()
            db.refresh(item)
            return {"success": True, "item": item}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def delete_inventory(item_id: int, db: Session) -> dict:
        try:
            item = db.query(InventoryItem).filter(InventoryItem.item_id == item_id).first()
            if not item:
                return {"error": "Item not found"}
            
            db.delete(item)
            db.commit()
            return {"success": True, "message": "Item deleted"}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def import_inventory_csv(file_content: bytes, db: Session) -> dict:
        reader = csv.DictReader(io.StringIO(file_content.decode("utf-8")))

        total = 0
        accepted = 0
        rejected = 0
        errors = []

        for i, row in enumerate(reader, start=2):
            total += 1
            try:
                sku = row.get("sku", "").strip()
                name = row.get("name", "").strip()
                category = row.get("category", "").strip()
                warehouse = row.get("warehouse", "").strip()
                quantity_on_hand = int(row.get("quantity_on_hand", 0))
                reorder_threshold = int(row.get("reorder_threshold", 0))

                if not sku or not name:
                    raise ValueError("SKU and name are required")

                existing = db.query(InventoryItem).filter(InventoryItem.sku == sku).first()
                if existing:
                    raise ValueError(f"SKU '{sku}' already exists")

                item = InventoryItem(
                    sku=sku,
                    name=name,
                    category=category,
                    warehouse=warehouse,
                    quantity_on_hand=quantity_on_hand,
                    reorder_threshold=reorder_threshold
                )
                db.add(item)
                db.commit()
                accepted += 1

            except (ValueError, KeyError) as e:
                db.rollback()
                rejected += 1
                errors.append({
                    "row": i,
                    "error": str(e),
                    "data": dict(row) if isinstance(row, dict) else None
                })

        return {
            "total_rows": total,
            "accepted_rows": accepted,
            "rejected_rows": rejected,
            "errors": errors,
            "success": total > 0 and rejected == 0
        }
