import { useMutation } from "@tanstack/react-query";
import { logOut as logOutAPI } from "../services/user";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useLogOut() {
  const navigate = useNavigate();
  const { isPending: isLoginOut, mutate: logOut } = useMutation({
    mutationKey: ["user"],
    mutationFn: logOutAPI,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isLoginOut, logOut };
}
