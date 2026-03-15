"use client";

import DashboardLayout from "@/components/layouts/layout-dashboard";
import { useGetAllInventoryQuery } from "@/store/api/inventory-api";
import { useGetAllWarehousesQuery } from "@/store/api/warehouse-api";
import { useGetAllCategoriesQuery } from "@/store/api/category-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryVisualization } from "@/components/inventory-visualization";
import { Package, AlertCircle, Loader2, Warehouse, CheckCircle, XCircle, Tags } from "lucide-react";

export default function Page() {
  const { data: inventoryItems = [], isLoading: isLoadingInventory } = useGetAllInventoryQuery();
  const { data: warehouses = [], isLoading: isLoadingWarehouses } = useGetAllWarehousesQuery();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetAllCategoriesQuery();
  
  const isLoading = isLoadingInventory || isLoadingWarehouses || isLoadingCategories;

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity_on_hand <= item.reorder_threshold
  ).length;
  const inStockItems = inventoryItems.filter(
    (item) => item.quantity_on_hand > item.reorder_threshold
  ).length;
  const outOfStockItems = inventoryItems.filter(
    (item) => item.quantity_on_hand === 0
  ).length;
  const totalWarehouses = warehouses.length;
  const totalCategories = categories.length;

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor }: any) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
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
            <p className="text-4xl font-bold">{value}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Dashboard">
      {/* Row 1: Total Items & Total Warehouse & Total Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 ">
        <StatCard
          title="Total Inventory Items"
          value={totalItems}
          icon={Package}
          bgColor="bg-blue-100 dark:bg-blue-900/30"
          textColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Total Warehouse"
          value={totalWarehouses}
          icon={Warehouse}
          bgColor="bg-purple-100 dark:bg-purple-900/30"
          textColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Total Category"
          value={totalCategories}
          icon={Tags}
          bgColor="bg-indigo-100 dark:bg-indigo-900/30"
          textColor="text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Row 2: In Stock, Low Stock, Out of Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <StatCard
          title="Total Inventory (In Stock)"
          value={inStockItems}
          icon={CheckCircle}
          bgColor="bg-green-100 dark:bg-green-900/30"
          textColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Total Inventory (Low Stock)"
          value={lowStockItems}
          icon={AlertCircle}
          bgColor="bg-yellow-100 dark:bg-yellow-900/30"
          textColor="text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          title="Total Inventory (Out of Stock)"
          value={outOfStockItems}
          icon={XCircle}
          bgColor="bg-red-100 dark:bg-red-900/30"
          textColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Row 3: Charts */}
      <InventoryVisualization 
        items={inventoryItems} 
        categories={categories}
        warehouses={warehouses}
      />
    </DashboardLayout>
  );
}
