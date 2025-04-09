import { useDeleteBooking } from "../../hooks/useDeleteBooking";
import Action from "../Action";
import TableData from "../ui/TableData";

function formatDate(date: string) {
  const dateArr = date.split("-");
  const formatedDate = dateArr.reverse().join("/");
  return formatedDate;
}

interface Client {
  name: string;
  lastName: string;
  phoneNumber: string;
}

interface Booking {
  id: number;
  client: Client;
  booking_status: string;
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
    event_date,
    payment_status,
    place,
    event_type,
  } = booking;
  const { name, lastName, phoneNumber } = client;

  return (
    <tbody>
      <tr className="hover:bg-gray-50">
        <TableData>{index + 1}</TableData>
        <TableData>{name}</TableData>
        <TableData>{lastName}</TableData>
        <TableData>{phoneNumber}</TableData>
        <TableData>{formatDate(event_date)}</TableData>
        <TableData>{eventTypes[event_type]?.es}</TableData>
        <TableData>{place}</TableData>
        <TableData>
          <p
            className={`w-fit rounded-xl p-1.5 ${
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
          <Action id={id} isDeleting={isDeleting} onDelete={deleteBooking} />
        </TableData>
      </tr>
    </tbody>
  );
}
