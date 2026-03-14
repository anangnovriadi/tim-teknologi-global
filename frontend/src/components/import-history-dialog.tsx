"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetImportLogsQuery } from "@/store/api/import-logs-api";
import { AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";
import { format } from "date-fns";

interface ImportHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportHistoryDialog({ open, onOpenChange }: ImportHistoryDialogProps) {
  const [filterType, setFilterType] = React.useState<"all" | "inventory" | "transaction">("all");
  
  const { data: inventoryLogs = [], refetch: refetchInventory } = useGetImportLogsQuery(
    { importType: "inventory", limit: 50 },
    { skip: !open }
  );
  const { data: transactionLogs = [], refetch: refetchTransaction } = useGetImportLogsQuery(
    { importType: "transaction", limit: 50 },
    { skip: !open }
  );

  React.useEffect(() => {
    if (open) {
      refetchInventory();
      refetchTransaction();
    }
  }, [open, refetchInventory, refetchTransaction]);

  const allLogs = [...inventoryLogs, ...transactionLogs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredLogs = filterType === "all" 
    ? allLogs 
    : filterType === "inventory"
    ? inventoryLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : transactionLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const renderErrorDetails = (errors: any[]) => {
    return (
      <div className="space-y-2">
        {errors.slice(0, 5).map((error, idx) => (
          <div key={idx} className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
            <p className="font-medium text-red-700 dark:text-red-300">Row {error.row}: {error.error}</p>
          </div>
        ))}
        {errors.length > 5 && (
          <p className="text-xs text-muted-foreground">+{errors.length - 5} more errors</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import History</DialogTitle>
          <DialogDescription>View your import logs and results</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="cursor-pointer"
          >
            All ({allLogs.length})
          </Button>
          <Button
            variant={filterType === "inventory" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("inventory")}
            className="cursor-pointer"
          >
            Inventory ({inventoryLogs.length})
          </Button>
          <Button
            variant={filterType === "transaction" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("transaction")}
            className="cursor-pointer"
          >
            Transaction ({transactionLogs.length})
          </Button>
        </div>

        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No import history available</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.log_id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {log.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <CardTitle className="text-sm capitalize">{log.import_type} Import</CardTitle>
                        <CardDescription className="text-xs">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={log.status === "success" ? "default" : "destructive"}>
                      {log.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Rows</p>
                      <p className="font-semibold">{log.total_rows}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accepted</p>
                      <p className="font-semibold text-green-600">{log.accepted_rows}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rejected</p>
                      <p className="font-semibold text-red-600">{log.rejected_rows}</p>
                    </div>
                  </div>
                  {log.rejected_rows > 0 && log.errors.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-2">Error Details:</p>
                      {renderErrorDetails(log.errors)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
