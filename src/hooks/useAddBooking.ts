import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../services/data";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useAddBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isAdding, mutate: addBooking } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success("La reserva fue creada con exito!");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      navigate("/reservas");
    },
    onError: (err) => {
      toast.error(err.message);
      alert(err.message);
    },
  });
  return { isAdding, addBooking };
}
