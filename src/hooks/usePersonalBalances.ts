import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getAllAssignmentsForBalances,
  getAllPersonalPayments,
  addPersonalPayment,
  deletePersonalPayment,
  type AssignmentBalanceRow,
  type PersonalPaymentProps,
  type NewPersonalPayment,
} from "../services/personalPayments";

export interface PersonalAssignmentRow {
  id: number;
  booking_id: number;
  event_date: string;
  organization: string;
  booking_status: string;
  amount: number;
}

export interface PersonalBalance {
  personalId: number;
  name: string;
  lastName: string;
  role: string;
  trabajos: number;
  totalAdeudado: number;
  totalPagado: number;
  saldo: number;
  assignments: PersonalAssignmentRow[];
  payments: PersonalPaymentProps[];
}

function bookingRow(
  row: AssignmentBalanceRow
): Pick<PersonalAssignmentRow, "event_date" | "organization" | "booking_status" | "booking_id"> & {
  amount: number;
} {
  const b = row.booking;
  const booking = Array.isArray(b) ? b[0] : b;
  const amount = row.days * row.rate;
  return {
    booking_id: row.booking_id ?? 0,
    event_date: booking?.event_date ?? "",
    organization: String(booking?.organization ?? ""),
    booking_status: String(booking?.booking_status ?? ""),
    amount,
  };
}

export function buildPersonalBalances(
  assignmentRows: AssignmentBalanceRow[],
  paymentRows: PersonalPaymentProps[]
): PersonalBalance[] {
  const map = new Map<number, PersonalBalance>();

  for (const row of assignmentRows) {
    const pid = row.personal_id;
    if (pid == null) continue;

    const personal = row.personal;
    const p = Array.isArray(personal) ? personal[0] : personal;
    const name = p?.name ?? "—";
    const lastName = p?.lastName ?? "";
    const role = p?.role ?? "";

    const sub = bookingRow(row);
    const assignment: PersonalAssignmentRow = {
      id: row.id,
      booking_id: sub.booking_id,
      event_date: sub.event_date,
      organization: sub.organization,
      booking_status: sub.booking_status,
      amount: sub.amount,
    };

    if (!map.has(pid)) {
      map.set(pid, {
        personalId: pid,
        name,
        lastName,
        role,
        trabajos: 0,
        totalAdeudado: 0,
        totalPagado: 0,
        saldo: 0,
        assignments: [],
        payments: [],
      });
    }

    const entry = map.get(pid)!;
    entry.trabajos += 1;
    entry.totalAdeudado += assignment.amount;
    entry.assignments.push(assignment);
  }

  for (const pay of paymentRows) {
    const pid = pay.personal_id;
    if (!map.has(pid)) {
      const p = pay.personal;
      const pers = Array.isArray(p) ? p[0] : p;
      map.set(pid, {
        personalId: pid,
        name: pers?.name ?? "—",
        lastName: pers?.lastName ?? "",
        role: pers?.role ?? "",
        trabajos: 0,
        totalAdeudado: 0,
        totalPagado: 0,
        saldo: 0,
        assignments: [],
        payments: [],
      });
    }
    const entry = map.get(pid)!;
    entry.payments.push(pay);
    entry.totalPagado += pay.amount;
  }

  for (const entry of map.values()) {
    entry.payments.sort(
      (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    );
    entry.saldo = entry.totalAdeudado - entry.totalPagado;
  }

  return Array.from(map.values()).sort((a, b) => b.saldo - a.saldo);
}

export default function usePersonalBalances(enabled: boolean) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["personalBalances"],
    queryFn: async () => {
      const [assignments, payments] = await Promise.all([
        getAllAssignmentsForBalances(),
        getAllPersonalPayments(),
      ]);
      return buildPersonalBalances(assignments, payments);
    },
    enabled,
  });

  const staff = useMemo(() => query.data ?? [], [query.data]);

  const addMutation = useMutation({
    mutationFn: (p: NewPersonalPayment) => addPersonalPayment(p),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["personalBalances"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePersonalPayment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["personalBalances"] }),
  });

  return {
    staff,
    isLoading: query.isLoading,
    addPayment: addMutation.mutateAsync,
    isAddingPayment: addMutation.isPending,
    deletePayment: deleteMutation.mutateAsync,
    isDeletingPayment: deleteMutation.isPending,
  };
}
