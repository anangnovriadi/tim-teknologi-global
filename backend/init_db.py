#!/usr/bin/env python3
"""
Initialize database and create all tables
Run this script to ensure all database tables are created
"""

from app.database import engine, Base
from app.models import InventoryItem, User, InventoryTransaction, ImportLog

print("🔧 Initializing database...")
print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("✅ Database initialized successfully!")
print("📋 Tables created:")
print("  - users")
print("  - inventory_items")  
print("  - inventory_transactions")
print("  - import_logs")
print("\n✨ Ready to start the server!")
