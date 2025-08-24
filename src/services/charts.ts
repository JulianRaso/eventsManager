import { supabase } from "./supabase";

export async function getMonthlySales() {
  // @ts-expect-error: "monthly_sales" is a valid RPC function in the database
  const { data, error } = await supabase.rpc("monthly_sales");
  if (error) throw new Error("Error fetching monthly sales data.");
  return data;
}

export async function getMonthlyEvents() {
  // @ts-expect-error: "monthly_events" is a valid RPC function in the database
  const { data, error } = await supabase.rpc("monthly_events");
  if (error) throw new Error("Error fetching monthly events data.");
  return data;
}

export async function getMostEquipmentUsed() {
  // @ts-expect-error: "most_used_items" is a valid RPC function in the database
  const { data, error } = await supabase.rpc("most_used_items");

  if (error) {
    throw new Error("Error fetching most used equipment data.");
  }
  return data;
}

export async function getYearlySales(year: string) {
  // @ts-expect-error: "yearly_sales" is a valid RPC function in the database
  const { data, error } = await supabase.rpc("monthly_events_by_company", {
    year_input: year,
  });
  if (error) throw new Error("Error fetching yearly sales data.");

  console.log(data);

  return data;
}
getYearlySales("2025");
