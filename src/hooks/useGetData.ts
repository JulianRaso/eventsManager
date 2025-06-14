import { useQuery } from "@tanstack/react-query";
import { getStock } from "../services/stock";

type CategoryType =
  | "lights"
  | "ambientation"
  | "sound"
  | "structure"
  | "tools"
  | "cables"
  | "others"
  | "furniture"
  | "screen";

export default function useGetData(category?: CategoryType) {
  const { data, isLoading } = useQuery({
    queryKey: [category || "all"],
    queryFn: () => getStock(category),
  });

  return { data, isLoading };
}
