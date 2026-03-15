"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: any[];
  data: TData[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKey?: string;
  hideSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search...",
  searchKey = "",
  hideSearch = false,
  onSearchChange,
  searchValue: externalSearchValue = "",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [internalSearchValue, setInternalSearchValue] = React.useState("");
  
  const searchValue = onSearchChange ? externalSearchValue : internalSearchValue;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  React.useEffect(() => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(searchValue);
    }
  }, [searchValue, searchKey, table]);

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchValue(value);
    }
  };

  return (
    <div className="space-y-4">
      {searchKey && !hideSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-10 w-full"
          />
        </div>
      )}

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12 text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{" "}
          of{" "}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          items
        </div>

        {table.getPageCount() > 1 && (
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              Previous
            </Button>

            {table.getPageCount() <= 5 ? (
              Array.from({ length: table.getPageCount() }, (_, i) => i).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      table.getState().pagination.pageIndex === page
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className="w-9 cursor-pointer"
                  >
                    {page + 1}
                  </Button>
                )
              )
            ) : (
              <>
                {Array.from({ length: 2 }, (_, i) => i).map((page) => (
                  <Button
                    key={page}
                    variant={
                      table.getState().pagination.pageIndex === page
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className="w-9 cursor-pointer"
                  >
                    {page + 1}
                  </Button>
                ))}
                {table.getState().pagination.pageIndex > 2 && (
                  <span className="text-muted-foreground text-sm">...</span>
                )}
                {table.getState().pagination.pageIndex > 1 &&
                  table.getState().pagination.pageIndex < table.getPageCount() - 2 && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-9 cursor-pointer"
                      disabled
                    >
                      {table.getState().pagination.pageIndex + 1}
                    </Button>
                  )}
                {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                  <span className="text-muted-foreground text-sm">...</span>
                )}
                {Array.from(
                  { length: 2 },
                  (_, i) => table.getPageCount() - 2 + i
                ).map((page) => (
                  <Button
                    key={page}
                    variant={
                      table.getState().pagination.pageIndex === page
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className="w-9 cursor-pointer"
                  >
                    {page + 1}
                  </Button>
                ))}
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}

        {table.getPageCount() > 1 && (
          <div className="sm:hidden text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        )}
      </div>
    </div>
  );
}
