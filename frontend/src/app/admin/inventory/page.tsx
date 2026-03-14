"use client";

import React from "react";
import DashboardLayout from "@/components/layouts/layout-dashboard";
import { useGetAllInventoryQuery, InventoryItem } from "@/store/api/inventory-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ViewDetailModal, EditModal, DeleteModal } from "@/components/inventory-modals";
import { InventoryFilters } from "@/components/inventory-filters";
import { CSVImportDialog } from "@/components/csv-import-dialog";
import { TransactionImportDialog } from "@/components/transaction-import-dialog";
import { inventoryColumns } from "@/lib/columns/inventory-columns";
import { Button } from "@/components/ui/button";
import { Upload, Search, FileUp } from "lucide-react";

interface FilterOptions {
  category?: string;
  warehouse?: string;
  status?: "low" | "normal" | "outofstock";
}

export default function InventoryPage() {
  const { data: inventoryItems = [], isLoading } = useGetAllInventoryQuery();
  
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [csvImportOpen, setCsvImportOpen] = React.useState(false);
  const [transactionImportOpen, setTransactionImportOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [filters, setFilters] = React.useState<FilterOptions>({});

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const categories = React.useMemo(() => {
    const cats = new Set(inventoryItems.map((item) => item.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [inventoryItems]);

  const warehouses = React.useMemo(() => {
    const whes = new Set(inventoryItems.map((item) => item.warehouse).filter(Boolean));
    return Array.from(whes).sort();
  }, [inventoryItems]);

  const filteredItems = React.useMemo(() => {
    return inventoryItems.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.warehouse && item.warehouse !== filters.warehouse) return false;
      
      if (filters.status) {
        const isOutOfStock = item.quantity_on_hand === 0;
        const isLowStock = item.quantity_on_hand > 0 && item.quantity_on_hand <= item.reorder_threshold;
        const isInStock = item.quantity_on_hand > item.reorder_threshold;
        
        if (filters.status === "outofstock" && !isOutOfStock) return false;
        if (filters.status === "low" && !isLowStock) return false;
        if (filters.status === "normal" && !isInStock) return false;
      }
      
      return true;
    });
  }, [inventoryItems, filters]);

  const columns = inventoryColumns(handleViewDetails, handleEdit, handleDelete);

  return (
    <DashboardLayout title="Inventory">
      <InventoryFilters
        onFiltersChange={setFilters}
        categories={categories}
        warehouses={warehouses}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Inventory Items ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center justify-between gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                onClick={() => setTransactionImportOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <FileUp className="h-4 w-4" />
                Import Transactions
              </Button>
              <Button 
                onClick={() => setCsvImportOpen(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Inventory
              </Button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredItems}
            isLoading={isLoading}
            searchPlaceholder="Search..."
            searchKey="name"
            hideSearch={true}
            onSearchChange={setSearchValue}
            searchValue={searchValue}
          />
        </CardContent>
      </Card>

      <ViewDetailModal 
        open={viewModalOpen} 
        onOpenChange={setViewModalOpen}
        item={selectedItem}
      />
      
      <EditModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen}
        item={selectedItem}
      />
      
      <DeleteModal 
        open={deleteModalOpen} 
        onOpenChange={setDeleteModalOpen}
        item={selectedItem}
      />

      <CSVImportDialog 
        open={csvImportOpen}
        onOpenChange={setCsvImportOpen}
      />

      <TransactionImportDialog 
        open={transactionImportOpen}
        onOpenChange={setTransactionImportOpen}
      />
    </DashboardLayout>
  );
}
