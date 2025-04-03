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
