import { supabase } from "./supabase";

export async function getMonthlySales(month: string) {
  const date = new Date(month);
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  const { data: booking, error } = await supabase
    .from("booking")
    .select("event_date, organization, booking_status")
    .gte("event_date", startDate.toISOString())
    .lt("event_date", endDate.toISOString());

  if (error) {
    throw new Error("Error fetching monthly sales data.");
  }

  return booking;
}
