"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryItem } from "@/store/api/inventory-api";

export const inventoryColumns = (
  onViewDetails: (item: InventoryItem) => void,
  onEdit: (item: InventoryItem) => void,
  onDelete: (item: InventoryItem) => void
): ColumnDef<InventoryItem>[] => [
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        SKU
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("sku")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Item Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("category")}</span>,
  },
  {
    accessorKey: "warehouse",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Warehouse
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("warehouse")}</span>,
  },
  {
    accessorKey: "quantity_on_hand",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-end"
      >
        Qty
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("quantity_on_hand")}</span>
    ),
  },
  {
    accessorKey: "reorder_threshold",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="justify-end"
      >
        Threshold
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>{row.getValue("reorder_threshold")}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const quantity = row.original.quantity_on_hand;
      const threshold = row.original.reorder_threshold;
      const isLowStock = quantity <= threshold;

      return (
        <div className="text-center">
          <span
            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
              isLowStock
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            }`}
          >
            {isLowStock ? "Low" : "Normal"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Edit Item
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(row.original)}
            className="text-red-600 dark:text-red-400"
          >
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
