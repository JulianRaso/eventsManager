import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface StockProps {
  name: string;
  location: string;
  price: number;
  quantity: number;
  category: string;
  updated_by: string;
}

export async function getStock({ category }: { category: string }) {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("category", category);

  if (error) {
    throw new Error(`There was an error while loading ${category}`);
  }
  return data;
}

export async function updateStock() {
  const { data, error } = await supabase
    .from("inventory")
    .update({ other_column: "otherValue" })
    .eq("some_column", "someValue")
    .select();

  if (error) {
    throw new Error(`There was an error while updating the stock`);
  }

  return data;
}

export async function deleteStock(id: number) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);

  if (error) {
    throw new Error(`There was an error while deleting the stock`);
  }
}

export async function addStock(stockData: StockProps) {
  const { data, error } = await supabase
    .from("inventory")
    .insert([{ ...stockData }]);

  if (error) {
    toast.error("Error al agregar el stock");
  }

  return data;
}
