import { getFinancePerMonth } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export default function useGetFinancePerMonth(year?: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["financePerMonth", year],
    queryFn: () => getFinancePerMonth(year),
  });

  return { data, isLoading };
}

