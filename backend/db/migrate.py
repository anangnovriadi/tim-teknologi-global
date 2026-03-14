import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import engine, Base
from app.models import InventoryItem, User, InventoryTransaction, ImportLog


def migrate():
    print("Creating database tables...")
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Database migration completed successfully!")
        print("✓ Tables created: users, inventory_items, inventory_transactions, import_logs")
    except Exception as e:
        print(f"✗ Migration failed: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    migrate()
