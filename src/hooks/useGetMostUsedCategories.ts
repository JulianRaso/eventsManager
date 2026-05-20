import { getMostUsedCategories } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetMostUsedCategories(year?: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["mostUsedCategories", year],
    queryFn: () => getMostUsedCategories(year),
  });

  return { data, isLoading };
}

