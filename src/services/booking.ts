import { AssignmentProps, BookedProps, BookingProps, ClientProps, EquipmentItemProps } from "../types";
import { addItems } from "./bookingItems";
import { addAssignments } from "./bookingPersonal";
import { getClientById } from "./client";
import { supabase } from "./supabase";

//Get data from database
export async function getBookings() {
  const { data, error } = await supabase.from("booking").select(`
        *, 
        client(name, lastName, phoneNumber, COD_CLIENTE, dni)
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
  equipment?: Omit<EquipmentItemProps, "booking_id">[],
  personnel?: Omit<AssignmentProps, "booking_id">[]
) {
  if (!client.ID_CLIENTE) {
    throw new Error("Seleccioná un cliente válido");
  }

  const confirmClientResponse = await getClientById(client.ID_CLIENTE);
  const confirmClient = confirmClientResponse.data;
  if (!confirmClient) {
    throw new Error("El cliente no existe");
  }
  if (!confirmClient.Habilitado) {
    throw new Error("El cliente está deshabilitado y no puede usarse en reservas");
  }

  const newBooking = await addBooking({
    ...booking,
    client_id: client.ID_CLIENTE,
  });

  if (equipment && equipment.length > 0 && newBooking?.id) {
    const equipmentWithBookingId = equipment.map((item) => ({
      ...item,
      booking_id: newBooking.id,
    }));
    await addItems(equipmentWithBookingId);
  }

  if (personnel && personnel.length > 0 && newBooking?.id) {
    const personnelWithBookingId = personnel.map((p) => ({
      ...p,
      booking_id: newBooking.id,
    }));
    await addAssignments(personnelWithBookingId);
  }

  return newBooking;
}

export async function updateBooking(booking: BookedProps) {
  // payment_status lo sincronizan los cobros; no pisarlo desde el form de reserva
  const { id, payment_status: _paymentStatus, ...fields } = booking;
  const { data, error } = await supabase
    .from("booking")
    .update(fields)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(
      "Hubo un error al actualizar la reserva, por favor intente nuevamente"
    );
  }
  return data;
}

export async function patchBooking(
  id: number,
  fields: Partial<BookedProps>
) {
  const { data, error } = await supabase
    .from("booking")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error)
    throw new Error("Hubo un error al actualizar la reserva");
  return data;
}

export async function getBookingEvent(id: number) {
  const { data, error } = await supabase
    .from("booking")
    .select(`*, client(name, lastName, phoneNumber, email, COD_CLIENTE, dni)`)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      "Hubo un error al cargar el evento, por favor intente nuevamente"
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
