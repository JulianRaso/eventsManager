import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateBooking as updateBookingAPI } from "../services/booking";

interface bookingProps {
  id: number;
  client_dni: string;
  booking_status: string;
  comments: string;
  event_date: string;
  event_type: string;
  payment_status: string;
  place: string;
}

export default function useUpdateBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isUpdating, mutate: updateBooking } = useMutation({
    mutationKey: ["bookings"],
    mutationFn: (booking: bookingProps) => updateBookingAPI(booking),
    onSuccess: () => {
      toast.success("Reserva actualizada correctamente");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      navigate("/reservas");
    },
  });

  return { isUpdating, updateBooking };
}
