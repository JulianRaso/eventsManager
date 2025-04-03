import { supabase } from "./supabase";

export async function getBookings() {
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

  return data;
}

export async function getLights() {
  const { data, error } = await supabase
    .from("equipment_stock")
    .select("*")
    .eq("type", "Iluminacion");

  if (error) {
    throw new Error("There was an error while loading bookings");
  }
  return data;
}

export async function getDecoration() {
  const { data, error } = await supabase
    .from("equipment_stock")
    .select("*")
    .eq("type", "Ambientacion");

  if (error) {
    throw new Error("There was an error while loading bookings");
  }
  return data;
}
