import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface StockProps {
  name: string;
  location: string;
  price: number;
  quantity: number;
  category:
    | "lights"
    | "ambientation"
    | "sound"
    | "structure"
    | "tools"
    | "cables"
    | "others"
    | "furniture"
    | "screen";
  updated_by: string;
}

interface StockedProps {
  id: number;
  name: string;
  location: string;
  price: number;
  quantity: number;
  category:
    | "lights"
    | "ambientation"
    | "sound"
    | "structure"
    | "tools"
    | "cables"
    | "others"
    | "furniture"
    | "screen";
  updated_by: string;
}

type CategoryType =
  | "lights"
  | "ambientation"
  | "sound"
  | "structure"
  | "tools"
  | "cables"
  | "others"
  | "furniture"
  | "screen";

export async function getStock(category?: CategoryType) {
  if (category) {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("category", category);

    if (error) {
      throw new Error(`There was an error while loading ${category}`);
    }
    return data;
  }

  const { data, error } = await supabase.from("inventory").select("*");

  if (error) {
    throw new Error(`There was an error while loading equipment`);
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
    toast.error("Hubo un error al actualizar el stock");
  }
  return data;
}

export async function deleteStock(id: number) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    toast.error("Hubo un error al eliminar el stock");
  }
}

export async function addStock(stockData: StockProps) {
  const { data, error } = await supabase
    .from("inventory")
    .insert([{ ...stockData }]);

  if (error) {
    toast.error("Error al intentar agregar el stock");
  }

  return data;
}

export async function getCurrentStock(id: number) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id);

  if (error) {
    toast.error("Hubo un error al cargar el inventario seleccionado");
  }

  return data;
}
