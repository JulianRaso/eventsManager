import { supabase } from "./supabase";

type BookingItem = {
  id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

type updateItem = {
  id: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

export async function itemController(items: BookingItem[]) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id !== undefined) {
      await updateItem(item as updateItem);
    }
    if (!item.id) {
      await addItems([item]);
    }
  }
}

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

export async function updateItem(item: updateItem) {
  const { error } = await supabase
    .from("booking_items")
    .update({ ...item })
    .eq("id", item.id);

  if (error) {
    throw new Error("Hubo un error al actualizar el equipo. Intente de nuevo.");
  }
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

export async function deleteItems(ids: number[]) {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const { error } = await supabase
      .from("booking_items")
      .delete()
      .eq("id", id);
    if (error)
      throw new Error(
        "Hubo un error al eliminar los equipos. Intente de nuevo."
      );
  }
}
