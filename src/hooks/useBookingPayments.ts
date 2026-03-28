import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addPayment,
  deletePayment,
  NewPaymentProps,
} from "../services/bookingPayments";

export default function useBookingPayments(bookingId: number) {
  const queryClient = useQueryClient();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["booking_payments", bookingId] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
  }

  const { mutate: registerPayment, isPending: isAdding } = useMutation({
    mutationFn: (payment: NewPaymentProps) => addPayment(payment),
    onSuccess: () => {
      toast.success("Pago registrado");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removePayment, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) => deletePayment(id, bookingId),
    onSuccess: () => {
      toast.success("Pago eliminado");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { registerPayment, isAdding, removePayment, isRemoving };
}
