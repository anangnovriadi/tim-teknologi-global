import pytest
from app.utils.helpers import calculate_stock_status


class TestStockStatusLogic:
    """Test suite for stock status calculation logic."""
    
    def test_out_of_stock_when_quantity_is_zero(self):
        """Quantity = 0 should return OUT_OF_STOCK."""
        assert calculate_stock_status(0, 10) == "OUT_OF_STOCK"
    
    def test_out_of_stock_with_zero_threshold(self):
        """Quantity = 0 should return OUT_OF_STOCK regardless of threshold."""
        assert calculate_stock_status(0, 0) == "OUT_OF_STOCK"
        assert calculate_stock_status(0, 100) == "OUT_OF_STOCK"
    
    def test_low_stock_when_quantity_equals_threshold(self):
        """Quantity = Threshold should return LOW_STOCK."""
        assert calculate_stock_status(10, 10) == "LOW_STOCK"
    
    def test_low_stock_when_quantity_below_threshold(self):
        """Quantity < Threshold should return LOW_STOCK."""
        assert calculate_stock_status(5, 10) == "LOW_STOCK"
        assert calculate_stock_status(1, 10) == "LOW_STOCK"
    
    def test_low_stock_boundary(self):
        """Test low stock at boundary conditions."""
        # Just at threshold
        assert calculate_stock_status(10, 10) == "LOW_STOCK"
        # One below threshold should still be low stock if not zero
        assert calculate_stock_status(9, 10) == "LOW_STOCK"
    
    def test_in_stock_when_quantity_above_threshold(self):
        """Quantity > Threshold should return IN_STOCK."""
        assert calculate_stock_status(20, 10) == "IN_STOCK"
        assert calculate_stock_status(11, 10) == "IN_STOCK"
        assert calculate_stock_status(100, 10) == "IN_STOCK"
    
    def test_in_stock_with_zero_threshold(self):
        """Any quantity > 0 with threshold 0 should return IN_STOCK."""
        assert calculate_stock_status(1, 0) == "IN_STOCK"
        assert calculate_stock_status(100, 0) == "IN_STOCK"
    
    def test_in_stock_boundary(self):
        """Test in stock at boundary (threshold + 1)."""
        assert calculate_stock_status(11, 10) == "IN_STOCK"
        assert calculate_stock_status(1, 0) == "IN_STOCK"
    
    def test_large_quantities(self):
        """Test with large quantity values."""
        assert calculate_stock_status(1000000, 500000) == "IN_STOCK"
        assert calculate_stock_status(500000, 500000) == "LOW_STOCK"
        assert calculate_stock_status(100000, 500000) == "LOW_STOCK"
    
    def test_status_consistency(self):
        """Verify status transitions are consistent."""
        # Status should only be one of three values
        statuses = [
            calculate_stock_status(0, 10),
            calculate_stock_status(5, 10),
            calculate_stock_status(10, 10),
            calculate_stock_status(20, 10),
        ]
        valid_statuses = {"OUT_OF_STOCK", "LOW_STOCK", "IN_STOCK"}
        for status in statuses:
            assert status in valid_statuses
