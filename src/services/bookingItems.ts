import { supabase } from "./supabase";

type BookingItem = {
  item_id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

export async function addItems(items: BookingItem[]) {
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
  const { data, error } = await supabase
    .from("booking_items")
    .select("*")
    .eq("booking_id", id);

  if (error)
    throw new Error("Hubo un error al cargar los equipos. Intente de nuevo.");

  return data;
}

export async function deleteItems(id: number) {
  const { error } = await supabase.from("booking_items").delete().eq("id", id);

  if (error)
    throw new Error("Hubo un error al eliminar los equipos. Intente de nuevo.");
}
