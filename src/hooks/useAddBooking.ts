import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/booking";
import { BookingProps, ClientProps, EquipmentItemProps } from "../types";

export function useAddBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addBooking } = useMutation({
    mutationFn: ({
      client,
      booking,
      equipment,
    }: {
      client: ClientProps;
      booking: BookingProps;
      equipment?: Omit<EquipmentItemProps, "booking_id">[];
    }) => createBooking(client, booking, equipment),
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
