"use client";

import React from "react";
import DashboardLayout from "@/components/layouts/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plus, Loader2, Search, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import {
  Warehouse,
  useGetAllWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} from "@/store/api/warehouse-api";
import { ColumnDef } from "@tanstack/react-table";
import { Button as ActionButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WarehousePage() {
  const { data: warehouses = [], isLoading, refetch } = useGetAllWarehousesQuery();
  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();
  const [updateWarehouse, { isLoading: isUpdating }] = useUpdateWarehouseMutation();
  const [deleteWarehouse, { isLoading: isDeleting }] = useDeleteWarehouseMutation();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<Warehouse | null>(null);
  const [searchValue, setSearchValue] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    location: "",
    description: "",
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Warehouse name is required");
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error("Warehouse location is required");
      return;
    }

    try {
      await createWarehouse(formData).unwrap();
      toast.success("Warehouse created successfully");
      setFormData({ name: "", location: "", description: "" });
      setIsCreateOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to create warehouse");
    }
  };

  const handleEdit = async () => {
    if (!formData.name.trim()) {
      toast.error("Warehouse name is required");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Warehouse location is required");
      return;
    }

    if (!selectedWarehouse) {
      toast.error("No warehouse selected");
      return;
    }

    try {
      await updateWarehouse({
        id: selectedWarehouse.warehouse_id,
        data: formData,
      }).unwrap();
      toast.success("Warehouse updated successfully");
      setFormData({ name: "", location: "", description: "" });
      setIsEditOpen(false);
      setSelectedWarehouse(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to update warehouse");
    }
  };

  const handleDelete = async () => {
    if (!selectedWarehouse) {
      toast.error("No warehouse selected");
      return;
    }

    try {
      await deleteWarehouse(selectedWarehouse.warehouse_id).unwrap();
      toast.success("Warehouse deleted successfully");
      setIsDeleteOpen(false);
      setSelectedWarehouse(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete warehouse");
    }
  };

  const openEditDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location || "",
      description: warehouse.description || "",
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteOpen(true);
  };

  const columns: ColumnDef<Warehouse>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <ActionButton
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </ActionButton>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <ActionButton
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </ActionButton>
      ),
      cell: ({ row }) => <span>{row.getValue("location") || "-"}</span>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span>{row.getValue("description") || "-"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const warehouse = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(warehouse)} className="cursor-pointer">
                Edit Warehouse
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(warehouse)}
                className="text-red-600 cursor-pointer"
              >
                Delete Warehouse
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredWarehouses = React.useMemo(() => {
    if (!searchValue) return warehouses;
    
    return warehouses.filter((warehouse: Warehouse) =>
      warehouse.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (warehouse.location?.toLowerCase().includes(searchValue.toLowerCase())) ||
      (warehouse.description?.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [warehouses, searchValue]);

  return (
    <DashboardLayout title="Warehouse Management">
      <div className="grid gap-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row items-center justify-between gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="cursor-pointer flex-shrink-0">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <DataTable
              columns={columns}
              data={filteredWarehouses}
              isLoading={isLoading}
              hideSearch={true}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Warehouse</DialogTitle>
            <DialogDescription>Add a new warehouse to your inventory system</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="grid gap-3">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Warehouse A"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Jakarta"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating} className="cursor-pointer">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
            <DialogDescription>Update warehouse information</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="grid gap-3">
              <Label htmlFor="edit-name">Warehouse Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Warehouse A"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Jakarta"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isUpdating} className="cursor-pointer">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedWarehouse?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
