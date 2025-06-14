import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../services/booking";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface clientProps {
  dni: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

interface bookingProps {
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
