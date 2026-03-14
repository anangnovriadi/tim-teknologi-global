"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface FilterOptions {
  category?: string;
  warehouse?: string;
  status?: "low" | "normal";
}

type FiltersState = {
  category: string;
  warehouse: string;
  status: "all" | "low" | "normal";
};

interface InventoryFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
  warehouses: string[];
}

export function InventoryFilters({
  onFiltersChange,
  categories,
  warehouses,
}: InventoryFiltersProps) {
  const [filters, setFilters] = React.useState<FiltersState>({
    category: "all",
    warehouse: "all",
    status: "all",
  });

  const emitFilters = (state: FiltersState) => {
    const out: FilterOptions = {};
    if (state.category !== "all") out.category = state.category;
    if (state.warehouse !== "all") out.warehouse = state.warehouse;
    if (state.status !== "all") out.status = state.status as "low" | "normal";
    onFiltersChange(out);
  };

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    const next = ({ ...filters, [key]: value } as FiltersState);
    setFilters(next);
    emitFilters(next);
  };

  const handleReset = () => {
    const resetState: FiltersState = {
      category: "all",
      warehouse: "all",
      status: "all",
    };
    setFilters(resetState);
    emitFilters(resetState);
  };

  const isFiltered =
    filters.category !== "all" ||
    filters.warehouse !== "all" ||
    filters.status !== "all";

  return (
    <div className="w-full flex flex-col gap-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Filters</h3>
        {isFiltered && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs"
          >
            <X className="h-1 w-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              handleFilterChange("category", value)
            }
          >
          <SelectTrigger className="h-8 text-sm w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Warehouse
          </label>
          <Select
            value={filters.warehouse || "all"}
            onValueChange={(value) =>
              handleFilterChange("warehouse", value)
            }
          >
          <SelectTrigger className="h-8 text-sm w-full">
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouse</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse} value={warehouse}>
                  {warehouse}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Stock Status
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="h-8 text-sm w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="normal">Normal Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
