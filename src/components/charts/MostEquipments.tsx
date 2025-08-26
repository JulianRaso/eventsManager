import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export function MostEquipments() {
  const currMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const { data = [{ name: "", total: 0 }], isLoading } =
    useGetMostUsedEquipment();

  if (isLoading) return <MiniSpinner />;

  const colors = [
    "#4E79A7",
    "#F28E2B",
    "#E15759",
    "#76B7B2",
    "#59A14F",
    "#EDC948",
    "#B07AA1",
    "#FF9DA7",
    "#9C755F",
    "#BAB0AC",
  ];
  const chartData = data?.map((item, index) => ({
    equipment: item.name,
    quantity: item.total,
    fill: colors[index],
  }));

  const chartConfig: ChartConfig = data?.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: colors[index],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Equipos mas solicitados</CardTitle>
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
              label
              nameKey="equipment"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Aumento del 20% respecto del mes anterior{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Top 10 equipos mas solicitados
        </div>
      </CardFooter>
    </Card>
  );
}
