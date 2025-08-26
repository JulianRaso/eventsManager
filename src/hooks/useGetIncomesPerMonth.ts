import { getIncomePerMonth } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetIncomesPerMonth() {
  const { data, isLoading } = useQuery({
    queryKey: ["incomesPerMonth"],
    queryFn: getIncomePerMonth,
  });
  return { data, isLoading };
}
