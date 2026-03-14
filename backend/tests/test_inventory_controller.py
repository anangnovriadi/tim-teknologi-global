import pytest
import csv
import io
from app.controllers.inventory_controller import InventoryController
from app.models import InventoryItem


class TestInventoryImportValidation:
    """Test suite for CSV import validation logic."""
    
    def create_csv_content(self, rows):
        """Helper to create CSV content from list of row dicts."""
        if not rows:
            return b""
        
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
        return output.getvalue().encode("utf-8")
    
    def test_valid_csv_import_single_row(self, db):
        """Test importing a single valid row."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product 1",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 1
        assert result["accepted_rows"] == 1
        assert result["rejected_rows"] == 0
        assert result["success"] is True
        assert len(result["errors"]) == 0
    
    def test_valid_csv_import_multiple_rows(self, db):
        """Test importing multiple valid rows."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product 1",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            },
            {
                "sku": "SKU002",
                "name": "Product 2",
                "category": "Furniture",
                "warehouse": "Warehouse B",
                "quantity_on_hand": "20",
                "reorder_threshold": "10"
            },
            {
                "sku": "SKU003",
                "name": "Product 3",
                "category": "Tools",
                "warehouse": "Warehouse C",
                "quantity_on_hand": "5",
                "reorder_threshold": "3"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 3
        assert result["accepted_rows"] == 3
        assert result["rejected_rows"] == 0
        assert result["success"] is True
        
        # Verify items were created
        items = db.query(InventoryItem).all()
        assert len(items) == 3
    
    def test_import_with_missing_required_sku(self, db):
        """Test that import rejects row with missing SKU."""
        csv_data = self.create_csv_content([
            {
                "sku": "",
                "name": "Product 1",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 1
        assert result["accepted_rows"] == 0
        assert result["rejected_rows"] == 1
        assert result["success"] is False
        assert len(result["errors"]) == 1
        assert "SKU and name are required" in result["errors"][0]["error"]
    
    def test_import_with_missing_required_name(self, db):
        """Test that import rejects row with missing name."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 1
        assert result["accepted_rows"] == 0
        assert result["rejected_rows"] == 1
        assert result["success"] is False
    
    def test_import_with_duplicate_sku(self, db):
        """Test that import rejects row with duplicate SKU."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product 1",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            },
            {
                "sku": "SKU001",
                "name": "Product 1 Duplicate",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "20",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 2
        assert result["accepted_rows"] == 1
        assert result["rejected_rows"] == 1
        assert result["success"] is False
        assert "already exists" in result["errors"][0]["error"]
    
    def test_import_with_invalid_quantity(self, db):
        """Test that import rejects row with invalid quantity."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product 1",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "invalid",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 1
        assert result["accepted_rows"] == 0
        assert result["rejected_rows"] == 1
        assert result["success"] is False
    
    def test_import_partial_success(self, db):
        """Test import with mix of valid and invalid rows."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product 1",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            },
            {
                "sku": "",
                "name": "Product 2",
                "category": "Furniture",
                "warehouse": "Warehouse B",
                "quantity_on_hand": "20",
                "reorder_threshold": "10"
            },
            {
                "sku": "SKU003",
                "name": "Product 3",
                "category": "Tools",
                "warehouse": "Warehouse C",
                "quantity_on_hand": "5",
                "reorder_threshold": "3"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["total_rows"] == 3
        assert result["accepted_rows"] == 2
        assert result["rejected_rows"] == 1
        assert result["success"] is False
        
        # Verify only valid items were created
        items = db.query(InventoryItem).all()
        assert len(items) == 2
    
    def test_import_with_whitespace_trimming(self, db):
        """Test that whitespace is properly trimmed."""
        csv_data = self.create_csv_content([
            {
                "sku": "  SKU001  ",
                "name": "  Product 1  ",
                "category": "  Electronics  ",
                "warehouse": "  Main  ",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["accepted_rows"] == 1
        
        item = db.query(InventoryItem).filter_by(sku="SKU001").first()
        assert item is not None
        assert item.name == "Product 1"
    
    def test_import_with_empty_optional_fields(self, db):
        """Test that empty optional fields are handled correctly."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product 1",
                "category": "",
                "warehouse": "",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert result["accepted_rows"] == 1
        item = db.query(InventoryItem).filter_by(sku="SKU001").first()
        assert item.category == ""
        assert item.warehouse == ""
    
    def test_import_error_details(self, db):
        """Test that error details include row number and data."""
        csv_data = self.create_csv_content([
            {
                "sku": "SKU001",
                "name": "Product Valid",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "10",
                "reorder_threshold": "5"
            },
            {
                "sku": "",
                "name": "Product Invalid",
                "category": "Electronics",
                "warehouse": "Main",
                "quantity_on_hand": "20",
                "reorder_threshold": "5"
            }
        ])
        
        result = InventoryController.import_inventory_csv(csv_data, db)
        
        assert len(result["errors"]) == 1
        error = result["errors"][0]
        assert error["row"] == 2  # Second row (after header)
        assert error["data"] is not None
