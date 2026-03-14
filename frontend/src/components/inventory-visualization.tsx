"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts";

export interface InventoryVisualizationProps {
  items: Array<{
    sku: string;
    name: string;
    category: string;
    warehouse: string;
    quantity_on_hand: number;
    reorder_threshold: number;
  }>;
}

export function InventoryVisualization({ items }: InventoryVisualizationProps) {
  const barChartData = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    items.forEach((item) => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category: category.slice(0, 10), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [items]);

  const lineChartData = React.useMemo(() => {
    const warehouseMap = new Map<string, number>();
    items.forEach((item) => {
      warehouseMap.set(item.warehouse, (warehouseMap.get(item.warehouse) || 0) + item.quantity_on_hand);
    });
    
    return Array.from(warehouseMap.entries())
      .map(([warehouse, quantity]) => ({ warehouse: warehouse.slice(0, 8), quantity }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [items]);

  const barChartConfig = {
    count: {
      label: "Items",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const lineChartConfig = {
    quantity: {
      label: "Quantity",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  if (barChartData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Items by Category</CardTitle>
          <CardDescription className="text-xs">Top categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barChartConfig}>
            <BarChart accessibilityLayer data={barChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="flex gap-2 font-medium">
            Total {items.length} items
          </div>
        </CardFooter>
      </Card>

      {/* Line Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quantity by Warehouse</CardTitle>
          <CardDescription className="text-xs">Total stock distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineChartConfig}>
            <LineChart accessibilityLayer data={lineChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="warehouse"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line 
                type="linear" 
                dataKey="quantity" 
                stroke="var(--color-quantity)" 
                dot={true}
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="flex gap-2 font-medium">
            Total quantity: {items.reduce((sum, item) => sum + item.quantity_on_hand, 0)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
