import { supabase } from "./supabase";

export interface SupplierProps {
  id?: number;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_id?: string;
  notes?: string;
  created_at?: string;
}

export async function getAllSuppliers(): Promise<SupplierProps[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");
  if (error) throw new Error("Error al cargar los proveedores");
  return (data ?? []) as SupplierProps[];
}

export async function createSupplier(supplier: Omit<SupplierProps, "id" | "created_at">) {
  const { error } = await supabase.from("suppliers").insert(supplier);
  if (error) throw new Error("Error al crear el proveedor");
}

export async function updateSupplier(supplier: SupplierProps) {
  const { error } = await supabase
    .from("suppliers")
    .update(supplier)
    .eq("id", supplier.id!);
  if (error) throw new Error("Error al actualizar el proveedor");
}

export async function deleteSupplier(id: number) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) throw new Error("Error al eliminar el proveedor");
}

export async function getSupplierById(id: number): Promise<SupplierProps | null> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as SupplierProps;
}
