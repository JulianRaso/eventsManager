import { getMostEquipmentUsed } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";

export default function useGetMostUsedEquipment() {
  const { data, isLoading } = useQuery({
    queryKey: ["mostUsedEquipment"],
    queryFn: getMostEquipmentUsed,
  });

  return { data, isLoading };
}
