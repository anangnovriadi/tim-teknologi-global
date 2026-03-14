import pytest
import json
from unittest.mock import patch
from app.models import InventoryItem
from datetime import datetime, timedelta
from app.utils.jwt_utils import create_access_token


class TestInventoryEndpoints:
    """Test suite for inventory API endpoints."""
    
    @pytest.fixture
    def valid_token(self):
        """Create a valid JWT token for testing."""
        return create_access_token(data={"sub": "testuser"})
    
    @pytest.fixture
    def sample_item(self, db):
        """Create a sample inventory item for testing."""
        item = InventoryItem(
            sku="SKU001",
            name="Test Product",
            category="Electronics",
            warehouse="Main",
            quantity_on_hand=50,
            reorder_threshold=10
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    
    def test_list_inventory_without_token(self, client):
        """Test that GET /inventory requires authentication."""
        response = client.get("/inventory/")
        assert response.status_code == 401
        assert "Invalid or expired token" in response.json()["detail"]
    
    def test_list_inventory_with_invalid_token(self, client):
        """Test that invalid token is rejected."""
        response = client.get(
            "/inventory/",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 401
    
    def test_list_inventory_with_bearer_token(self, client, sample_item, valid_token):
        """Test successful GET /inventory with valid token."""
        response = client.get(
            "/inventory/",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["sku"] == "SKU001"
        assert data[0]["name"] == "Test Product"
    
    def test_list_inventory_empty(self, client, valid_token):
        """Test GET /inventory returns empty list when no items."""
        response = client.get(
            "/inventory/",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data == []
    
    def test_get_inventory_by_id_success(self, client, sample_item, valid_token):
        """Test GET /inventory/{id} with valid item ID."""
        response = client.get(
            f"/inventory/{sample_item.item_id}",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == sample_item.item_id
        assert data["sku"] == "SKU001"
    
    def test_get_inventory_by_id_not_found(self, client, valid_token):
        """Test GET /inventory/{id} returns 404 for non-existent item."""
        response = client.get(
            "/inventory/999999",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 404
        assert "Item not found" in response.json()["detail"]
    
    def test_create_inventory_success(self, client, valid_token):
        """Test POST /inventory creates a new item."""
        payload = {
            "sku": "SKU002",
            "name": "New Product",
            "category": "Furniture",
            "warehouse": "Warehouse B",
            "quantity_on_hand": 30,
            "reorder_threshold": 8
        }
        response = client.post(
            "/inventory/",
            json=payload,
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["sku"] == "SKU002"
        assert data["name"] == "New Product"
        assert data["quantity_on_hand"] == 30
    
    def test_create_inventory_missing_required_field(self, client, valid_token):
        """Test POST /inventory fails without required fields."""
        payload = {
            "sku": "SKU002",
            # Missing 'name' field
            "category": "Furniture",
            "warehouse": "Warehouse B",
            "quantity_on_hand": 30,
            "reorder_threshold": 8
        }
        response = client.post(
            "/inventory/",
            json=payload,
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 422  # Validation error
    
    def test_create_inventory_duplicate_sku(self, client, sample_item, valid_token):
        """Test POST /inventory rejects duplicate SKU."""
        payload = {
            "sku": "SKU001",  # Already exists
            "name": "Different Product",
            "category": "Electronics",
            "warehouse": "Main",
            "quantity_on_hand": 50,
            "reorder_threshold": 10
        }
        response = client.post(
            "/inventory/",
            json=payload,
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 400
        assert "SKU already exists" in response.json()["detail"]
    
    def test_update_inventory_success(self, client, sample_item, valid_token):
        """Test PUT /inventory/{id} updates an item."""
        payload = {
            "quantity_on_hand": 100,
            "reorder_threshold": 15
        }
        response = client.put(
            f"/inventory/{sample_item.item_id}",
            json=payload,
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["quantity_on_hand"] == 100
        assert data["reorder_threshold"] == 15
        # Verify other fields unchanged
        assert data["sku"] == "SKU001"
    
    def test_update_inventory_not_found(self, client, valid_token):
        """Test PUT /inventory/{id} with non-existent item."""
        payload = {"quantity_on_hand": 100}
        response = client.put(
            "/inventory/999999",
            json=payload,
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 404
    
    def test_delete_inventory_success(self, client, sample_item, valid_token):
        """Test DELETE /inventory/{id} removes an item."""
        response = client.delete(
            f"/inventory/{sample_item.item_id}",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 200
        assert response.json()["success"] is True
        
        # Verify item was deleted
        response = client.get(
            f"/inventory/{sample_item.item_id}",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 404
    
    def test_delete_inventory_not_found(self, client, valid_token):
        """Test DELETE /inventory/{id} with non-existent item."""
        response = client.delete(
            "/inventory/999999",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        assert response.status_code == 404
    
    def test_invalid_auth_scheme(self, client, valid_token):
        """Test that non-Bearer auth scheme is rejected."""
        response = client.get(
            "/inventory/",
            headers={"Authorization": f"Basic {valid_token}"}
        )
        assert response.status_code == 401
    
    def test_malformed_authorization_header(self, client):
        """Test that malformed Authorization header is rejected."""
        response = client.get(
            "/inventory/",
            headers={"Authorization": "JustAToken"}
        )
        assert response.status_code == 401
