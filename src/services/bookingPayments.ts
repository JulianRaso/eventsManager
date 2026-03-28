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

async function syncPaymentStatus(bookingId: number) {
  const [{ data: payments }, { data: booking }] = await Promise.all([
    supabase
      .from("booking_payments")
      .select("amount")
      .eq("booking_id", bookingId),
    supabase
      .from("booking")
      .select("price")
      .eq("id", bookingId)
      .single(),
  ]);

  const collected = (payments ?? []).reduce(
    (sum: number, p: { amount: number }) => sum + p.amount,
    0
  );
  const price = (booking as { price: number } | null)?.price ?? 0;

  let payment_status: string;
  if (collected <= 0) payment_status = "pending";
  else if (collected < price) payment_status = "partially_paid";
  else payment_status = "paid";

  await supabase
    .from("booking")
    .update({ payment_status: payment_status as "pending" | "partially_paid" | "paid" })
    .eq("id", bookingId);
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
  const { data, error } = await supabase
    .from("booking_payments")
    .insert([payment])
    .select()
    .single();

  if (error) throw new Error("Error al registrar el pago");
  await syncPaymentStatus(payment.booking_id);
  return data as PaymentProps;
}

export async function deletePayment(id: number, bookingId: number) {
  const { error } = await supabase
    .from("booking_payments")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Error al eliminar el pago");
  await syncPaymentStatus(bookingId);
}
