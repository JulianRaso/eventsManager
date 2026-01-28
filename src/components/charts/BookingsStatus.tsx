import { Label, Pie, PieChart } from "recharts";
import { CalendarCheck } from "lucide-react";

import useGetMonthlyEventsStatus from "@/hooks/useGetMonthlyEventsStatus";
import MiniSpinner from "../MiniSpinner";
import { formatDateCharts } from "../formatDate";
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
  confirm: {
    label: "Confirmados",
    color: CHART_COLORS.success,
  },
  pending: {
    label: "Pendientes",
    color: CHART_COLORS.warning,
  },
  cancel: {
    label: "Cancelados",
    color: CHART_COLORS.danger,
  },
} satisfies ChartConfig;

export default function BookingsStatus() {
  const currMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const { data = [{ booking_status: "", total: 0 }], isLoading } =
    useGetMonthlyEventsStatus();

  if (isLoading) return <MiniSpinner />;

  type StatusItem = { booking_status: string; total: number };
  const chartData = data?.map((item: StatusItem) => ({
    eventStatus:
      item.booking_status === "confirm"
        ? "Confirmados"
        : item.booking_status === "pending"
        ? "Pendientes"
        : "Cancelados",
    quantity: item.total,
    fill:
      item.booking_status === "confirm"
        ? CHART_COLORS.success
        : item.booking_status === "pending"
        ? CHART_COLORS.warning
        : CHART_COLORS.danger,
  }));

  const totalVisitors = chartData.reduce(
    (acc: number, curr: { quantity: number }) => acc + curr.quantity,
    0
  );

  return (
    <Card className="flex flex-col hover:shadow-lg transition-all duration-300">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950">
            <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <CardTitle className="text-lg">Estado de Eventos</CardTitle>
        </div>
        <CardDescription>{formatDateCharts(currMonth)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="quantity"
              nameKey="eventStatus"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              stroke="transparent"
            >
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Eventos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="leading-none text-muted-foreground text-center">
          Estado de los eventos de ambas compañías
        </div>
      </CardFooter>
    </Card>
  );
}
