import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteClient } from "../services/client";

export default function useDeleteClient() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: removeClient } = useMutation({
    mutationFn: (dni: number) => deleteClient(dni),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente eliminado correctamente");
    },
    onError: () => toast.error("Error al eliminar el cliente"),
  });

  return { isDeleting, removeClient };
}
