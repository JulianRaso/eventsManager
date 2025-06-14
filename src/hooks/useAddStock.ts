import toast from "react-hot-toast";
import { addStock as addStockAPI } from "../services/stock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface StockProps {
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

export default function useAddStock() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addStock } = useMutation({
    mutationFn: (data: StockProps) => addStockAPI(data),
    onSuccess: () => {
      toast.success("El equipo fue agregado con exito!");
      queryClient.invalidateQueries({
        queryKey: [
          "sound",
          "lights",
          "ambientation",
          "structure",
          "cables",
          "screen",
          "furniture",
          "tools",
          "others",
        ],
      });
      navigate("/inventario");
    },
  });

  return { isAdding, addStock };
}
