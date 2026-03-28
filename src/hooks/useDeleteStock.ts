import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteInventory } from "../services/stock";

export default function useDeleteStock(category: string) {
  const queryClient = useQueryClient();
  const { isPending: isDelete, mutate: deleteStock } = useMutation({
    mutationFn: (id: number) => deleteInventory(id),
    onSuccess: () => {
      toast.success("El equipo fue eliminado con exito!");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: [category] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDelete, deleteStock };
}
