import toast from "react-hot-toast";
import { checkClient, createClient } from "./client";
import { supabase } from "./supabase";

interface clientProps {
  dni: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

interface bookingProps {
  id?: number;
  client_dni: string;
  booking_status: string;
  comments: string;
  organization: string;
  event_date: string;
  event_type: string;
  payment_status: string;
  place: string;
  tax: string;
  revenue: string;
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
  const confirmClient = await checkClient(client.dni);
  if (confirmClient.dni === "") {
    const data = await createClient(client);
    if (data) {
      addBooking(booking);
    }
  }
  return addBooking(booking);
}

export async function updateBooking(booking: bookingProps) {
  console.log(booking);

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
