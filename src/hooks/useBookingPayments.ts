import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addPayment,
  deletePayment,
  NewPaymentProps,
  PaymentStatus,
} from "../services/bookingPayments";

export default function useBookingPayments(bookingId: number) {
  const queryClient = useQueryClient();

  function patchBookingStatus(payment_status: PaymentStatus) {
    queryClient.setQueryData(["bookingEvent", bookingId], (old: unknown) => {
      if (!old || typeof old !== "object") return old;
      return { ...old, payment_status };
    });
  }

  async function invalidate() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["booking_payments", bookingId] }),
      queryClient.invalidateQueries({ queryKey: ["bookings"] }),
      queryClient.invalidateQueries({ queryKey: ["bookingEvent", bookingId] }),
      queryClient.invalidateQueries({ queryKey: ["clientBalances"] }),
    ]);
  }

  const { mutate: registerPayment, isPending: isAdding } = useMutation({
    mutationFn: (payment: NewPaymentProps) => addPayment(payment),
    onSuccess: async ({ payment_status }) => {
      patchBookingStatus(payment_status);
      toast.success("Pago registrado");
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removePayment, isPending: isRemoving } = useMutation({
    mutationFn: (id: number) => deletePayment(id, bookingId),
    onSuccess: async ({ payment_status }) => {
      patchBookingStatus(payment_status);
      toast.success("Pago eliminado");
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { registerPayment, isAdding, removePayment, isRemoving };
}
