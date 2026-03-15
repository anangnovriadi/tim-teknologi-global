
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import InventoryItem, User, InventoryTransaction, ImportLog, Warehouse, Category
from .routes.inventory import router as inventory_router
from .routes.auth import router as auth_router
from .routes.transactions import router as transactions_router
from .routes.import_logs import router as import_logs_router
from .routes.warehouse import router as warehouse_router
from .routes.category import router as category_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["authentication"])
app.include_router(inventory_router, prefix="/inventory", tags=["inventory"])
app.include_router(warehouse_router, prefix="/warehouse", tags=["warehouse"])
app.include_router(category_router, prefix="/category", tags=["category"])
app.include_router(transactions_router, prefix="/transactions", tags=["transactions"])
app.include_router(import_logs_router, prefix="/import-logs", tags=["import-logs"])
