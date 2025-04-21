import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../services/booking";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface clientProps {
  dni: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

interface bookingProps {
  client_dni: string;
  booking_status: string;
  comments: string;
  organization: string;
  event_date: string;
  event_type: string;
  payment_status: string;
  place: string;
  tax: string;
  revenue: string;
}

export function useAddBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addBooking } = useMutation({
    mutationFn: ({
      client,
      booking,
    }: {
      client: clientProps;
      booking: bookingProps;
    }) => createBooking(client, booking),
    onSuccess: () => {
      toast.success("La reserva fue creada con exito!");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      navigate("/reservas");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isAdding, addBooking };
}
