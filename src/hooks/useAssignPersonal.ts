import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addAssignment, deleteAssignment } from "../services/bookingPersonal";
import { AssignmentProps } from "../types";

export function useAssignPersonal(bookingId: number) {
  const queryClient = useQueryClient();

  const { isPending: isAssigning, mutate: assignPersonal } = useMutation({
    mutationFn: (data: AssignmentProps) => addAssignment(data),
    onSuccess: () => {
      toast.success("Personal asignado");
      queryClient.invalidateQueries({ queryKey: ["bookingPersonal", bookingId] });
    },
    onError: (err) => toast.error(err.message),
  });

  const { isPending: isRemoving, mutate: removeAssignment } = useMutation({
    mutationFn: (id: number) => deleteAssignment(id),
    onSuccess: () => {
      toast.success("Asignación eliminada");
      queryClient.invalidateQueries({ queryKey: ["bookingPersonal", bookingId] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isAssigning, assignPersonal, isRemoving, removeAssignment };
}
