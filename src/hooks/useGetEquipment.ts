import { useQuery } from "@tanstack/react-query";
import { getCurrentInventory } from "../services/stock";

export default function useGetEquipment(id: number) {
  const { isPending, data: equipment } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => getCurrentInventory(id),
  });

  return { isPending, equipment };
}
