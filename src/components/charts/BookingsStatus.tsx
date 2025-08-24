import { Label, Pie, PieChart } from "recharts";

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

const chartConfig = {
  confirm: {
    label: "Confirmados",
    color: "#4CAF50",
  },
  pending: {
    label: "Pendientes",
    color: "hsl(var(--chart-1))",
  },
  cancel: {
    label: "Cancelados",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BookingsStatus() {
  const currMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const { data = [{ booking_status: "", total: 0 }], isLoading } =
    useGetMonthlyEventsStatus();

  if (isLoading) return <MiniSpinner />;

  const chartData = data?.map((item) => ({
    eventStatus:
      item.booking_status === "confirm"
        ? "Confirmados"
        : item.booking_status === "pending"
        ? "Pendientes"
        : "Cancelados",
    quantity: item.total,
    fill:
      item.booking_status === "confirm"
        ? "#4CAF50"
        : item.booking_status === "pending"
        ? "#FFEB3B"
        : "#F44336",
  }));

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Estado Eventos - Muzek & Show Rental</CardTitle>
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
              innerRadius={45}
              strokeWidth={5}
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
                          className="fill-muted-foreground"
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Estado de los eventos de ambas compañias
        </div>
      </CardFooter>
    </Card>
  );
}
