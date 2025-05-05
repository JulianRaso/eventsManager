import { supabase } from "./supabase";

export async function addItems(items) {
  const { data, error } = await supabase
    .from("booking_items")
    .insert([...items])
    .select();

  if (error) {
    throw new Error("Hubo un error al agregar los equipos. Intente de nuevo.");
  }
  return data;
}

export async function getItems(id: number) {
  const { data, error } = supabase
    .from("booking_items")
    .select("*")
    .eq("booking_id", id);

  if (error)
    throw new Error("Hubo un error al cargar los equipos. Intente de nuevo.");

  return data;
}
