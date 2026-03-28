import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { patchBooking } from "../services/booking";
import { BookingStatus } from "../types";

interface PatchFields {
  booking_status?: BookingStatus;
  price?: number;
}

export default function usePatchBooking(bookingId: number) {
  const queryClient = useQueryClient();

  const { mutate: patch, isPending } = useMutation({
    mutationFn: (fields: PatchFields) => patchBooking(bookingId, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookingEvent", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { patch, isPending };
}
