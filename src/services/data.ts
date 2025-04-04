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
async function addBooking(clientID: number, booking: object) {
  const { data: bookingData, error: bookingError } = await supabase
    .from("booking")
    .insert([
      {
        client_id: clientID,
        ...booking,
      },
    ])
    .select();

  if (bookingError) {
    throw new Error(`There was an error while inserting data to booking`);
  }
  return bookingData;
}

export async function createBooking(clientData: object, booking: object) {
  const { data: client, error } = await supabase
    .from("client")
    .insert([clientData])
    .select();

  if (error) {
    throw new Error(`There was an error while inserting data to client`);
  }

  if (client[0].id) {
    addBooking(client[0].id, booking);
  }
}
