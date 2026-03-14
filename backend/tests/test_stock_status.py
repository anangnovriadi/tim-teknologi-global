
from app.utils import calculate_stock_status

def test_low_stock():
    assert calculate_stock_status(5,10) == "LOW_STOCK"

def test_out_of_stock():
    assert calculate_stock_status(0,10) == "OUT_OF_STOCK"

def test_in_stock():
    assert calculate_stock_status(20,10) == "IN_STOCK"
