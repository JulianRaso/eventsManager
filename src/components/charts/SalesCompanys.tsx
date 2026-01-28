import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Building2 } from "lucide-react";

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
import { CHART_COLORS } from "@/lib/chartColors";

const chartConfig = {
  showRental: {
    label: "Show Rental",
    color: CHART_COLORS.rose,
  },
  muzek: {
    label: "Muzek",
    color: CHART_COLORS.primary,
  },
} satisfies ChartConfig;

export default function SalesCompany() {
  const { data = [{ date: "", muzek: 0, "show Rental": 0 }], isLoading } =
    useGetEventsPerCompany();

  if (isLoading) return <MiniSpinner />;

  type CompanyDataItem = { date: string; muzek: number; "show Rental": number };
  type ChartDataItem = { date: string; showRental: number; muzek: number };

  const chartData = (data ?? []).map((item: CompanyDataItem): ChartDataItem => ({
    date: item.date,
    showRental: item["show Rental"],
    muzek: item.muzek,
  }));

  const totalShowRental = chartData.reduce(
    (acc: number, d: ChartDataItem) => acc + d.showRental,
    0
  );
  const totalMuzek = chartData.reduce(
    (acc: number, d: ChartDataItem) => acc + d.muzek,
    0
  );

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
              <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Eventos por Compañía</CardTitle>
          </div>
          <CardDescription>
            Comparativa mensual de ambas compañías
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-6 pt-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm shrink-0"
              style={{ backgroundColor: CHART_COLORS.rose }}
            />
            <span className="text-sm text-muted-foreground">Show Rental</span>
            <span className="text-sm font-semibold tabular-nums">
              {totalShowRental.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm shrink-0"
              style={{ backgroundColor: CHART_COLORS.primary }}
            />
            <span className="text-sm text-muted-foreground">Muzek</span>
            <span className="text-sm font-semibold tabular-nums">
              {totalMuzek.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="text-xs"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
              width={40}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(148,163,184,0.15)" }}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
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
            <Bar
              dataKey="showRental"
              name="Show Rental"
              fill={CHART_COLORS.rose}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="muzek"
              name="Muzek"
              fill={CHART_COLORS.primary}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
