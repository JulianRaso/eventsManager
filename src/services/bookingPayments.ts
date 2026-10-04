import { supabase } from "./supabase";

export interface PaymentProps {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: "cash" | "transfer" | "card";
  payment_date: string;
  notes?: string;
  created_at: string;
}

export type NewPaymentProps = Omit<PaymentProps, "id" | "created_at">;
export type PaymentStatus = "pending" | "partially_paid" | "paid";

function roundMoney(value: number) {
  return Math.round(Number(value) * 100) / 100;
}

function sumAmounts(payments: { amount: number | string }[] | null | undefined) {
  return roundMoney(
    (payments ?? []).reduce((sum, p) => sum + Number(p.amount || 0), 0)
  );
}

export function resolvePaymentStatus(
  collected: number,
  totalDue: number
): PaymentStatus {
  const paid = roundMoney(collected);
  const due = roundMoney(totalDue);
  if (paid <= 0) return "pending";
  if (paid < due) return "partially_paid";
  return "paid";
}

async function getBookingTotalDue(bookingId: number) {
  const { data: booking, error } = await supabase
    .from("booking")
    .select("price, tax")
    .eq("id", bookingId)
    .single();

  if (error) throw new Error("No se pudo cargar el total del evento");

  const price = Number(booking?.price ?? 0);
  const tax = Number(booking?.tax ?? 0);
  return roundMoney(price + (price / 100) * tax);
}

async function syncPaymentStatus(bookingId: number): Promise<PaymentStatus> {
  const [{ data: payments, error: paymentsError }, totalDue] = await Promise.all([
    supabase
      .from("booking_payments")
      .select("amount")
      .eq("booking_id", bookingId),
    getBookingTotalDue(bookingId),
  ]);

  if (paymentsError) throw new Error("No se pudieron cargar los pagos del evento");

  const collected = sumAmounts(payments);
  const payment_status = resolvePaymentStatus(collected, totalDue);

  const { error } = await supabase
    .from("booking")
    .update({ payment_status })
    .eq("id", bookingId);

  if (error) {
    throw new Error(
      `No se pudo actualizar el estado de pago: ${error.message}`
    );
  }

  return payment_status;
}

export interface PaymentWithBooking extends PaymentProps {
  booking: {
    id: number;
    event_date: string;
    organization: string;
    client: { name: string; lastName: string } | null;
  } | null;
}

export async function getAllPayments(): Promise<PaymentWithBooking[]> {
  const { data, error } = await supabase
    .from("booking_payments")
    .select("*, booking(id, event_date, organization, client(name, lastName))")
    .order("payment_date", { ascending: false });

  if (error) throw new Error("Error al cargar los pagos");
  return (data ?? []) as PaymentWithBooking[];
}

export async function getBookingPayments(bookingId: number) {
  const { data, error } = await supabase
    .from("booking_payments")
    .select("*")
    .eq("booking_id", bookingId)
    .order("payment_date", { ascending: true });

  if (error) throw new Error("Error al cargar los pagos");
  return (data ?? []) as PaymentProps[];
}

export async function addPayment(payment: NewPaymentProps) {
  const amount = roundMoney(Number(payment.amount));
  if (!(amount > 0)) throw new Error("El monto debe ser mayor a 0");

  const [{ data: payments, error: paymentsError }, totalDue] = await Promise.all([
    supabase
      .from("booking_payments")
      .select("amount")
      .eq("booking_id", payment.booking_id),
    getBookingTotalDue(payment.booking_id),
  ]);

  if (paymentsError) throw new Error("No se pudieron cargar los pagos del evento");

  const collected = sumAmounts(payments);
  const remaining = roundMoney(Math.max(0, totalDue - collected));

  if (amount > remaining) {
    throw new Error(
      remaining <= 0
        ? "Este evento ya está completamente abonado"
        : `El monto no puede superar el saldo pendiente ($${remaining.toFixed(2)})`
    );
  }

  const { data, error } = await supabase
    .from("booking_payments")
    .insert([{ ...payment, amount }])
    .select()
    .single();

  if (error) throw new Error("Error al registrar el pago");

  const payment_status = await syncPaymentStatus(payment.booking_id);
  return { payment: data as PaymentProps, payment_status };
}

export async function deletePayment(id: number, bookingId: number) {
  const { error } = await supabase
    .from("booking_payments")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Error al eliminar el pago");
  const payment_status = await syncPaymentStatus(bookingId);
  return { payment_status };
}
