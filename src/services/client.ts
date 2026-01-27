import { ClientProps } from "../types";
import { supabase } from "./supabase";

export async function createClient(client: ClientProps) {
  const { data, error } = await supabase.from("client").insert(client);

  if (error) {
    throw new Error("Hubo un error al crear el cliente");
  }
  return data;
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
