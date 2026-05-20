import { supabase } from "./supabase";

export type PersonalPaymentMethod = "cash" | "transfer" | "card" | "bank_check";

export interface PersonalPaymentProps {
  id: number;
  personal_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string | null;
  created_at?: string | null;
  personal?: { name: string; lastName: string; role: string } | null;
}

export type NewPersonalPayment = Omit<PersonalPaymentProps, "id" | "created_at" | "personal">;

export interface AssignmentBalanceRow {
  id: number;
  booking_id: number | null;
  personal_id: number | null;
  days: number;
  rate: number;
  booking: {
    event_date: string;
    organization: string;
    booking_status: string;
  } | null;
  personal: { name: string; lastName: string; role: string } | null;
}

export async function getAllAssignmentsForBalances(): Promise<AssignmentBalanceRow[]> {
  const { data, error } = await supabase
    .from("booking_personal")
    .select(
      `
      id,
      booking_id,
      personal_id,
      days,
      rate,
      booking (event_date, organization, booking_status),
      personal (name, lastName, role)
    `
    )
    .not("personal_id", "is", null);

  if (error) throw new Error("Error al cargar asignaciones de personal");
  return (data ?? []) as AssignmentBalanceRow[];
}

export async function getAllPersonalPayments(): Promise<PersonalPaymentProps[]> {
  const { data, error } = await supabase
    .from("personal_payments")
    .select("*, personal(name, lastName, role)")
    .order("payment_date", { ascending: false });

  if (error) throw new Error("Error al cargar pagos al personal");
  return (data ?? []) as PersonalPaymentProps[];
}

export async function addPersonalPayment(payment: NewPersonalPayment) {
  const { error } = await supabase.from("personal_payments").insert(payment);
  if (error) throw new Error("Error al registrar el pago");
}

export async function deletePersonalPayment(id: number) {
  const { error } = await supabase.from("personal_payments").delete().eq("id", id);
  if (error) throw new Error("Error al eliminar el pago");
}
