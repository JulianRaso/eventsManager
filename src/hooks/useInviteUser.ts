import { useMutation } from "@tanstack/react-query";
import { inviteUser as inviteUserAPI } from "../services/user";
import toast from "react-hot-toast";

export default function useInviteUser() {
  const { isPending: isInviting, mutate: inviteUser } = useMutation({
    mutationKey: ["personal"],
    mutationFn: (email: string) => inviteUserAPI(email),
    onSuccess: () => toast.success("El usuario fue invitado!"),
    onError: () =>
      toast.error("Hubo un error al invitar al usuario. Intentelo de nuevo!"),
  });

  return { isInviting, inviteUser };
}
