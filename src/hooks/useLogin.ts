import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logIn } from "../services/user";

interface userProps {
  email: string;
  password: string;
}

export default function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPending, mutate: login } = useMutation({
    mutationKey: ["user"],
    mutationFn: (user: userProps) => logIn(user),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      toast.success(`Bienvenido de regreso!`);
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isPending, login };
}
