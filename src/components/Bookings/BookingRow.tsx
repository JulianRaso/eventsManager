import { useDeleteBooking } from "../../hooks/useDeleteBooking";
import { TableBody, TableData, TableRow } from "../Table";
import TableButtons from "../TableButtons";
import { formatDate } from "../formatDate";
import { IoEyeSharp } from "react-icons/io5";

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
  } = booking;
  const { name, lastName, phoneNumber } = client;

  return (
    <TableRow key={index}>
      <TableData>{index + 1}</TableData>
      <TableData>{name}</TableData>
      <TableData>{lastName}</TableData>
      <TableData>{phoneNumber}</TableData>
      <TableData>{organization}</TableData>
      <TableData>{formatDate(event_date)}</TableData>
      <TableData>{eventTypes[event_type]?.es}</TableData>
      <TableData>{place}</TableData>
      <TableData>
        <p
          className={`rounded-xl p-1.5 ${
            booking_status === "confirm"
              ? "bg-green-300"
              : booking_status === "pending"
              ? "bg-amber-300"
              : "bg-red-500"
          }`}
        >
          {booking_status === "pending"
            ? "Pendiente"
            : booking_status === "confirm"
            ? "Confirmado"
            : "Cancelado"}
        </p>
      </TableData>
      <TableData>
        {payment_status === "pending"
          ? "Pendiente"
          : payment_status === "partially_paid"
          ? "Señado"
          : "Abonado"}
      </TableData>
      <TableData>${0}</TableData>
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
