import { getMonthlyEvents } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetMonthlyEventsStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ["monthlyEventsStatus"],
    queryFn: getMonthlyEvents,
  });
  return { data, isLoading };
}
