import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addInvoice, deleteInvoice } from "../services/bill";

interface NewBill {
  name: string;
  amount: number;
  paid_with: "cash" | "card" | "transfer" | "bank check";
  paid_by: string;
  paid_to?: string;
  quantity: number;
  updated_by: string;
}

export default function useBookingBills(bookingId: number) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["bookingBills", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
  };

  const { mutate: addBill, isPending: isAdding } = useMutation({
    mutationFn: (bill: NewBill) => addInvoice({ ...bill, booking_id: bookingId }),
    onSuccess: invalidate,
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removeBill, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) => deleteInvoice(id),
    onSuccess: invalidate,
    onError: (err: Error) => toast.error(err.message),
  });

  return { addBill, isAdding, removeBill, isRemoving };
}
