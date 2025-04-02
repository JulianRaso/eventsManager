import { supabase } from "./supabase";

async function getBookings() {
  const { data, error } = await supabase.from("booking").select(`
      id, 
      booking_status, 
      paid_status, 
      place, 
      event_date, 
      created_at, 
      client_id, 
      client(name, lastName, phoneNumber)
    `);

  if (error) {
    throw new Error("There was an error while loading bookings");
  }

  return data.map((booking) => ({
    ...booking,
    ...booking.client, // Merge client fields directly into the booking object
    client: undefined, // Remove the nested client object
  }));
}

export { getBookings };
