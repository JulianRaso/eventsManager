import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addInvoice as addInvoiceAPI } from "../services/bill";

type billType = {
  id?: number;
  name: string;
  quantity: number;
  paid_with: "cash" | "card" | "transfer" | "bank check";
  paid_by: string;
  amount: number;
  booking_id?: number;
  created_at?: string;
  paid_to?: string;
  updated_by: string;
  cbu?: number;
};

export function useAddInvoice() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending: isAdding, mutate: addInvoice } = useMutation({
    mutationFn: (invoice: billType) => addInvoiceAPI(invoice),
    onSuccess: () => {
      toast.success("La factura fue creada con exito!");
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      navigate("/gastos");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { isAdding, addInvoice };
}
