import { CategoryType, InventoriedProps, InventoryProps } from "../types";
import { supabase } from "./supabase";

export async function getInventory(category?: CategoryType) {
  if (category) {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("category", category);

    if (error) throw new Error(`Hubo un error al cargar ${category}`);
    return data;
  }

  const { data, error } = await supabase.from("inventory").select("*");
  if (error) throw new Error("Hubo un error al cargar el inventario");
  return data;
}

export async function updateInventory(item: InventoriedProps) {
  const { data, error } = await supabase
    .from("inventory")
    .update({ ...item })
    .eq("id", item.id)
    .select();

  if (error) throw new Error("Hubo un error al actualizar el inventario");
  return data;
}

export async function deleteInventory(id: number) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);
  if (error) throw new Error("Hubo un error al eliminar el ítem");
}

export async function addInventory(item: InventoryProps) {
  const { data, error } = await supabase
    .from("inventory")
    .insert([{ ...item }]);

  if (error) throw new Error("Error al intentar agregar el ítem");
  return data;
}

export async function getCurrentInventory(id: number) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id);

  if (error) throw new Error("Hubo un error al cargar el ítem seleccionado");
  return data;
}
