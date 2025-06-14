import { useQuery } from "@tanstack/react-query";
import { getCurrentStock } from "../services/stock";

export default function useGetEquipment(id: number) {
  const { isPending, data: equipment } = useQuery({
    queryKey: ["sound"],
    queryFn: () => getCurrentStock(id),
  });

  return { isPending, equipment };
}
