import { getYearlySales } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetYearlySales(year: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["yearlySales"],
    queryFn: () => getYearlySales(year),
  });

  return { data, isLoading };
}
