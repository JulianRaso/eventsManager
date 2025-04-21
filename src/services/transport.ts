import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface vehicleProps {
  brand: string;
  model: string;
  year: number;
  type: string;
  status: string;
  last_service: string;
  notes?: string;
  license_plate: string;
  updated_by: string;
}

export async function getTransport() {
  const { data: vehicles, error } = await supabase.from("vehicles").select("*");

  if (error) {
    toast.error("Error al obtener los datos de los vehiculos");
  }
  return vehicles;
}

export async function deleteTransport(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) {
    toast.error("Error al eliminar el vehiculo");
  }
}

export async function addVehicle(vehicle: vehicleProps) {
  console.log(vehicle);

  const { data, error } = await supabase.from("vehicles").insert([vehicle]);

  if (error) {
    toast.error("Error al actualizar el vehiculo");
  }

  return data;
}
