import { useQuery } from "@tanstack/react-query";
import { getItems } from "../services/bookingItems";

export default function useGetItems(id: number) {
  const { isPending, data: getBookedEquipment } = useQuery({
    queryKey: ["booking_equipments"],
    queryFn: () => getItems(id),
  });

  return { isPending, getBookedEquipment };
}
