import { supabase } from "./supabase";

export interface AccountingAccount {
  id: number;
  code: string;
  name: string;
  created_at?: string;
}

export type NewAccount = Omit<AccountingAccount, "id" | "created_at">;

export async function getAllAccounts(): Promise<AccountingAccount[]> {
  const { data, error } = await supabase
    .from("accounting_accounts")
    .select("*")
    .order("code");
  if (error) throw new Error("Error al cargar las cuentas contables");
  return (data ?? []) as AccountingAccount[];
}

export async function createAccount(account: NewAccount) {
  const { error } = await supabase.from("accounting_accounts").insert(account);
  if (error) throw new Error("Error al crear la cuenta contable");
}

export async function updateAccount(account: AccountingAccount) {
  const { error } = await supabase
    .from("accounting_accounts")
    .update({ code: account.code, name: account.name })
    .eq("id", account.id);
  if (error) throw new Error("Error al actualizar la cuenta contable");
}

export async function deleteAccount(id: number) {
  const { error } = await supabase
    .from("accounting_accounts")
    .delete()
    .eq("id", id);
  if (error) throw new Error("Error al eliminar la cuenta contable");
}
