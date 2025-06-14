import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateBooking as updateBookingAPI } from "../services/booking";

interface bookingProps {
  id: number;
  client_dni: number;
  booking_status: "pending" | "cancel" | "confirm";
  comments: string;
  organization: "Muzek" | "Show Rental";
  event_date: string;
  event_type: "birthday" | "marriage" | "corporate" | "fifteen_party" | "other";
  payment_status: "pending" | "partially_paid" | "paid";
  place: string;
  tax: number;
  revenue: number;
  price: number;
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
