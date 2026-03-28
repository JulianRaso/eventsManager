import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getInventoryWithAccounting,
  upsertItemAccounting,
  ItemAccountingProps,
} from "../services/itemAccounting";

export function useGetItemAccounting() {
  const { data, isLoading } = useQuery({
    queryKey: ["itemAccounting"],
    queryFn: getInventoryWithAccounting,
  });
  return { data: data ?? [], isLoading };
}

export function useUpsertItemAccounting() {
  const queryClient = useQueryClient();

  const { isPending: isSaving, mutate: saveAccounting } = useMutation({
    mutationFn: (payload: ItemAccountingProps) => upsertItemAccounting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemAccounting"] });
      toast.success("Parametrización guardada");
    },
    onError: () => toast.error("Error al guardar la parametrización"),
  });

  return { isSaving, saveAccounting };
}
