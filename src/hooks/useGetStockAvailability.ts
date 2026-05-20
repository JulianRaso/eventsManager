import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../services/stock";
import { getUpcomingBookingItems } from "../services/bookingItems";

type Options = {
  date?: string;
  startTime?: string | null;
  endTime?: string | null;
  excludeBookingId?: number;
};

function timesOverlap(
  bStart: string | null,
  bEnd: string | null,
  tStart: string | null | undefined,
  tEnd: string | null | undefined
): boolean {
  if (!bStart || !bEnd || !tStart || !tEnd) return true;
  return tStart < bEnd && tEnd > bStart;
}

export default function useGetStockAvailability(options?: Options) {
  const { date, startTime, endTime, excludeBookingId } = options ?? {};

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
        .filter((bi) => {
          if (bi.equipment_id !== item.id) return false;
          if (excludeBookingId && bi.booking_id === excludeBookingId) return false;
          if (date) {
            if (bi.event_date !== date) return false;
            return timesOverlap(bi.start_time, bi.end_time, startTime, endTime);
          }
          return true;
        })
        .reduce((sum, bi) => sum + bi.quantity, 0);
      return {
        ...item,
        allocated,
        available: Math.max(0, item.quantity - allocated),
      };
    });
  }, [stock, upcomingItems, date, startTime, endTime, excludeBookingId]);

  return { availability, isLoading: isLoadingStock || isLoadingItems };
}
