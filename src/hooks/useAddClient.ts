import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createClient } from "../services/client";
import { ClientProps, NewClientProps } from "../types";

export default function useAddClient() {
  const queryClient = useQueryClient();

  const { isPending: isAdding, mutate: addClient, mutateAsync: addClientAsync } =
    useMutation({
      mutationFn: (client: NewClientProps) => createClient(client),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        toast.success("Cliente creado correctamente");
      },
      onError: (err) => toast.error(err.message || "Error al crear el cliente"),
    });

  return { isAdding, addClient, addClientAsync };
}

export type { ClientProps, NewClientProps };
