import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface clientProps {
  dni: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

export async function createClient(client: clientProps) {
  const { data, error } = await supabase.from("client").insert(client);

  if (error) {
    toast.error("Hubo un error al crear el cliente");
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

export async function updateClient(client: clientProps) {
  const { data, error } = await supabase
    .from("client")
    .update(client)
    .eq("dni", client.dni);

  if (error) {
    toast.error("Hubo un error al actualizar el cliente");
  }
  return data;
}
