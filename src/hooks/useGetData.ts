import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../services/stock";
import type { CategoryType } from "../types";

export default function useGetData(category?: CategoryType) {
  const { data, isLoading } = useQuery({
    queryKey: [category || "inventory"],
    queryFn: () => getInventory(category),
  });

  return { data, isLoading };
}
