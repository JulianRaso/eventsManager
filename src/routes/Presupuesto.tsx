import AddLayout from "@/components/AddLayout";
import { formatDateLong } from "@/components/formatDate";
import { Button } from "@/components/ui/button";
import { getCurrentBooking } from "@/services/booking";
import { getItems } from "@/services/bookingItems";
import { checkClient } from "@/services/client";
import { BookingRecord, EquipmentItemProps } from "@/types";
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

export default function Presupuesto() {
  const [isLoading, setIsLoading] = useState(true);
  const bookingId = Number(useParams().bookingId);
  const [bookingData, setBookingData] = useState<BookingRecord | null>(null);
  const [clientData, setClientData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [equipment, setEquipment] = useState<EquipmentItemProps[]>([]);

  useEffect(() => {
    getCurrentBooking(bookingId)
      .then((data = []) => {
        if (data && data.length > 0) {
          const first = data[0];
          setBookingData({
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
          getItems(bookingId).then((res) => {
            if (res?.length) {
              setEquipment(
                res.map((item) => ({
                  id: item.id,
                  booking_id: item.booking_id,
                  equipment_id: item.equipment_id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price ?? 0,
                }))
              );
            }
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [bookingId]);

  if (!bookingId || isLoading) return <Spinner />;
  if (!bookingData) {
    return (
      <AddLayout>
        <p className="text-center text-muted-foreground">
          No se encontró la reserva.
        </p>
      </AddLayout>
    );
  }

  const ivaAmount = (bookingData.price / 100) * (bookingData.tax ?? 0);
  const totalCliente = bookingData.price + ivaAmount;

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
                {bookingData.organization}
              </h1>
              <p className="text-sm text-muted-foreground">
                San Juan 671, Corrientes, Argentina
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-medium text-foreground">Presupuesto</p>
            <p className="text-sm text-muted-foreground">
              {formatDateLong(bookingData.created_at)}
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
                {eventTypes[bookingData.event_type]?.es ?? bookingData.event_type}
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
                {formatDateLong(bookingData.event_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Lugar
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">
                {bookingData.place}
              </dd>
            </div>
          </dl>
        </div>

        {/* Detalle de equipamiento */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3 sm:px-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Detalle de la reserva
            </h2>
          </div>
          {equipment.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">
              No hay equipamiento asignado.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                    Descripción
                  </th>
                  <th className="px-5 py-3 text-center font-medium text-muted-foreground">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr
                    key={item.id ?? item.equipment_id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-5 py-3 text-foreground">{item.name}</td>
                    <td className="px-5 py-3 text-center tabular-nums">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Total */}
        <div className="flex flex-col items-end gap-2 rounded-xl border border-border bg-muted/20 px-6 py-4">
          <div className="flex w-full max-w-xs flex-col gap-1.5 text-sm">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Precio base</span>
              <span className="tabular-nums">${formatCurrency(bookingData.price)}</span>
            </div>
            {bookingData.tax > 0 && (
              <div className="flex justify-between gap-8">
                <span className="text-muted-foreground">IVA ({bookingData.tax}%)</span>
                <span className="tabular-nums">${formatCurrency(ivaAmount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-8 border-t border-border pt-1.5">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold tabular-nums text-foreground">
                ${formatCurrency(totalCliente)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer legal */}
        <p className="text-center text-xs text-muted-foreground">
          Este presupuesto tiene validez de 30 días desde su emisión.
        </p>

        {/* Imprimir */}
        <div className="flex justify-end">
          <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Imprimir presupuesto
          </Button>
        </div>
      </div>
    </AddLayout>
  );
}
