import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import User, InventoryItem
from app.utils import hash_password


def seed_users():
    db = SessionLocal()
    
    try:
        user_count = db.query(User).count()
        if user_count > 0:
            print("✓ Users already exist, skipping user seeding")
            return
        
        users = [
            User(
                fullname="Admin",
                email="admin@mail.com",
                password=hash_password("Admin123"),
                is_active=True
            ),
        ]
        
        db.add_all(users)
        db.commit()
        print(f"✓ Created {len(users)} sample users")
        
    except Exception as e:
        print(f"✗ Failed to seed users: {str(e)}")
        db.rollback()
    finally:
        db.close()


def seed_inventory():
    db = SessionLocal()
    
    try:
        inventory_count = db.query(InventoryItem).count()
        if inventory_count > 0:
            print("✓ Inventory items already exist, skipping inventory seeding")
            return
        
        items = [
            InventoryItem(
                sku="SKU001",
                name="Laptop Computer",
                category="Electronics",
                warehouse="Warehouse A",
                quantity_on_hand=45,
                reorder_threshold=10
            ),
            InventoryItem(
                sku="SKU002",
                name="Office Chair",
                category="Furniture",
                warehouse="Warehouse B",
                quantity_on_hand=150,
                reorder_threshold=20
            ),
            InventoryItem(
                sku="SKU003",
                name="Desk Lamp",
                category="Lighting",
                warehouse="Warehouse A",
                quantity_on_hand=5,
                reorder_threshold=15
            ),
            InventoryItem(
                sku="SKU004",
                name="Monitor 27 inch",
                category="Electronics",
                warehouse="Warehouse C",
                quantity_on_hand=32,
                reorder_threshold=5
            ),
            InventoryItem(
                sku="SKU005",
                name="Keyboard Mechanical",
                category="Accessories",
                warehouse="Warehouse B",
                quantity_on_hand=78,
                reorder_threshold=15
            ),
        ]
        
        db.add_all(items)
        db.commit()
        print(f"✓ Created {len(items)} sample inventory items")
        
    except Exception as e:
        print(f"✗ Failed to seed inventory: {str(e)}")
        db.rollback()
    finally:
        db.close()


def seed_all():
    print("Starting database seeding...\n")
    
    seed_users()
    seed_inventory()
    
    print("\n✓ Database seeding completed!")


if __name__ == "__main__":
    seed_all()
