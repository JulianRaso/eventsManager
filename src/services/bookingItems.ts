import { BookingStatus, EventType, Organization } from "../types";
import { supabase } from "./supabase";

export type UpcomingBookingItem = {
  equipment_id: number;
  quantity: number;
  booking_id: number;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  organization: Organization;
  event_type: EventType;
  place: string;
};

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

export async function getUpcomingBookingItems(): Promise<UpcomingBookingItem[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data: bookings, error: bookingsError } = await supabase
    .from("booking")
    .select(
      "id, event_date, start_time, end_time, organization, event_type, place"
    )
    .gte("event_date", today)
    .neq("booking_status", "cancel");

  if (bookingsError)
    throw new Error("Hubo un error al cargar las reservas próximas");

  if (!bookings || bookings.length === 0) return [];

  const ids = bookings.map((b) => b.id);
  const bookingMap = new Map(bookings.map((b) => [b.id, b]));

  const { data: items, error: itemsError } = await supabase
    .from("booking_items")
    .select("equipment_id, quantity, booking_id")
    .in("booking_id", ids);

  if (itemsError)
    throw new Error("Hubo un error al cargar los equipos reservados");

  return (items ?? []).map((item) => {
    const booking = bookingMap.get(item.booking_id);
    return {
      equipment_id: item.equipment_id,
      quantity: item.quantity,
      booking_id: item.booking_id,
      event_date: booking?.event_date ?? "",
      start_time: booking?.start_time ?? null,
      end_time: booking?.end_time ?? null,
      organization: (booking?.organization ?? "Muzek") as Organization,
      event_type: (booking?.event_type ?? "other") as EventType,
      place: booking?.place ?? "",
    };
  });
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

export async function getAllBookingItemsWithDate(options?: {
  bookingStatus?: BookingStatus;
}): Promise<BookingItemWithDate[]> {
  let query = supabase
    .from("booking_items")
    .select("name, quantity, price, equipment_id, booking!inner(event_date, booking_status)");

  if (options?.bookingStatus) {
    query = query.eq("booking.booking_status", options.bookingStatus);
  }

  const { data, error } = await query;

  if (error) throw new Error("Error al cargar los artículos vendidos");
  return (data ?? []) as BookingItemWithDate[];
}
