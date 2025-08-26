import { getEventsPerCompany } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetEventsPerCompany() {
  const { data, isLoading } = useQuery({
    queryKey: ["eventsPerCompany"],
    queryFn: getEventsPerCompany,
  });
  return { data, isLoading };
}
