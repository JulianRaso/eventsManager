import BookingCard from "./BookingCard";

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
  event_type: string;
  price: number;
}

interface BookingsMobileListProps {
  bookings: Booking[];
}

export default function BookingsMobileList({ bookings }: BookingsMobileListProps) {
  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking, index) => (
        <BookingCard key={booking.id} booking={booking} index={index} />
      ))}
    </div>
  );
}
