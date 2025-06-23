import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInvoice as updateInvoiceAPI } from "../services/bill";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

export default function useUpdateInvoice() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isUpdating, mutate: updateInvoice } = useMutation({
    mutationFn: (invoice: billType) => updateInvoiceAPI(invoice),
    onSuccess: () => {
      toast.success("Factura actualizada correctamente");
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      navigate("/gastos");
    },
  });

  return { isUpdating, updateInvoice };
}
