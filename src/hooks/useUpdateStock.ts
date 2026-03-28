import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventory } from "../services/stock";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { InventoriedProps } from "../types";

export default function useUpdateStock({ category }: { category: string }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isUpdating, mutate: updateStock } = useMutation({
    mutationFn: (item: InventoriedProps) => updateInventory(item),
    onSuccess: () => {
      toast.success("Inventario actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: [category] });
      navigate("/inventario");
    },
  });

  return { isUpdating, updateStock };
}
