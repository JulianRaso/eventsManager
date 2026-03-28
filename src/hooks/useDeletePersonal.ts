import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePersonal } from "../services/personal";

export default function useDeletePersonal() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: removePersonal } = useMutation({
    mutationFn: (id: number) => deletePersonal(id),
    onSuccess: () => {
      toast.success("Empleado eliminado");
      queryClient.invalidateQueries({ queryKey: ["personal"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, removePersonal };
}
