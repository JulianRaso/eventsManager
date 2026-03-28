import { supabase } from "./supabase";

// ── Types ──────────────────────────────────────────────────────────────────

export interface PurchaseProps {
  id?: number;
  supplier_id: number | null;
  purchase_date: string;
  description?: string;
  total_price: number;
  payment_status: "pending" | "partially_paid" | "paid";
  notes?: string;
  created_at?: string;
  suppliers?: { name: string } | null;
  purchase_payments?: { amount: number }[];
}

export interface PurchaseItemProps {
  id?: number;
  purchase_id: number;
  equipment_id: number | null;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface PurchasePaymentProps {
  id: number;
  purchase_id: number;
  amount: number;
  payment_method: "cash" | "transfer" | "card" | "bank_check";
  payment_date: string;
  notes?: string;
  created_at: string;
}

export type NewPurchasePayment = Omit<PurchasePaymentProps, "id" | "created_at">;

// ── Purchases ──────────────────────────────────────────────────────────────

export async function getAllPurchases(): Promise<PurchaseProps[]> {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, suppliers(name), purchase_payments(amount)")
    .order("purchase_date", { ascending: false });
  if (error) throw new Error("Error al cargar los comprobantes");
  return (data ?? []) as PurchaseProps[];
}

export async function getPurchaseById(id: number): Promise<PurchaseProps | null> {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, suppliers(name)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as PurchaseProps;
}

export async function createPurchase(purchase: Omit<PurchaseProps, "id" | "created_at" | "supplier" | "purchase_payments">) {
  const { data, error } = await supabase
    .from("purchases")
    .insert(purchase)
    .select()
    .single();
  if (error) throw new Error("Error al crear el comprobante");
  return data as PurchaseProps;
}

export async function updatePurchase(purchase: Partial<PurchaseProps> & { id: number }) {
  const { error } = await supabase
    .from("purchases")
    .update(purchase)
    .eq("id", purchase.id);
  if (error) throw new Error("Error al actualizar el comprobante");
}

export async function deletePurchase(id: number) {
  const { error } = await supabase.from("purchases").delete().eq("id", id);
  if (error) throw new Error("Error al eliminar el comprobante");
}

// ── Purchase Items ─────────────────────────────────────────────────────────

export async function getPurchaseItems(purchaseId: number): Promise<PurchaseItemProps[]> {
  const { data, error } = await supabase
    .from("purchase_items")
    .select("*")
    .eq("purchase_id", purchaseId);
  if (error) throw new Error("Error al cargar los artículos");
  return (data ?? []) as PurchaseItemProps[];
}

export async function addPurchaseItem(item: Omit<PurchaseItemProps, "id">) {
  const { error } = await supabase.from("purchase_items").insert(item);
  if (error) throw new Error("Error al agregar el artículo");
}

export async function deletePurchaseItem(id: number) {
  const { error } = await supabase.from("purchase_items").delete().eq("id", id);
  if (error) throw new Error("Error al eliminar el artículo");
}

// ── Purchase Payments ──────────────────────────────────────────────────────

async function syncPurchasePaymentStatus(purchaseId: number) {
  const [{ data: payments }, { data: purchase }] = await Promise.all([
    supabase.from("purchase_payments").select("amount").eq("purchase_id", purchaseId),
    supabase.from("purchases").select("total_price").eq("id", purchaseId).single(),
  ]);

  const collected = (payments ?? []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
  const total = (purchase as { total_price: number } | null)?.total_price ?? 0;

  let payment_status: string;
  if (collected <= 0) payment_status = "pending";
  else if (collected < total) payment_status = "partially_paid";
  else payment_status = "paid";

  await supabase.from("purchases").update({ payment_status: payment_status as "pending" | "partially_paid" | "paid" }).eq("id", purchaseId);
}

export async function getPurchasePayments(purchaseId: number): Promise<PurchasePaymentProps[]> {
  const { data, error } = await supabase
    .from("purchase_payments")
    .select("*")
    .eq("purchase_id", purchaseId)
    .order("payment_date", { ascending: true });
  if (error) throw new Error("Error al cargar los pagos");
  return (data ?? []) as PurchasePaymentProps[];
}

export async function addPurchasePayment(payment: NewPurchasePayment) {
  const { error } = await supabase.from("purchase_payments").insert(payment);
  if (error) throw new Error("Error al registrar el pago");
  await syncPurchasePaymentStatus(payment.purchase_id);
}

export async function deletePurchasePayment(id: number, purchaseId: number) {
  const { error } = await supabase.from("purchase_payments").delete().eq("id", id);
  if (error) throw new Error("Error al eliminar el pago");
  await syncPurchasePaymentStatus(purchaseId);
}

// ── For Asiento Teórico ────────────────────────────────────────────────────

export interface PurchaseItemWithDate {
  name: string;
  quantity: number;
  unit_price: number;
  equipment_id: number | null;
  purchases: { purchase_date: string; payment_status: string } | null;
}

export async function getAllPurchaseItemsWithDate(): Promise<PurchaseItemWithDate[]> {
  const { data, error } = await supabase
    .from("purchase_items")
    .select("name, quantity, unit_price, equipment_id, purchases!inner(purchase_date, payment_status)");
  if (error) throw new Error("Error al cargar los artículos de compra");
  return (data ?? []) as PurchaseItemWithDate[];
}
