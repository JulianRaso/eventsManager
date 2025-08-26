import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

const chartConfig = {
  income: {
    label: "Recaudaciones: $",
    color: "blue",
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
    <Card>
      <CardHeader>
        <CardTitle>Recaudaciones - Muzek & Show Rental</CardTitle>
        <CardDescription>Enero - {formatDateCharts(currMonth)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="income"
              type="linear"
              stroke="blue"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
        </div>
        <div className="leading-none text-muted-foreground">
          Recaudaciones de ambas compañias a lo largo del año
        </div>
      </CardFooter>
    </Card>
  );
}
