import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStock as updateStockAPI } from "../services/stock";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface stockProps {
  id: number;
  name: string;
  location: string;
  price: number;
  quantity: number;
  category:
    | "lights"
    | "ambientation"
    | "sound"
    | "structure"
    | "tools"
    | "cables"
    | "others"
    | "furniture"
    | "screen";
  updated_by: string;
}

export default function useUpdateStock({ category }: { category: string }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isUpdating, mutate: updateStock } = useMutation({
    mutationKey: [category],
    mutationFn: (stock: stockProps) => updateStockAPI(stock),
    onSuccess: () => {
      toast.success("Stock actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: [category],
      });
      navigate("/inventario");
    },
  });

  return { isUpdating, updateStock };
}
