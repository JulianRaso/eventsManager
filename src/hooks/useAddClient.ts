import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createClient } from "../services/client";
import { ClientProps } from "../types";

export default function useAddClient() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addClient } = useMutation({
    mutationFn: (client: ClientProps) => createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente creado correctamente");
      navigate("/clientes");
    },
    onError: () => toast.error("Error al crear el cliente"),
  });

  return { isAdding, addClient };
}
