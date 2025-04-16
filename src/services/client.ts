import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface clientProps {
  dni: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

export async function createClient(client: clientProps) {
  const { data, error } = await supabase.from("client").insert([client]);

  if (error) {
    toast.error("Hubo un error al crear el cliente");
  }
  return data;
}

export async function checkClient(dni: string) {
  const { data: client, error } = await supabase
    .from("client")
    .select("*")
    .eq("dni", dni);

  if (error) {
    toast.error("Hubo un error al buscar el cliente");
  }

  if (client.length === 0) {
    return {
      dni: "",
      name: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    };
  }

  return client[0];
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
