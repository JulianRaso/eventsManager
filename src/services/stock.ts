import { CategoryType, StockedProps, StockProps } from "../types";
import { supabase } from "./supabase";

export async function getStock(category?: CategoryType) {
  if (category) {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("category", category);

    if (error) {
      throw new Error(`Hubo un error al cargar ${category}`);
    }
    return data;
  }

  const { data, error } = await supabase.from("inventory").select("*");

  if (error) {
    throw new Error("Hubo un error al cargar el equipamiento");
  }
  return data;
}

export async function updateStock(stock: StockedProps) {
  const { data, error } = await supabase
    .from("inventory")
    .update({ ...stock })
    .eq("id", stock.id)
    .select();

  if (error) {
    throw new Error("Hubo un error al actualizar el stock");
  }
  return data;
}

export async function deleteStock(id: number) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    throw new Error("Hubo un error al eliminar el stock");
  }
}

export async function addStock(stockData: StockProps) {
  const { data, error } = await supabase
    .from("inventory")
    .insert([{ ...stockData }]);

  if (error) {
    throw new Error("Error al intentar agregar el stock");
  }

  return data;
}

export async function getCurrentStock(id: number) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id);

  if (error) {
    throw new Error("Hubo un error al cargar el inventario seleccionado");
  }

  return data;
}
