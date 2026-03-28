import { supabase } from "./supabase";

export interface ItemAccountingProps {
  equipment_id: number;
  purchase_account_id: number | null;
  sale_account_id: number | null;
}

export interface AccountRef {
  id: number;
  code: string;
  name: string;
}

export interface InventoryWithAccounting {
  id: number;
  name: string;
  category: string;
  item_accounting: {
    purchase_account_id: number | null;
    sale_account_id: number | null;
    purchase_account: AccountRef | null;
    sale_account: AccountRef | null;
  } | null;
}

export async function getInventoryWithAccounting(): Promise<InventoryWithAccounting[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select(`
      id, name, category,
      item_accounting(
        purchase_account_id,
        sale_account_id,
        purchase_account:accounting_accounts!item_accounting_purchase_account_id_fkey(id, code, name),
        sale_account:accounting_accounts!item_accounting_sale_account_id_fkey(id, code, name)
      )
    `)
    .order("name");

  if (error) throw new Error("Error al cargar la parametrización contable");
  return (data ?? []) as InventoryWithAccounting[];
}

export async function upsertItemAccounting(payload: ItemAccountingProps) {
  const { error } = await supabase
    .from("item_accounting")
    .upsert(payload, { onConflict: "equipment_id" });

  if (error) throw new Error("Error al guardar la parametrización contable");
}
