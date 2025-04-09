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
  client_id: string;
  booking_status: string;
  comments: string;
  event_date: string;
  event_type: string;
  payment_status: string;
  location: string;
}

//Get data from database
export async function getBookings() {
  const { data, error } = await supabase.from("booking").select(`
        *, 
        client(name, lastName, phoneNumber)
      `);

  if (error) {
    throw new Error("There was an error while loading bookings");
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
    throw new Error(`There was an error while inserting data to booking`);
  }
  return bookingData;
}

export async function deleteBooking(id: number) {
  const { error } = await supabase.from("booking").delete().eq("id", id);

  if (error) {
    throw new Error(`There was an error while deleting a booking`);
  }
}

//Create reservation
export async function createBooking(
  client: clientProps,
  booking: bookingProps
) {
  if ((await checkClient(client.dni)) === false) {
    createClient(client);
    addBooking(booking);
  }
  return addBooking(booking);
}
