import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStock as deleteStockAPI } from "../services/data";

export default function useDeleteStock() {
  const queryClient = useQueryClient();
  const { isLoading: isDelete, mutate: deleteStock } = useMutation({
    mutationFn: (id: number) => deleteStockAPI(id),
    onSuccess: () => {
      toast.success("El equipo fue eliminado con exito!");
      queryClient.invalidateQueries({
        queryKey: ["lights"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDelete, deleteStock };
}
