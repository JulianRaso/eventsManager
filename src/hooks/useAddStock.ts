import toast from "react-hot-toast";
import { addInventory } from "../services/stock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { InventoryProps } from "../types";

export default function useAddStock() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addStock } = useMutation({
    mutationFn: (data: InventoryProps) => addInventory(data),
    onSuccess: () => {
      toast.success("El equipo fue agregado con exito!");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      navigate("/inventario");
    },
  });

  return { isAdding, addStock };
}
