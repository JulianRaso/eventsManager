import { supabase } from "./supabase";
import type { PersonalPaymentProps } from "./personalPayments";

export interface PersonalAssignmentDetail {
  id: number;
  booking_id: number | null;
  days: number;
  rate: number;
  notes: string | null;
  amount: number;
  booking: {
    event_date: string;
    organization: string;
    booking_status: string;
    place: string;
    start_time: string | null;
    end_time: string | null;
    event_type: string;
    client: { name: string; lastName: string } | null;
  } | null;
}

export interface PersonalReportDetailResult {
  personal: Record<string, unknown> & { id: number; name: string; lastName: string };
  assignments: PersonalAssignmentDetail[];
  payments: PersonalPaymentProps[];
  totalAdeudado: number;
  totalPagado: number;
  saldo: number;
}

function pickOne<T>(x: T | T[] | null | undefined): T | null {
  if (x == null) return null;
  return Array.isArray(x) ? x[0] ?? null : x;
}

export async function fetchPersonalReportDetail(
  personalId: number
): Promise<PersonalReportDetailResult | null> {
  const [{ data: personal, error: e1 }, assignRes, payRes] = await Promise.all([
    supabase.from("personal").select("*").eq("id", personalId).maybeSingle(),
    supabase
      .from("booking_personal")
      .select(
        `
        id,
        booking_id,
        days,
        rate,
        notes,
        booking (
          event_date,
          organization,
          booking_status,
          place,
          start_time,
          end_time,
          event_type,
          client (name, lastName)
        )
      `
      )
      .eq("personal_id", personalId),
    supabase
      .from("personal_payments")
      .select("*")
      .eq("personal_id", personalId)
      .order("payment_date", { ascending: false }),
  ]);

  if (e1) throw new Error("Error al cargar el empleado");
  if (!personal) return null;

  const { data: assignRows, error: e2 } = assignRes;
  const { data: paymentRows, error: e3 } = payRes;
  if (e2) throw new Error("Error al cargar asignaciones");
  if (e3) throw new Error("Error al cargar pagos");

  const raw = (assignRows ?? []) as {
    id: number;
    booking_id: number | null;
    days: number;
    rate: number;
    notes: string | null;
    booking: PersonalAssignmentDetail["booking"] | PersonalAssignmentDetail["booking"][] | null;
  }[];

  const assignments: PersonalAssignmentDetail[] = raw.map((row) => {
    const b = pickOne(row.booking as PersonalAssignmentDetail["booking"] | PersonalAssignmentDetail["booking"][] | null);
    let booking: PersonalAssignmentDetail["booking"] = null;
    if (b) {
      const c = pickOne(
        b.client as { name: string; lastName: string } | { name: string; lastName: string }[] | null | undefined
      );
      booking = {
        event_date: b.event_date,
        organization: b.organization,
        booking_status: b.booking_status,
        place: b.place,
        start_time: b.start_time,
        end_time: b.end_time,
        event_type: b.event_type,
        client: c ? { name: c.name, lastName: c.lastName } : null,
      };
    }
    return {
      id: row.id,
      booking_id: row.booking_id,
      days: row.days,
      rate: row.rate,
      notes: row.notes,
      amount: row.days * row.rate,
      booking,
    };
  });

  assignments.sort((a, b) => {
    const da = a.booking?.event_date ?? "";
    const db = b.booking?.event_date ?? "";
    return db.localeCompare(da);
  });

  const payments = (paymentRows ?? []) as PersonalPaymentProps[];
  const totalAdeudado = assignments.reduce((s, a) => s + a.amount, 0);
  const totalPagado = payments.reduce((s, p) => s + p.amount, 0);

  return {
    personal: personal as PersonalReportDetailResult["personal"],
    assignments,
    payments,
    totalAdeudado,
    totalPagado,
    saldo: totalAdeudado - totalPagado,
  };
}
