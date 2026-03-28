import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/booking";
import { AssignmentProps, BookingProps, ClientProps, EquipmentItemProps } from "../types";

export function useAddBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addBooking } = useMutation({
    mutationFn: ({
      client,
      booking,
      equipment,
      personnel,
    }: {
      client: ClientProps;
      booking: BookingProps;
      equipment?: Omit<EquipmentItemProps, "booking_id">[];
      personnel?: Omit<AssignmentProps, "booking_id">[];
    }) => createBooking(client, booking, equipment, personnel),
    onSuccess: (data) => {
      toast.success("La reserva fue creada con exito!");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      navigate(`/evento/${data.id}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isAdding, addBooking };
}
