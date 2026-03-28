import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addPersonal } from "../services/personal";
import { PersonalProps } from "../types";

export default function useAddPersonal() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: createPersonal } = useMutation({
    mutationFn: (data: PersonalProps) => addPersonal(data),
    onSuccess: () => {
      toast.success("Empleado agregado con éxito");
      queryClient.invalidateQueries({ queryKey: ["personal"] });
      navigate("/personal");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isAdding, createPersonal };
}
