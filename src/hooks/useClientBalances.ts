import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getBookingsWithPayments, BookingBalanceRow } from "../services/client";
import { formatCurrency } from "../utils/formatCurrency";

export interface ClientBalance {
  dni: number;
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
      const ivaAmount = (b.price / 100) * (b.tax ?? 0);
      const totalFacturado = b.price + ivaAmount;
      const totalCobrado = b.booking_payments.reduce((s, p) => s + p.amount, 0);
      const saldo = totalFacturado - totalCobrado;

      const bookingRow: BookingWithBalance = {
        id: b.id,
        event_date: b.event_date,
        organization: b.organization,
        booking_status: b.booking_status,
        totalFacturado,
        totalCobrado,
        saldo,
      };

      if (!map.has(b.client_dni)) {
        map.set(b.client_dni, {
          dni: b.client_dni,
          name: b.client?.name ?? "—",
          lastName: b.client?.lastName ?? "",
          eventos: 0,
          totalFacturado: 0,
          totalCobrado: 0,
          saldo: 0,
          bookings: [],
        });
      }

      const entry = map.get(b.client_dni)!;
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
