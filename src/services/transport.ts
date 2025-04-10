import toast from "react-hot-toast";
import { supabase } from "./supabase";

export async function getTransport() {
  const { data: vehicles, error } = await supabase.from("vehicles").select("*");

  if (error) {
    toast.error("Error al obtener los datos de transporte");
  }
  return vehicles;
}

export async function deleteTransport(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) {
    toast.error("Error al eliminar el transporte");
  }
}
