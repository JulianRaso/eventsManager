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
    throw new Error("There was an error while creating client");
  }
  return data;
}

export async function checkClient(dni: string) {
  const { data: client, error } = await supabase
    .from("client")
    .select("*")
    .eq("dni", dni);

  if (error) {
    throw new Error("There was an error while fetching client");
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
    throw new Error("There was an error while updating client");
  }
  return data;
}
