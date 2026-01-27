import { Package, TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import useGetMostUsedEquipment from "@/hooks/useGetMostUsedEquipment";
import MiniSpinner from "../MiniSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { formatDateCharts } from "../formatDate";
import { CHART_PALETTE } from "@/lib/chartColors";

export function MostEquipments() {
  const currMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const { data = [{ name: "", total: 0 }], isLoading } =
    useGetMostUsedEquipment();

  if (isLoading) return <MiniSpinner />;

  const colors = [...CHART_PALETTE];

  const chartData = data?.map((item, index) => ({
    equipment: item.name,
    quantity: item.total,
    fill: colors[index % colors.length],
  }));

  const chartConfig: ChartConfig = data?.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col hover:shadow-lg transition-all duration-300">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-lg">Equipos Más Solicitados</CardTitle>
        </div>
        <CardDescription>Enero - {formatDateCharts(currMonth)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="quantity"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              nameKey="equipment"
              cx="50%"
              cy="50%"
              outerRadius={80}
              strokeWidth={2}
              stroke="transparent"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          +20% respecto del mes anterior
        </div>
        <div className="leading-none text-muted-foreground text-center">
          Top 10 equipos más solicitados
        </div>
      </CardFooter>
    </Card>
  );
}
