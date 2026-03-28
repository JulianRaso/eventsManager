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

export async function getUpcomingBookingItems() {
  const today = new Date().toISOString().split("T")[0];

  const { data: bookings, error: bookingsError } = await supabase
    .from("booking")
    .select("id")
    .gte("event_date", today)
    .neq("booking_status", "cancel");

  if (bookingsError)
    throw new Error("Hubo un error al cargar las reservas próximas");

  if (!bookings || bookings.length === 0) return [];

  const ids = bookings.map((b) => b.id);

  const { data: items, error: itemsError } = await supabase
    .from("booking_items")
    .select("equipment_id, quantity, booking_id")
    .in("booking_id", ids);

  if (itemsError)
    throw new Error("Hubo un error al cargar los equipos reservados");

  return items ?? [];
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

export async function deleteItem(id: number) {
  const { error } = await supabase
    .from("booking_items")
    .delete()
    .eq("id", id);
  if (error)
    throw new Error("Hubo un error al eliminar el equipo. Intente de nuevo.");
}

export interface BookingItemWithDate {
  name: string;
  quantity: number;
  price: number;
  equipment_id: number;
  booking: { event_date: string; booking_status: string } | null;
}

export async function getAllBookingItemsWithDate(): Promise<BookingItemWithDate[]> {
  const { data, error } = await supabase
    .from("booking_items")
    .select("name, quantity, price, equipment_id, booking!inner(event_date, booking_status)");

  if (error) throw new Error("Error al cargar los artículos vendidos");
  return (data ?? []) as BookingItemWithDate[];
}
