import { supabase } from "./supabase";

export async function getMonthlySales() {
  const { data, error } = await supabase.rpc("monthly_sales");
  if (error) throw new Error("Error fetching monthly sales data.");
  return data;
}

export async function getMonthlyEvents() {
  const { data, error } = await supabase.rpc("monthly_events");
  if (error) throw new Error("Error fetching monthly events data.");
  return data;
}

export async function getMostEquipmentUsed() {
  const { data, error } = await supabase.rpc("most_used_items");

  if (error) {
    throw new Error("Error fetching most used equipment data.");
  }
  return data;
}

export async function getYearlySales(year: number) {
  const { data, error } = await supabase.rpc("monthly_events_by_company", {
    year_input: year,
  });
  if (error) throw new Error("Error fetching yearly sales data.");

  return data;
}

export async function getEventsPerCompany() {
  const { data, error } = await supabase.rpc("events_per_month_per_company");
  if (error) throw new Error("Error fetching events by company data.");
  return data;
}

export async function getIncomePerMonth() {
  const { data, error } = await supabase.rpc("incomes_per_month");
  if (error) throw new Error("Error fetching income per month data.");
  return data;
}
