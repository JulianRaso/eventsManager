import { useQuery } from "@tanstack/react-query";
import { getBookingPersonal } from "../services/bookingPersonal";

export default function useGetBookingPersonal(bookingId: number) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookingPersonal", bookingId],
    queryFn: () => getBookingPersonal(bookingId),
    enabled: Boolean(bookingId),
  });
  return { data, isLoading };
}
