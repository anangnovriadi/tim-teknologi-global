from sqlalchemy.orm import Session
from ..models import Warehouse, InventoryItem


class WarehouseController:

    @staticmethod
    def get_all_warehouses(db: Session):
        return db.query(Warehouse).all()

    @staticmethod
    def get_warehouse_by_id(warehouse_id: int, db: Session):
        warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
        if not warehouse:
            return {"error": "Warehouse not found"}
        return warehouse

    @staticmethod
    def create_warehouse(data: dict, db: Session) -> dict:
        try:
            if not data.get("name"):
                return {"error": "Warehouse name is required"}
            
            existing = db.query(Warehouse).filter(Warehouse.name == data["name"]).first()
            if existing:
                return {"error": "Warehouse name already exists"}
            
            warehouse = Warehouse(
                name=data["name"],
                location=data.get("location"),
                description=data.get("description")
            )
            db.add(warehouse)
            db.commit()
            db.refresh(warehouse)
            return {"success": True, "warehouse": warehouse}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def update_warehouse(warehouse_id: int, data: dict, db: Session) -> dict:
        try:
            warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
            if not warehouse:
                return {"error": "Warehouse not found"}
            
            # Check if warehouse has items
            items_count = db.query(InventoryItem).filter(InventoryItem.warehouse == warehouse.name).count()
            if items_count > 0:
                return {"error": f"Cannot update warehouse with {items_count} item(s). Please move or delete items first."}
            
            if "name" in data and data["name"] != warehouse.name:
                existing = db.query(Warehouse).filter(Warehouse.name == data["name"]).first()
                if existing:
                    return {"error": "Warehouse name already exists"}
            
            for key, value in data.items():
                if hasattr(warehouse, key) and key != "warehouse_id":
                    setattr(warehouse, key, value)
            
            db.commit()
            db.refresh(warehouse)
            return {"success": True, "warehouse": warehouse}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def delete_warehouse(warehouse_id: int, db: Session) -> dict:
        try:
            warehouse = db.query(Warehouse).filter(Warehouse.warehouse_id == warehouse_id).first()
            if not warehouse:
                return {"error": "Warehouse not found"}
            
            # Check if warehouse has items
            items_count = db.query(InventoryItem).filter(InventoryItem.warehouse == warehouse.name).count()
            if items_count > 0:
                return {"error": f"Cannot delete warehouse with {items_count} item(s). Please move or delete items first."}
            
            db.delete(warehouse)
            db.commit()
            return {"success": True, "message": "Warehouse deleted"}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}
