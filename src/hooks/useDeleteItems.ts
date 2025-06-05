import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteItems as deleteItemsAPI } from "../services/bookingItems";

export default function useDeleteItems() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: deleteItem } = useMutation({
    mutationFn: (id: number) => deleteItemsAPI(id),
    onSuccess: () => {
      toast.success("El equipo fue eliminado con exito!");
      queryClient.invalidateQueries({
        queryKey: ["booking_items"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteItem };
}
