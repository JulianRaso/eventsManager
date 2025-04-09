import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../services/booking";

export default function useGetBookings() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  return { data, isLoading };
}
