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

export async function getMostUsedCategories(year = new Date().getFullYear()) {
  const { data, error } = await supabase
    .from("booking_items")
    .select(
      "quantity, booking!inner(event_date, booking_status), inventory!inner(category)"
    );

  if (error) throw new Error("Error al cargar categorías más solicitadas.");

  const acc = new Map<string, number>();
  (data ?? []).forEach((row) => {
    const booking = (row as unknown as { booking?: { event_date: string; booking_status: string } | null })
      .booking;
    if (!booking) return;
    if (booking.booking_status === "cancel") return;

    const d = new Date(booking.event_date);
    if (Number.isNaN(d.getTime())) return;
    if (d.getFullYear() !== year) return;

    const category =
      (row as unknown as { inventory?: { category?: string } | null }).inventory
        ?.category ?? "others";
    const qty = (row as unknown as { quantity?: number }).quantity ?? 0;
    acc.set(category, (acc.get(category) ?? 0) + qty);
  });

  return Array.from(acc.entries())
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
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
