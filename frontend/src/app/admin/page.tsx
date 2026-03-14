"use client";

import DashboardLayout from "@/components/layouts/layout-dashboard";
import { useGetAllInventoryQuery } from "@/store/api/inventory-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryVisualization } from "@/components/inventory-visualization";
import { Package, AlertCircle, Loader2 } from "lucide-react";

export default function Page() {
  const { data: inventoryItems = [], isLoading } = useGetAllInventoryQuery();

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity_on_hand <= item.reorder_threshold
  ).length;

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Total Items</CardTitle>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div>
                <p className="text-4xl font-bold">{totalItems}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Total inventory items
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Low Stock</CardTitle>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <div>
                <p className="text-4xl font-bold">{lowStockItems}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Items with low stock
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <InventoryVisualization items={inventoryItems} />
    </DashboardLayout>
  );
}
