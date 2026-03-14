"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InventoryItem } from "@/store/api/inventory-api";
import { useUpdateInventoryMutation, useDeleteInventoryMutation } from "@/store/api/inventory-api";
import { toast } from "sonner";

interface ViewDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

interface EditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function ViewDetailModal({ open, onOpenChange, item }: ViewDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
          <DialogDescription>
            View complete information for {item.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500">SKU</Label>
              <p className="font-semibold">{item.sku}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Item Name</Label>
              <p className="font-semibold">{item.name}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Category</Label>
              <p>{item.category}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Warehouse</Label>
              <p>{item.warehouse}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Quantity on Hand</Label>
              <p className="font-semibold text-lg">{item.quantity_on_hand}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Reorder Threshold</Label>
              <p>{item.reorder_threshold}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Created At</Label>
              <p className="text-sm">{new Date(item.created_at).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Last Updated</Label>
              <p className="text-sm">{new Date(item.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditModal({ open, onOpenChange, item }: EditModalProps) {
  const [updateInventory, { isLoading }] = useUpdateInventoryMutation();
  const [formData, setFormData] = React.useState({
    sku: "",
    name: "",
    category: "",
    warehouse: "",
    quantity_on_hand: 0,
    reorder_threshold: 0,
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        sku: item.sku,
        name: item.name,
        category: item.category,
        warehouse: item.warehouse,
        quantity_on_hand: item.quantity_on_hand,
        reorder_threshold: item.reorder_threshold,
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      await updateInventory({
        id: item.item_id,
        data: formData,
      }).unwrap();
      
      toast.success("Item updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to update item");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update details for {item.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Input
                  id="warehouse"
                  value={formData.warehouse}
                  onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity on Hand</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity_on_hand}
                  onChange={(e) => setFormData({ ...formData, quantity_on_hand: parseInt(e.target.value) })}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="threshold">Reorder Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.reorder_threshold}
                  onChange={(e) => setFormData({ ...formData, reorder_threshold: parseInt(e.target.value) })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteModal({ open, onOpenChange, item }: DeleteModalProps) {
  const [deleteInventory, { isLoading }] = useDeleteInventoryMutation();

  const handleDelete = async () => {
    if (!item) return;

    try {
      await deleteInventory(item.item_id).unwrap();
      toast.success("Item deleted successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete item");
    }
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{item.name}</strong> (SKU: {item.sku})? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
