"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { API_URL } from "@/constants/api";
import { COOKIE_KEYS } from "@/constants/cookies";

interface ImportError {
  row: number;
  error: string;
  data?: Record<string, string>;
}

interface ImportResult {
  total_rows: number;
  accepted_rows: number;
  rejected_rows: number;
  errors: ImportError[];
  success: boolean;
}

interface TransactionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionImportDialog({ open, onOpenChange }: TransactionImportDialogProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [importResult, setImportResult] = React.useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_URL}/transactions/import`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to import: ${response.statusText}`);
      }

      const result = await response.json();
      setImportResult(result);

      if (result.success) {
        toast.success(`Successfully imported ${result.accepted_rows} transactions`);
      } else {
        toast.warning(
          `Imported ${result.accepted_rows} transactions with ${result.rejected_rows} errors`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to import transactions");
      setImportResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  const handleDownloadTemplate = () => {
    const headers = ["sku", "warehouse", "transaction_type", "quantity", "timestamp"];
    const sampleData = [
      ["SKU001", "Warehouse A", "restock", "50", "2026-03-14 10:30:00"],
      ["SKU002", "Warehouse B", "sale", "10", "2026-03-14 11:00:00"],
      ["SKU001", "Warehouse A", "adjustment", "100", "2026-03-14 12:00:00"],
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transaction_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: sku, warehouse, transaction_type, quantity, timestamp
            (transaction_type: restock, sale, adjustment)
          </DialogDescription>
        </DialogHeader>

        {!importResult ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              hidden
              disabled={isLoading}
            />

            <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium mb-1">
              {isLoading ? "Uploading..." : "Drag and drop your CSV file here"}
            </p>
            <p className="text-xs text-gray-500">
              or click to select a file from your computer
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Rows</p>
                <p className="text-2xl font-bold">{importResult.total_rows}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {importResult.accepted_rows}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {importResult.rejected_rows}
                </p>
              </div>
            </div>

            {importResult.success ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">
                    All transactions imported successfully!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                      {importResult.rejected_rows} row{importResult.rejected_rows !== 1 ? "s" : ""} failed to import
                    </p>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="max-h-64 overflow-y-auto border rounded-lg">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Row</th>
                          <th className="px-3 py-2 text-left font-medium">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.errors.map((error, index) => (
                          <tr
                            key={index}
                            className="border-t hover:bg-gray-50 dark:hover:bg-gray-900/50"
                          >
                            <td className="px-3 py-2 font-medium text-red-600 dark:text-red-400">
                              {error.row}
                            </td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                              {error.error}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button variant="outline" onClick={handleClose}>
            {importResult ? "Done" : "Cancel"}
          </Button>
          {!importResult && (
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Select File"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
