import useGetMonthlySales from "@/hooks/useGetMonthlySales";
import { ShoppingBag, TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import MiniSpinner from "../MiniSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartConfig, ChartContainer } from "../ui/chart";
import { formatDateCharts } from "../formatDate";

const chartConfig = {
  sells: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function MonthlySalesChart() {
  const currMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

  const { data, isLoading } = useGetMonthlySales();

  if (isLoading) return <MiniSpinner />;

  const chartData = [
    {
      browser: "sells",
      visitors: data || 0,
      fill: "hsl(var(--chart-1))",
    },
  ];

  return (
    <Card className="flex flex-col hover:shadow-lg transition-all duration-300">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
            <ShoppingBag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-lg">Ventas del Mes</CardTitle>
        </div>
        <CardDescription>{formatDateCharts(currMonth)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-200}
            innerRadius={70}
            outerRadius={100}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[76, 64]}
            />
            <RadialBar 
              dataKey="visitors" 
              background 
              cornerRadius={10}
              className="drop-shadow-sm"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Ventas
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="flex items-center gap-2 font-medium leading-none text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          +2% respecto del mes anterior
        </div>
        <div className="leading-none text-muted-foreground text-center">
          Total de ventas del mes
        </div>
      </CardFooter>
    </Card>
  );
}
