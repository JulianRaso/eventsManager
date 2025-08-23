import { getMonthlySales } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetMonthlySales(month: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["monthlySales"],
    queryFn: () => getMonthlySales(month),
  });

  return { data, isLoading };
}
