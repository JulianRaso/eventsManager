import { useQuery } from "@tanstack/react-query";
import { getBookingBills } from "../services/bill";

export default function useGetBookingBills(bookingId: number) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookingBills", bookingId],
    queryFn: () => getBookingBills(bookingId),
  });
  return { bills: data, isLoading };
}
