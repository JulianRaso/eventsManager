import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import useGetEventsPerCompany from "@/hooks/useGetEventsPerCompany";
import MiniSpinner from "../MiniSpinner";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  "show Rental": {
    label: "Show Rental",
    color: "pink",
  },
  muzek: {
    label: "Muzek",
    color: "lightblue",
  },
} satisfies ChartConfig;

export default function SalesCompany() {
  const { data = [{ date: "", muzek: 0, "show Rental": 0 }], isLoading } =
    useGetEventsPerCompany();
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("show Rental");

  if (isLoading) return <MiniSpinner />;

  const chartData = data ? [...data] : [];

  const total = {
    "show Rental": data?.reduce((acc, curr) => acc + curr["show Rental"], 0),
    muzek: data?.reduce((acc, curr) => acc + curr["muzek"], 0),
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Ventas - Muzek & Show Rental</CardTitle>
          <CardDescription>Ventas por mes de ambas compañias</CardDescription>
        </div>
        <div className="flex">
          {["show Rental", "muzek"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
