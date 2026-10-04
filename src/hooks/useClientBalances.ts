import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getBookingsWithPayments, BookingBalanceRow } from "../services/client";
import { formatCurrency } from "../utils/formatCurrency";

export interface ClientBalance {
  ID_CLIENTE: number;
  COD_CLIENTE: string | null;
  dni: number | null;
  name: string;
  lastName: string;
  eventos: number;
  totalFacturado: number;
  totalCobrado: number;
  saldo: number;
  bookings: BookingWithBalance[];
}

export interface BookingWithBalance {
  id: number;
  event_date: string;
  organization: string;
  booking_status: string;
  payment_status: "pending" | "partially_paid" | "paid";
  totalFacturado: number;
  totalCobrado: number;
  saldo: number;
}

export { formatCurrency };

export default function useClientBalances() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["clientBalances"],
    queryFn: getBookingsWithPayments,
  });

  const clients = useMemo(() => {
    const map = new Map<number, ClientBalance>();

    data.forEach((b: BookingBalanceRow) => {
      const price = Number(b.price ?? 0);
      const tax = Number(b.tax ?? 0);
      const ivaAmount = (price / 100) * tax;
      const totalFacturado = Math.round((price + ivaAmount) * 100) / 100;
      const totalCobrado = Math.round(
        b.booking_payments.reduce((s, p) => s + Number(p.amount || 0), 0) * 100
      ) / 100;
      const saldo = Math.round((totalFacturado - totalCobrado) * 100) / 100;
      const payment_status =
        totalCobrado <= 0
          ? "pending"
          : saldo > 0
            ? "partially_paid"
            : "paid";

      const bookingRow: BookingWithBalance = {
        id: b.id,
        event_date: b.event_date,
        organization: b.organization,
        booking_status: b.booking_status,
        payment_status,
        totalFacturado,
        totalCobrado,
        saldo,
      };

      if (!map.has(b.client_id)) {
        map.set(b.client_id, {
          ID_CLIENTE: b.client_id,
          COD_CLIENTE: b.client?.COD_CLIENTE ?? null,
          dni: b.client?.dni ?? null,
          name: b.client?.name ?? "—",
          lastName: b.client?.lastName ?? "",
          eventos: 0,
          totalFacturado: 0,
          totalCobrado: 0,
          saldo: 0,
          bookings: [],
        });
      }

      const entry = map.get(b.client_id)!;
      entry.eventos += 1;
      entry.totalFacturado += totalFacturado;
      entry.totalCobrado += totalCobrado;
      entry.saldo += saldo;
      entry.bookings.push(bookingRow);
    });

    return Array.from(map.values()).sort((a, b) => b.saldo - a.saldo);
  }, [data]);

  return { clients, isLoading };
}
