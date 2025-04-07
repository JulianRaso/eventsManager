import { supabase } from "./supabase";

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

export async function getStock({ category }: { category: string }) {
  const { data, error } = await supabase
    .from("equipment_stock")
    .select("*")
    .eq("category", category);

  if (error) {
    throw new Error(`There was an error while loading ${category}`);
  }
  return data;
}

//Insert data to Database
async function addBooking(booking: object) {
  const { data: bookingData, error: bookingError } = await supabase
    .from("booking")
    .insert([
      {
        ...booking,
      },
    ])
    .select();

  if (bookingError) {
    throw new Error(`There was an error while inserting data to booking`);
  }
  return bookingData;
}

interface BookingData {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  booking_status: string;
  comments: string;
  event_date: string;
  payment_status: string;
  location: string;
}

export async function createBooking(data: BookingData) {
  const { data: client, error } = await supabase
    .from("client")
    .insert([
      {
        name: data.name,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
      },
    ])
    .select();

  if (error) {
    throw new Error(`There was an error while inserting data to client`);
  }

  if (client[0].id) {
    return addBooking({
      client_id: client[0].id,
      event_date: data.event_date,
      place: data.location,
      booking_status: data.booking_status,
      payment_status: data.payment_status,
      comments: data.comments,
    });
  }
}

export async function deleteBooking(id: number) {
  const { error } = await supabase.from("booking").delete().eq("id", id);

  if (error) {
    throw new Error(`There was an error while deleting a booking`);
  }
}

export async function deleteStock(id: number) {
  const { error } = await supabase
    .from("equipment_stock")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`There was an error while deleting the stock`);
  }
}

export async function updateStock() {
  const { data, error } = await supabase
    .from("equipment_stock")
    .update({ other_column: "otherValue" })
    .eq("some_column", "someValue")
    .select();

  if (error) {
    throw new Error(`There was an error while updating the stock`);
  }

  return data;
}
