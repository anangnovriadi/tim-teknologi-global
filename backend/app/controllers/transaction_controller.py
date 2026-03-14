import csv
import io
from datetime import datetime
from sqlalchemy.orm import Session
from ..models import InventoryTransaction, InventoryItem
from typing import List, Dict, Any


class TransactionController:

    @staticmethod
    def import_transactions_csv(file_content: bytes, db: Session) -> dict:
        """
        Import inventory transactions from CSV file
        """
        try:
            reader = csv.DictReader(io.StringIO(file_content.decode("utf-8")))
        except Exception as e:
            return {
                "total_rows": 0,
                "accepted_rows": 0,
                "rejected_rows": 0,
                "errors": [{"row": 0, "error": f"CSV parsing error: {str(e)}"}],
                "success": False
            }

        total = 0
        accepted = 0
        rejected = 0
        errors = []
        valid_transaction_types = ["restock", "sale", "adjustment"]

        for i, row in enumerate(reader, start=1):
            total += 1
            try:
                sku = row.get("sku", "").strip()
                warehouse = row.get("warehouse", "").strip()
                transaction_type = row.get("transaction_type", "").strip().lower()
                quantity_str = row.get("quantity", "").strip()
                timestamp_str = row.get("timestamp", "").strip()

                if not sku:
                    raise ValueError("SKU is required")
                if not warehouse:
                    raise ValueError("Warehouse is required")
                if not transaction_type:
                    raise ValueError("Transaction type is required")
                if not quantity_str:
                    raise ValueError("Quantity is required")
                if not timestamp_str:
                    raise ValueError("Timestamp is required")

                if transaction_type not in valid_transaction_types:
                    raise ValueError(f"Invalid transaction type: {transaction_type}. Must be one of: {', '.join(valid_transaction_types)}")

                try:
                    quantity = int(quantity_str)
                    if quantity < 0 and transaction_type != "adjustment":
                        raise ValueError("Quantity must be positive for restock and sale")
                except ValueError as e:
                    raise ValueError(f"Invalid quantity: {str(e)}")

                try:
                    timestamp = datetime.fromisoformat(timestamp_str)
                except ValueError:
                    try:
                        timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
                    except ValueError:
                        raise ValueError(f"Invalid timestamp format: {timestamp_str}. Use ISO format (YYYY-MM-DD HH:MM:SS)")

                existing_item = db.query(InventoryItem).filter(InventoryItem.sku == sku).first()
                if not existing_item:
                    raise ValueError(f"SKU '{sku}' not found in inventory")

                transaction = InventoryTransaction(
                    sku=sku,
                    warehouse=warehouse,
                    transaction_type=transaction_type,
                    quantity=quantity,
                    timestamp=timestamp
                )
                db.add(transaction)
                
                if transaction_type == "restock":
                    existing_item.quantity_on_hand += quantity
                elif transaction_type == "sale":
                    if existing_item.quantity_on_hand < quantity:
                        raise ValueError(f"Insufficient stock: {existing_item.quantity_on_hand} available, {quantity} requested")
                    existing_item.quantity_on_hand -= quantity
                elif transaction_type == "adjustment":
                    existing_item.quantity_on_hand = quantity
                
                existing_item.updated_at = datetime.utcnow()
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

    @staticmethod
    def get_transaction_history(db: Session, sku: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get transaction history"""
        query = db.query(InventoryTransaction)
        
        if sku:
            query = query.filter(InventoryTransaction.sku == sku)
        
        transactions = query.order_by(InventoryTransaction.created_at.desc()).limit(limit).all()
        
        return [
            {
                "transaction_id": t.transaction_id,
                "sku": t.sku,
                "warehouse": t.warehouse,
                "transaction_type": t.transaction_type,
                "quantity": t.quantity,
                "timestamp": t.timestamp.isoformat(),
                "created_at": t.created_at.isoformat()
            }
            for t in transactions
        ]
