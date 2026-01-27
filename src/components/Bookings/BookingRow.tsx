import { useDeleteBooking } from "../../hooks/useDeleteBooking";
import { TableData, TableRow } from "../Table";
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

interface bookingProps {
  booking: Booking;
  index: number;
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

export default function BookingRow({ booking, index }: bookingProps) {
  const { isDeleting, deleteBooking } = useDeleteBooking();
  const {
    id,
    client,
    booking_status,
    organization,
    event_date,
    payment_status,
    place,
    event_type,
    price,
  } = booking;
  const { name, lastName, phoneNumber } = client;

  return (
    <TableRow key={index}>
      <TableData>{index + 1}</TableData>
      <TableData>{name + " " + lastName}</TableData>
      <TableData>{phoneNumber}</TableData>
      <TableData>{organization}</TableData>
      <TableData>{formatDate(event_date)}</TableData>
      <TableData className="hidden lg:table-cell">
        {eventTypes[event_type]?.es}
      </TableData>
      <TableData>{place}</TableData>
      <TableData>
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
      </TableData>
      <TableData>
        <span className="text-muted-foreground">
          {payment_status === "pending"
            ? "Pendiente"
            : payment_status === "partially_paid"
            ? "Seña"
            : "Abonado"}
        </span>
      </TableData>
      <TableData className="font-medium tabular-nums">
        ${typeof price === "number" ? price.toLocaleString("es-AR") : price}
      </TableData>
      <TableData>
        <TableButtons
          id={id}
          route="/reservas/reserva"
          isDeleting={isDeleting}
          onDelete={deleteBooking}
        />
      </TableData>
    </TableRow>
  );
}
