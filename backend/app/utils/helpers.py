
def calculate_stock_status(quantity_on_hand: int, reorder_threshold: int):
    if quantity_on_hand == 0:
        return "OUT_OF_STOCK"
    if quantity_on_hand <= reorder_threshold:
        return "LOW_STOCK"
    return "IN_STOCK"
