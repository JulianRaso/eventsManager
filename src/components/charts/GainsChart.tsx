import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import useGetIncomesPerMonth from "@/hooks/useGetIncomesPerMonth";
import { formatDateCharts } from "../formatDate";
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
import { CHART_COLORS } from "@/lib/chartColors";

const chartConfig = {
  income: {
    label: "Recaudaciones: $",
    color: CHART_COLORS.primary,
  },
} satisfies ChartConfig;

export default function GainsChart() {
  const currMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const { data = [{ month: "", income: 0 }], isLoading } =
    useGetIncomesPerMonth();
  if (isLoading) return <MiniSpinner />;
  const chartData = [
    {
      month: "Enero",
      income: 100,
    },
    ...data,
  ];
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-lg">Recaudaciones</CardTitle>
        </div>
        <CardDescription>Enero - {formatDateCharts(currMonth)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.4)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
              className="text-xs"
              width={60}
            />
            <ChartTooltip
              cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="income"
              type="monotone"
              stroke={CHART_COLORS.primary}
              strokeWidth={2.5}
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: CHART_COLORS.primary }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
        <div className="leading-none text-muted-foreground">
          Recaudaciones de ambas compañías a lo largo del año
        </div>
      </CardFooter>
    </Card>
  );
}
