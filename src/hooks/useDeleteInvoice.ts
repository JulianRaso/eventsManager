import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteInvoice as deleteInvoiceAPI } from "../services/bill";

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const { isPending: isDeleting, mutate: deleteInvoice } = useMutation({
    mutationFn: (id: number) => deleteInvoiceAPI(id),
    onSuccess: () => {
      toast.success("La factura fue eliminada con exito!");
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteInvoice };
}
