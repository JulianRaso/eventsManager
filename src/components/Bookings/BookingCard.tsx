import { useDeleteBooking } from "../../hooks/useDeleteBooking";
import TableButtons from "../TableButtons";
import { formatDate } from "../formatDate";
import { cn } from "../../lib/utils";

interface Client {
  name: string;
  lastName: string;
  phoneNumber: string;
}

interface Booking {
  id: number;
  client: Client;
  booking_status: string;
  organization: string;
  event_date: string;
  payment_status: string;
  place: string;
  event_type: keyof typeof eventTypes;
  price: number;
}

interface BookingCardProps {
  booking: Booking;
  index?: number;
}

const eventTypes = {
  other: {
    es: "Otro",
    en: "Other",
  },
  fifteen_party: {
    es: "Quince Años",
    en: "Fifteen Party",
  },
  corporate: {
    es: "Corporativo",
    en: "Corporate",
  },
  marriage: {
    es: "Casamiento",
    en: "Marriage",
  },
  birthday: {
    es: "Cumpleaños",
    en: "Birthday",
  },
};

export default function BookingCard({ booking }: BookingCardProps) {
  const { isDeleting, deleteBooking } = useDeleteBooking();
  const {
    id,
    client,
    booking_status,
    event_date,
    payment_status,
    place,
    event_type,
    price,
  } = booking;
  const { name, lastName } = client;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-foreground truncate min-w-0">
          {name} {lastName}
        </h3>
        <span className="shrink-0 font-medium tabular-nums text-foreground">
          ${typeof price === "number" ? price.toLocaleString("es-AR") : price}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatDate(event_date)} · {eventTypes[event_type]?.es}
      </p>
      <p className="text-sm text-muted-foreground">{place}</p>
      <div className="flex flex-wrap gap-2">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
            booking_status === "confirm" &&
              "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
            booking_status === "pending" &&
              "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
            booking_status === "cancel" &&
              "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
          )}
        >
          {booking_status === "pending"
            ? "Pendiente"
            : booking_status === "confirm"
              ? "Confirmado"
              : "Cancelado"}
        </span>
        <span className="text-muted-foreground text-xs leading-6">
          {payment_status === "pending"
            ? "Pendiente"
            : payment_status === "partially_paid"
              ? "Seña"
              : "Abonado"}
        </span>
      </div>
      <div className="pt-1">
        <TableButtons
          id={id}
          route="/reservas/reserva"
          isDeleting={isDeleting}
          onDelete={deleteBooking}
          deleteLabel="esta reserva"
        />
      </div>
    </article>
  );
}
