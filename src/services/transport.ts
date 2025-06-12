import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface vehicleProps {
  id?: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  status: "available" | "inUse" | "maintenance";
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

export async function deleteTransport(id: number) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);

  if (error) {
    toast.error("Error al eliminar el vehiculo");
  }
}

export async function addVehicle(vehicle: vehicleProps) {
  const { data, error } = await supabase.from("vehicles").insert([vehicle]);

  if (error) {
    toast.error("Error al actualizar el vehiculo");
  }

  return data;
}

export async function getCurrentTransport(id: number) {
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id);

  if (error) {
    toast.error("Error al obtener los datos del vehiculo");
  }
  return vehicles;
}

export async function updateTransport(vehicle: vehicleProps) {
  if (vehicle.id === undefined) {
    throw new Error("El ID del vehículo es requerido para actualizar");
  }
  const { data, error } = await supabase
    .from("vehicles")
    .update({ ...vehicle })
    .eq("id", vehicle.id)
    .select();

  if (error) {
    toast.error("Hubo un error al actualizar el vehiculo");
  }
  return data;
}
