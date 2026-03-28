import { useQuery } from "@tanstack/react-query";
import { getBookingPayments } from "../services/bookingPayments";

export default function useGetBookingPayments(bookingId: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["booking_payments", bookingId],
    queryFn: () => getBookingPayments(bookingId),
    enabled: !!bookingId,
  });

  return { payments: data ?? [], isLoading };
}
