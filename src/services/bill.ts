import { supabase } from "./supabase";

type billType = {
  id?: number;
  name: string;
  quantity: number;
  paid_with: "cash" | "card" | "transfer" | "bank check";
  paid_by: string;
  amount: number;
  booking_id?: number;
  created_at?: string;
  paid_to?: string;
  updated_by: string;
  cbu?: number;
};

export async function getInvoices(id?: number) {
  if (id !== undefined) {
    const { data, error } = await supabase
      .from("bill")
      .select("*")
      .eq("id", id);

    if (error) {
      throw new Error(`Error fetching invoices: ${error.message}`);
    }

    return data;
  }
  const { data, error } = await supabase.from("bill").select("*");
  if (error) {
    throw new Error(`Error fetching invoices: ${error.message}`);
  }
  return data;
}

export async function addInvoice(invoice: billType) {
  const { data, error } = await supabase.from("bill").insert([{ ...invoice }]);

  if (error) {
    throw new Error(`Error adding invoice: ${error.message}`);
  }

  return data;
}

export async function deleteInvoice(id: number) {
  const { error } = await supabase.from("bill").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting invoice: ${error.message}`);
  }
}

export async function updateInvoice(invoice: billType) {
  if (invoice.id === undefined) {
    throw new Error("El ID de la factura es requerido para actualizar");
  }
  const { data, error } = await supabase
    .from("bill")
    .update({
      ...invoice,
      amount: invoice.amount !== undefined ? invoice.amount : undefined,
    })
    .eq("id", invoice.id);

  if (error) {
    throw new Error(`Error al actualizar la factura: ${error.message}`);
  }
  return data;
}
