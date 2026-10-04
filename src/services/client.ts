import { ClientProps, NewClientProps } from "../types";
import { supabase } from "./supabase";

function mapClientError(error: { code?: string; message?: string }, action: string) {
  if (error.code === "23505") {
    if (error.message?.includes("dni")) {
      throw new Error("El DNI ya existe");
    }
    throw new Error("El código de cliente ya existe");
  }
  throw new Error(error.message || `Hubo un error al ${action} el cliente`);
}

function toClientPayload(client: NewClientProps | ClientProps) {
  const { ID_CLIENTE: _id, ...rest } = client;
  return {
    ...rest,
    dni: rest.dni == null || Number.isNaN(Number(rest.dni)) ? null : Number(rest.dni),
    email: rest.email?.trim() ? rest.email.trim() : null,
    COD_CLIENTE: rest.COD_CLIENTE.trim().toUpperCase(),
  };
}

export async function getAllClients() {
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .order("lastName", { ascending: true });
  if (error) throw new Error("Error al cargar los clientes");
  return (data ?? []) as ClientProps[];
}

export async function createClient(client: NewClientProps) {
  const payload = toClientPayload(client);
  const { data, error } = await supabase
    .from("client")
    .insert(payload)
    .select("*")
    .single();

  if (error) mapClientError(error, "crear");
  return data as ClientProps;
}

export async function deleteClient(id: number) {
  const { error } = await supabase.from("client").delete().eq("ID_CLIENTE", id);
  if (error) throw new Error("Hubo un error al eliminar el cliente");
}

export interface BookingBalanceRow {
  id: number;
  price: number;
  tax: number;
  event_date: string;
  organization: string;
  booking_status: string;
  client_id: number;
  client: { name: string; lastName: string; COD_CLIENTE: string | null; dni: number | null } | null;
  booking_payments: { amount: number }[];
}

export async function getBookingsWithPayments(): Promise<BookingBalanceRow[]> {
  const { data, error } = await supabase
    .from("booking")
    .select(
      "id, price, tax, event_date, organization, booking_status, client_id, client(name, lastName, COD_CLIENTE, dni), booking_payments(amount)"
    )
    .neq("booking_status", "cancel")
    .order("event_date", { ascending: false });

  if (error) throw new Error("Error al cargar los saldos");
  return (data ?? []) as BookingBalanceRow[];
}

export async function getClientById(id: number) {
  return supabase
    .from("client")
    .select("*")
    .eq("ID_CLIENTE", id)
    .maybeSingle()
    .throwOnError();
}

/** @deprecated usar getClientById */
export async function checkClient(id: number) {
  return getClientById(id);
}

export async function isClientCodeTaken(code: string, excludeId?: number) {
  let query = supabase
    .from("client")
    .select("ID_CLIENTE")
    .eq("COD_CLIENTE", code)
    .limit(1);

  if (excludeId != null) {
    query = query.neq("ID_CLIENTE", excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error("Error al validar el código de cliente");
  return Boolean(data);
}

export async function updateClient(client: ClientProps) {
  if (!client.ID_CLIENTE) throw new Error("Cliente inválido");
  const payload = toClientPayload(client);
  const { data, error } = await supabase
    .from("client")
    .update(payload)
    .eq("ID_CLIENTE", client.ID_CLIENTE);

  if (error) mapClientError(error, "actualizar");
  return data;
}
