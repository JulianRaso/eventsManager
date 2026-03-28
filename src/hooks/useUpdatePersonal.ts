import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updatePersonal } from "../services/personal";
import { PersonaledProps } from "../types";

export default function useUpdatePersonal() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isUpdating, mutate: editPersonal } = useMutation({
    mutationFn: (data: PersonaledProps) => updatePersonal(data),
    onSuccess: () => {
      toast.success("Empleado actualizado con éxito");
      queryClient.invalidateQueries({ queryKey: ["personal"] });
      navigate("/personal");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, editPersonal };
}
