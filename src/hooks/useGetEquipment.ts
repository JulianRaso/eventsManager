import { useQuery } from "@tanstack/react-query";
import { getCurrentStock } from "../services/stock";

export default function useGetEquipment(id: string) {
  const { isPending, getEquipment } = useQuery({
    queryKey: ["sound"],
    queryFn: (id) => getCurrentStock(id),
  });

  return { isPending, getEquipment };
}
