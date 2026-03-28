import AddLayout from "@/components/AddLayout";
import { formatDateLong } from "@/components/formatDate";
import { Button } from "@/components/ui/button";
import { getCurrentBooking } from "@/services/booking";
import { getBookingPayments, PaymentProps } from "@/services/bookingPayments";
import { checkClient } from "@/services/client";
import { BookingRecord } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import companyLogo from "../assets/ShowRental.png";
import Spinner from "@/components/Spinner";
import { Printer } from "lucide-react";

const eventTypes: Record<string, { es: string }> = {
  other: { es: "Otro" },
  fifteen_party: { es: "Quince Años" },
  corporate: { es: "Corporativo" },
  marriage: { es: "Casamiento" },
  birthday: { es: "Cumpleaños" },
};

const paymentMethodLabel: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
};

export default function ClientInvoice() {
  const [isLoading, setIsLoading] = useState(true);
  const invoiceID = Number(useParams().invoiceID);
  const [invoiceData, setInvoiceData] = useState<BookingRecord | null>(null);
  const [clientData, setClientData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [payments, setPayments] = useState<PaymentProps[]>([]);

  useEffect(() => {
    getCurrentBooking(invoiceID)
      .then((data = []) => {
        if (data && data.length > 0) {
          const first = data[0];
          setInvoiceData({
            created_at: first.created_at,
            client_dni: first.client_dni,
            event_date: first.event_date,
            event_type: first.event_type,
            organization: first.organization,
            place: first.place,
            booking_status: first.booking_status,
            payment_status: first.payment_status,
            comments: first.comments ?? "",
            tax: first.tax,
            revenue: first.revenue,
            price: first.price,
          });
          checkClient(first.client_dni).then((res) => {
            if (res?.data) {
              const { name, lastName, phoneNumber, email } = res.data;
              setClientData({
                name: name ?? "",
                lastName: lastName ?? "",
                phoneNumber: phoneNumber ?? "",
                email: email ?? "",
              });
            }
          });
          getBookingPayments(invoiceID).then((res) => {
            setPayments(res ?? []);
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [invoiceID]);

  if (!invoiceID || isLoading) return <Spinner />;
  if (!invoiceData) {
    return (
      <AddLayout>
        <p className="text-center text-muted-foreground">
          No se encontró la reserva.
        </p>
      </AddLayout>
    );
  }

  const ivaAmount = (invoiceData.price / 100) * (invoiceData.tax ?? 0);
  const totalCliente = invoiceData.price + ivaAmount;
  const totalPagado = payments.reduce((sum, p) => sum + p.amount, 0);
  const saldo = totalCliente - totalPagado;

  return (
    <AddLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={companyLogo}
              alt="Logo"
              className="h-14 w-14 rounded-xl border border-border object-cover shadow-sm"
            />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {invoiceData.organization}
              </h1>
              <p className="text-sm text-muted-foreground">
                San Juan 671, Corrientes, Argentina
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-medium text-foreground">Recibo</p>
            <p className="text-sm text-muted-foreground">
              {formatDateLong(invoiceData.created_at)}
            </p>
          </div>
        </div>

        {/* Datos del evento */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
            Datos del evento
          </h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Cliente
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">
                {clientData.name} {clientData.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tipo de evento
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">
                {eventTypes[invoiceData.event_type]?.es ?? invoiceData.event_type}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Teléfono
              </dt>
              <dd className="mt-0.5 text-sm text-foreground">
                {clientData.phoneNumber || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Fecha del evento
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">
                {formatDateLong(invoiceData.event_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Lugar
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">
                {invoiceData.place}
              </dd>
            </div>
          </dl>
        </div>

        {/* Pagos */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3 sm:px-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Pagos realizados
            </h2>
          </div>
          {payments.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">
              No se registraron pagos aún.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                    Método
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                    Notas
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground">
                      {formatDateLong(p.payment_date)}
                    </td>
                    <td className="px-5 py-3 text-foreground">
                      {paymentMethodLabel[p.payment_method] ?? p.payment_method}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {p.notes ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                      ${formatCurrency(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Resumen */}
        <div className="flex flex-col items-end gap-2 rounded-xl border border-border bg-muted/20 px-6 py-4">
          <div className="flex w-full max-w-xs flex-col gap-1.5 text-sm">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Total del evento</span>
              <span className="tabular-nums">${formatCurrency(invoiceData.price)}</span>
            </div>
            {invoiceData.tax > 0 && (
              <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">IVA ({invoiceData.tax}%)</span>
                <span className="tabular-nums">${formatCurrency(ivaAmount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-8 border-t border-border pt-1.5">
              <span className="text-muted-foreground">Total a abonar</span>
              <span className="font-medium tabular-nums">${formatCurrency(totalCliente)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Total pagado</span>
              <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                ${formatCurrency(totalPagado)}
              </span>
            </div>
            <div className="flex justify-between gap-8 border-t border-border pt-1.5">
              <span className="font-semibold text-foreground">Saldo pendiente</span>
              <span
                className={
                  saldo <= 0
                    ? "font-bold tabular-nums text-emerald-600 dark:text-emerald-400"
                    : "font-bold tabular-nums text-amber-600 dark:text-amber-400"
                }
              >
                ${formatCurrency(Math.max(0, saldo))}
              </span>
            </div>
          </div>
        </div>

        {/* Footer legal */}
        <p className="text-center text-xs text-muted-foreground">
          Este recibo no reemplaza la factura. Conservá tu comprobante de pago.
        </p>

        {/* Imprimir */}
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Imprimir recibo
          </Button>
        </div>
      </div>
    </AddLayout>
  );
}
