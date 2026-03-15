from sqlalchemy.orm import Session
from ..models import Category, InventoryItem


class CategoryController:

    @staticmethod
    def get_all_categories(db: Session):
        return db.query(Category).all()

    @staticmethod
    def get_category_by_id(category_id: int, db: Session):
        category = db.query(Category).filter(Category.category_id == category_id).first()
        if not category:
            return {"error": "Category not found"}
        return category

    @staticmethod
    def create_category(data: dict, db: Session) -> dict:
        try:
            if not data.get("name"):
                return {"error": "Category name is required"}
            
            existing = db.query(Category).filter(Category.name == data["name"]).first()
            if existing:
                return {"error": "Category name already exists"}
            
            category = Category(
                name=data["name"],
                description=data.get("description")
            )
            db.add(category)
            db.commit()
            db.refresh(category)
            return {"success": True, "category": category}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def update_category(category_id: int, data: dict, db: Session) -> dict:
        try:
            category = db.query(Category).filter(Category.category_id == category_id).first()
            if not category:
                return {"error": "Category not found"}
            
            # Check if category has items
            items_count = db.query(InventoryItem).filter(InventoryItem.category == category.name).count()
            if items_count > 0:
                return {"error": f"Cannot update category with {items_count} item(s). Please move or delete items first."}
            
            if "name" in data and data["name"] != category.name:
                existing = db.query(Category).filter(Category.name == data["name"]).first()
                if existing:
                    return {"error": "Category name already exists"}
            
            for key, value in data.items():
                if hasattr(category, key) and key != "category_id":
                    setattr(category, key, value)
            
            db.commit()
            db.refresh(category)
            return {"success": True, "category": category}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}

    @staticmethod
    def delete_category(category_id: int, db: Session) -> dict:
        try:
            category = db.query(Category).filter(Category.category_id == category_id).first()
            if not category:
                return {"error": "Category not found"}
            
            # Check if category has items
            items_count = db.query(InventoryItem).filter(InventoryItem.category == category.name).count()
            if items_count > 0:
                return {"error": f"Cannot delete category with {items_count} item(s). Please move or delete items first."}
            
            db.delete(category)
            db.commit()
            return {"success": True, "message": "Category deleted"}
        except Exception as e:
            db.rollback()
            return {"error": str(e)}
