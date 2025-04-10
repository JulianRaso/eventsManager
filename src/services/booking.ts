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
  client_dni: string;
  booking_status: string;
  comments: string;
  event_date: string;
  event_type: string;
  payment_status: string;
  place: string;
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
  if ((await checkClient(client.dni)) != "") {
    const data = await createClient(client);
    if (data) {
      addBooking(booking);
    }
  }
  return addBooking(booking);
}
