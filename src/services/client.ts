import { ClientProps } from "../types";
import { supabase } from "./supabase";

export async function getAllClients() {
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .order("lastName", { ascending: true });
  if (error) throw new Error("Error al cargar los clientes");
  return (data ?? []) as ClientProps[];
}

export async function createClient(client: ClientProps) {
  const { data, error } = await supabase.from("client").insert(client);

  if (error) {
    throw new Error("Hubo un error al crear el cliente");
  }
  return data;
}

export async function deleteClient(dni: number) {
  const { error } = await supabase.from("client").delete().eq("dni", dni);
  if (error) throw new Error("Hubo un error al eliminar el cliente");
}

export interface BookingBalanceRow {
  id: number;
  price: number;
  tax: number;
  event_date: string;
  organization: string;
  booking_status: string;
  client_dni: number;
  client: { name: string; lastName: string } | null;
  booking_payments: { amount: number }[];
}

export async function getBookingsWithPayments(): Promise<BookingBalanceRow[]> {
  const { data, error } = await supabase
    .from("booking")
    .select("id, price, tax, event_date, organization, booking_status, client_dni, client(name, lastName), booking_payments(amount)")
    .neq("booking_status", "cancel")
    .order("event_date", { ascending: false });

  if (error) throw new Error("Error al cargar los saldos");
  return (data ?? []) as BookingBalanceRow[];
}

export async function checkClient(dni: number) {
  return supabase
    .from("client")
    .select("*")
    .eq("dni", dni)
    .maybeSingle()
    .throwOnError();
}

export async function updateClient(client: ClientProps) {
  const { data, error } = await supabase
    .from("client")
    .update(client)
    .eq("dni", client.dni);

  if (error) {
    throw new Error("Hubo un error al actualizar el cliente");
  }
  return data;
}
