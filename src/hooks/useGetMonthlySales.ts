import { getMonthlySales } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetMonthlySales() {
  const { data, isLoading } = useQuery({
    queryKey: ["monthlySales"],
    queryFn: getMonthlySales,
  });

  return { data, isLoading };
}
