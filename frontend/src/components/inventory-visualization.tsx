"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
    
    const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
    return Array.from(warehouseMap.entries())
      .map(([warehouse, quantity], index) => ({ 
        warehouse,
        quantity,
        fill: colors[index % colors.length]
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [items]);

  const warehouseChartConfig = React.useMemo(() => {
    const config: Record<string, any> = {
      quantity: {
        label: "Quantity",
      },
    };
    
    lineChartData.forEach((item) => {
      config[item.warehouse] = {
        label: item.warehouse,
        color: item.fill,
      };
    });
    
    return config;
  }, [lineChartData]) as ChartConfig;

  const barChartConfig = {
    count: {
      label: "Items",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  if (barChartData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart - Items by Category */}
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

        {/* Bar Chart - Quantity by Warehouse */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quantity by Warehouse</CardTitle>
            <CardDescription className="text-xs">Stock distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={warehouseChartConfig}>
              <BarChart
                accessibilityLayer
                data={lineChartData}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis
                  dataKey="warehouse"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={100}
                />
                <XAxis dataKey="quantity" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="quantity" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex gap-2 font-medium">
              Total quantity: {items.reduce((sum, item) => sum + item.quantity_on_hand, 0)}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
