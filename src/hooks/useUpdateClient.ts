import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateClient } from "../services/client";
import { ClientProps } from "../types";

export default function useUpdateClient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isUpdating, mutate: editClient } = useMutation({
    mutationFn: (client: ClientProps) => updateClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente actualizado correctamente");
      navigate("/clientes");
    },
    onError: () => toast.error("Error al actualizar el cliente"),
  });

  return { isUpdating, editClient };
}
