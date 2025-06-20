import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTransport as deleteTransportAPI } from "../services/transport";

export default function useDeleteTransport() {
  const queryClient = useQueryClient();
  const { isPending, mutate: deleteTransport } = useMutation({
    mutationKey: ["transport"],
    mutationFn: (vehicleId: number) => deleteTransportAPI(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transport"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deleteTransport, isPending };
}
