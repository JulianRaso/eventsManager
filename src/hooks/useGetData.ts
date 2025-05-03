import { useQuery } from "@tanstack/react-query";
import { getStock } from "../services/stock";

export default function useGetData(category?: string) {
  const { data, isLoading } = useQuery({
    queryKey: [category || "all"],
    queryFn: () => getStock(category || ""),
  });

  return { data, isLoading };
}
