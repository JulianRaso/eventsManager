import { useQuery } from "@tanstack/react-query";
import { getBookingEvent } from "../services/booking";
import { getItems } from "../services/bookingItems";

export default function useGetBookingEvent(id: number) {
  const { data: booking, isLoading: isLoadingBooking } = useQuery({
    queryKey: ["bookingEvent", id],
    queryFn: () => getBookingEvent(id),
    enabled: Boolean(id),
  });

  const { data: items = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["bookingItems", id],
    queryFn: () => getItems(id),
    enabled: Boolean(id),
  });

  return {
    booking,
    items,
    isLoading: isLoadingBooking || isLoadingItems,
  };
}
