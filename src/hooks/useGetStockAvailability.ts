import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../services/stock";
import { getUpcomingBookingItems } from "../services/bookingItems";

export default function useGetStockAvailability() {
  const { data: stock = [], isLoading: isLoadingStock } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(),
  });

  const { data: upcomingItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["upcomingBookingItems"],
    queryFn: getUpcomingBookingItems,
  });

  const availability = useMemo(() => {
    return stock.map((item) => {
      const allocated = upcomingItems
        .filter((bi) => bi.equipment_id === item.id)
        .reduce((sum, bi) => sum + bi.quantity, 0);
      return {
        ...item,
        allocated,
        available: Math.max(0, item.quantity - allocated),
      };
    });
  }, [stock, upcomingItems]);

  return { availability, isLoading: isLoadingStock || isLoadingItems };
}
