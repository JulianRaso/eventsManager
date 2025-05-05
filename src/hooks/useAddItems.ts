import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItems } from "../services/bookingItems";
import toast from "react-hot-toast";

export default function useAddItems() {
  const queryClient = useQueryClient();
  const { isPending, mutate: addEquipment } = useMutation({
    mutationKey: ["booking"],
    mutationFn: (equipment) => addItems(equipment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { addEquipment, isPending };
}
