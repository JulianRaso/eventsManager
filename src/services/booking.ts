import { BookedProps, BookingProps, ClientProps, EquipmentItemProps } from "../types";
import { addItems } from "./bookingItems";
import { checkClient, createClient } from "./client";
import { supabase } from "./supabase";

//Get data from database
export async function getBookings() {
  const { data, error } = await supabase.from("booking").select(`
        *, 
        client(name, lastName, phoneNumber)
      `);

  if (error) {
    throw new Error(
      "Hubo un error al cargar las reservas, por favor intente nuevamente"
    );
  }

  return data;
}

//Insert data to Database

export async function addBooking(booking: BookingProps) {
  const { data: bookingData, error: bookingError } = await supabase
    .from("booking")
    .insert([
      {
        ...booking,
      },
    ])
    .select()
    .single();

  if (bookingError) {
    throw new Error(
      "Hubo un error al crear la reserva, por favor intente nuevamente"
    );
  }
  return bookingData;
}

export async function deleteBooking(id: number) {
  const { error } = await supabase.from("booking").delete().eq("id", id);

  if (error) {
    throw new Error(
      "Hubo un error al eliminar la reserva, por favor intente nuevamente"
    );
  }
}

//Create reservation with equipment
export async function createBooking(
  client: ClientProps,
  booking: BookingProps,
  equipment?: Omit<EquipmentItemProps, "booking_id">[]
) {
  // 1. Verificar/crear cliente
  const confirmClientResponse = await checkClient(client.dni);
  const confirmClient = confirmClientResponse.data;
  if (
    !confirmClient ||
    (Array.isArray(confirmClient) && confirmClient.length === 0)
  ) {
    await createClient(client);
  }

  // 2. Crear la reserva y obtener el ID
  const newBooking = await addBooking(booking);

  // 3. Si hay equipos, asignarles el booking_id correcto y guardarlos
  if (equipment && equipment.length > 0 && newBooking?.id) {
    const equipmentWithBookingId = equipment.map((item) => ({
      ...item,
      booking_id: newBooking.id,
    }));
    await addItems(equipmentWithBookingId);
  }

  return newBooking;
}

export async function updateBooking(booking: BookedProps) {
  const { data, error } = await supabase
    .from("booking")
    .update({ ...booking })
    .eq("id", booking.id)
    .select();

  if (error) {
    throw new Error(
      "Hubo un error al actualizar la reserva, por favor intente nuevamente"
    );
  }
  return data;
}

export async function getCurrentBooking(bookingId: number) {
  const { data: booking, error } = await supabase
    .from("booking")
    .select("*")
    .eq("id", bookingId);

  if (error) {
    throw new Error(
      "Hubo un error al cargar la reserva, por favor intente nuevamente"
    );
  }

  return booking;
}
