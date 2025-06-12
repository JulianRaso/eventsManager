import toast from "react-hot-toast";
import { checkClient, createClient } from "./client";
import { supabase } from "./supabase";

interface clientProps {
  dni: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

interface bookingProps {
  client_dni: number;
  booking_status: "pending" | "cancel" | "confirm";
  comments: string;
  organization: "Muzek" | "Show Rental";
  event_date: string;
  event_type: "birthday" | "marriage" | "corporate" | "fifteen_party" | "other";
  payment_status: "pending" | "partially_paid" | "paid";
  place: string;
  tax: string;
  revenue: string;
  price: number;
}

interface bookedProps {
  id: number;
  bookingProps: bookingProps;
}

//Get data from database
export async function getBookings() {
  const { data, error } = await supabase.from("booking").select(`
        *, 
        client(name, lastName, phoneNumber)
      `);

  if (error) {
    toast.error(
      "Hubo un error al cargar las reservas, por favor intente nuevamente"
    );
  }

  return data;
}

//Insert data to Database

export async function addBooking(booking: bookingProps) {
  const { data: bookingData, error: bookingError } = await supabase
    .from("booking")
    .insert([
      {
        ...booking,
      },
    ]);

  if (bookingError) {
    toast.error(
      "Hubo un error al crear la reserva, por favor intente nuevamente"
    );
  }
  return bookingData;
}

export async function deleteBooking(id: number) {
  const { error } = await supabase.from("booking").delete().eq("id", id);

  if (error) {
    toast.error(
      "Hubo un error al eliminar la reserva, por favor intente nuevamente"
    );
  }
}

//Create reservation
export async function createBooking(
  client: clientProps,
  booking: bookingProps
) {
  const confirmClientResponse = await checkClient(client.dni);
  const confirmClient = confirmClientResponse.data;
  if (
    !confirmClient ||
    (Array.isArray(confirmClient) && confirmClient.length === 0)
  ) {
    const data = await createClient(client);
    if (data) {
      addBooking(booking);
    }
    return addBooking(booking);
  }
  return addBooking(booking);
}

export async function updateBooking(booking: bookedProps) {
  const { data, error } = await supabase
    .from("booking")
    .update({ ...booking })
    .eq("id", booking.id)
    .select();

  if (error) {
    toast.error(
      "Hubo un error al actualizar la reserva, por favor intente nuevamente"
    );
  }
  return data;
}

export async function getCurrentBooking(bookingId: number) {
  const { data: booking, error } = await supabase
    .from("booking")
    .select("*")
    .eq("id", bookingId);

  if (error) {
    toast.error(
      "Hubo un error al cargar la reserva, por favor intente nuevamente"
    );
  }

  return booking;
}
