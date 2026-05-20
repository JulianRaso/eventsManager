import { getCurrentMonthCostsSummary } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useGetCurrentMonthNet(year?: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["currentMonthNet", year],
    queryFn: () => getCurrentMonthCostsSummary(year),
  });

  return { data, isLoading };
}

