import { useQuery } from "@tanstack/react-query";
import { getStock } from "../services/data";

export default function useGetData({ category }: { category: string }) {
  const { data, isLoading } = useQuery({
    queryKey: [category],
    queryFn: () => getStock({ category: category }),
  });

  return { data, isLoading };
}
