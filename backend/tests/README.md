# Test Suite Documentation

This directory contains comprehensive tests for the Inventory Management System covering critical business logic, validation, and API endpoints.

## Test Structure

### Backend Tests (`backend/tests/`)

#### 1. **test_stock_status.py** - Stock Status Logic Tests
Tests the core business logic for determining inventory stock status (IN_STOCK, LOW_STOCK, OUT_OF_STOCK).

**Coverage:**
- `calculate_stock_status()` function
- Boundary conditions (quantity exactly at threshold)
- Out of stock (quantity = 0)
- Low stock (quantity ≤ threshold)
- In stock (quantity > threshold)
- Edge cases with large quantities
- Status consistency validation

**Key Test Cases:**
```python
test_out_of_stock_when_quantity_is_zero()
test_low_stock_when_quantity_equals_threshold()
test_in_stock_when_quantity_above_threshold()
test_low_stock_boundary()
test_in_stock_boundary()
```

**Run Tests:**
```bash
pytest backend/tests/test_stock_status.py -v
```

---

#### 2. **test_inventory_controller.py** - Import Validation Logic Tests
Tests CSV import validation and error handling for inventory items.

**Coverage:**
- Valid single and multiple row imports
- Missing required fields (SKU, name)
- Duplicate SKU detection
- Invalid data type handling (e.g., non-integer quantities)
- Whitespace trimming
- Empty optional fields
- Partial import success (mix of valid/invalid rows)
- Error detail reporting

**Key Test Cases:**
```python
test_valid_csv_import_single_row()
test_valid_csv_import_multiple_rows()
test_import_with_missing_required_sku()
test_import_with_missing_required_name()
test_import_with_duplicate_sku()
test_import_with_invalid_quantity()
test_import_partial_success()
test_import_error_details()
```

**Run Tests:**
```bash
pytest backend/tests/test_inventory_controller.py -v
```

---

#### 3. **test_inventory_routes.py** - Backend Endpoint Tests
Tests the REST API endpoints for inventory management, including authentication and authorization.

**Coverage:**
- GET `/inventory/` - List all inventory items
- GET `/inventory/{id}` - Get single item by ID
- POST `/inventory/` - Create new item
- PUT `/inventory/{id}` - Update item
- DELETE `/inventory/{id}` - Delete item
- Bearer token authentication
- Authorization validation
- Error handling (404, 400, 401)
- Duplicate SKU prevention at API level

**Key Test Cases:**
```python
test_list_inventory_without_token()
test_list_inventory_with_invalid_token()
test_list_inventory_with_bearer_token()
test_get_inventory_by_id_success()
test_get_inventory_by_id_not_found()
test_create_inventory_success()
test_create_inventory_duplicate_sku()
test_update_inventory_success()
test_delete_inventory_success()
test_invalid_auth_scheme()
```

**Run Tests:**
```bash
pytest backend/tests/test_inventory_routes.py -v
```

---

### Frontend Tests (`frontend/src/__tests__/`)

#### **inventory-filters.test.ts** - Inventory Filter Behavior Tests
Tests the React component logic for filtering inventory by stock status.

**Coverage:**
- Filter option rendering (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
- Toggle filter selections on/off
- Multiple simultaneous selections
- Clear all filters
- Filter items by single status
- Filter items by multiple statuses
- Handle empty results
- Filter persistence across data updates
- Status badge color mapping

**Key Test Cases:**
```typescript
test('should display all stock status filter options')
test('should toggle status filters on and off')
test('should allow multiple status filters to be selected')
test('should clear all selected filters')
test('should filter items by selected status')
test('should filter items by multiple selected statuses')
test('should return empty list when no items match filter')
test('should maintain filter selections across data updates')
test('should map status to correct badge color')
```

**Run Tests:**
```bash
npm test -- inventory-filters.test.ts
```

---

## Setup & Installation

### Backend

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Ensure pytest and pytest-cov are installed:
```bash
pip install pytest pytest-cov
```

### Frontend

1. Install testing dependencies:
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

---

## Running Tests

### Run All Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Run Tests with Coverage Report
```bash
cd backend
pytest tests/ --cov=app --cov-report=html
```

### Run Specific Test File
```bash
cd backend
pytest tests/test_stock_status.py -v
```

### Run Specific Test Class
```bash
cd backend
pytest tests/test_inventory_controller.py::TestInventoryImportValidation -v
```

### Run Specific Test Case
```bash
cd backend
pytest tests/test_inventory_routes.py::TestInventoryEndpoints::test_list_inventory_with_bearer_token -v
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

---

## Test Data & Fixtures

### Backend Fixtures (`conftest.py`)

**Database Fixture:**
- Creates fresh in-memory SQLite database for each test
- Automatically cleans up after each test
- Ensures test isolation

**Client Fixture:**
- Provides TestClient with overridden database dependency
- Enables API endpoint testing without external dependencies

**Example Usage:**
```python
def test_example(db):
    """db fixture provides database session"""
    item = InventoryItem(sku="SKU001", ...)
    db.add(item)
    db.commit()
```

---

## Coverage Report

Generate HTML coverage report:
```bash
cd backend
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html
```

Expected coverage targets:
- **Stock Status Logic**: 100%
- **Import Validation**: 95%+
- **API Endpoints**: 90%+
- **Overall**: 85%+

---

## Test Data Examples

### Sample Inventory Item
```python
{
    "sku": "SKU001",
    "name": "Product Name",
    "category": "Electronics",
    "warehouse": "Main",
    "quantity_on_hand": 50,
    "reorder_threshold": 10
}
```

### Sample CSV Import
```csv
sku,name,category,warehouse,quantity_on_hand,reorder_threshold
SKU001,Product 1,Electronics,Main,50,10
SKU002,Product 2,Furniture,Warehouse B,30,5
SKU003,Product 3,Tools,Warehouse C,100,20
```

---

## Authentication Testing

Tests use JWT tokens generated by the `create_access_token()` function. Example:

```python
@pytest.fixture
def valid_token(self):
    return create_access_token(data={"sub": "testuser"})

def test_with_auth(client, valid_token):
    response = client.get(
        "/inventory/",
        headers={"Authorization": f"Bearer {valid_token}"}
    )
    assert response.status_code == 200
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run backend tests
  run: |
    cd backend
    pip install -r requirements.txt
    pytest tests/ --cov=app --cov-report=xml

- name: Run frontend tests
  run: |
    cd frontend
    npm install
    npm test -- --coverage
```

---

## Troubleshooting

### Import Errors
If tests fail with import errors:
```bash
# Ensure you're in the correct directory
cd backend
# Add backend to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest tests/
```

### Database Errors
If you see database-related errors:
- Tests use in-memory SQLite (`sqlite:///:memory:`)
- Ensure `conftest.py` is in the tests directory
- Check that all model imports are correct in `conftest.py`

### Token Errors
If authentication tests fail:
- Verify JWT secret is configured in `.env`
- Check that `create_access_token()` is working
- Review token expiration settings (default: 1440 minutes)

---

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Clear Assertions**: Use descriptive assertion messages
3. **Test Organization**: Group related tests in classes
4. **Mocking**: Mock external dependencies (avoid real database calls)
5. **Documentation**: Include docstrings explaining what each test validates
6. **Edge Cases**: Test boundary conditions and error scenarios
7. **Coverage**: Aim for >85% code coverage

---

## Future Test Enhancements

- [ ] Transaction import validation tests
- [ ] User authentication tests
- [ ] Permission/role-based access tests
- [ ] Performance/load testing
- [ ] E2E tests with Selenium/Cypress
- [ ] API documentation validation
- [ ] Database migration tests
