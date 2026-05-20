import { supabase } from "./supabase";

export interface PersonalRoleRow {
  id: string;
  code: string;
  label: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

function personalRolesTable() {
  // `Database` types may be out of sync with remote schema.
  // We keep this service resilient by opting out of strict table-name typing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from("personal_roles") as any;
}

export async function getPersonalRoles(params?: {
  includeInactive?: boolean;
}): Promise<PersonalRoleRow[]> {
  const includeInactive = params?.includeInactive ?? false;

  let query = personalRolesTable()
    .select("*")
    .order("active", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (!includeInactive) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) throw new Error("Hubo un error al cargar los roles del personal");
  return (data ?? []) as unknown as PersonalRoleRow[];
}

export async function addPersonalRole(input: {
  code: string;
  label: string;
  sort_order?: number;
}): Promise<PersonalRoleRow> {
  const payload = {
    code: input.code.trim(),
    label: input.label.trim(),
    sort_order: input.sort_order ?? 0,
  };

  const { data, error } = await personalRolesTable()
    .insert([payload])
    .select("*")
    .single();

  if (error) throw new Error("Hubo un error al crear el rol");
  return data as unknown as PersonalRoleRow;
}

export async function updatePersonalRole(
  id: string,
  patch: Partial<Pick<PersonalRoleRow, "code" | "label" | "active" | "sort_order">>
): Promise<PersonalRoleRow> {
  const { data, error } = await personalRolesTable()
    .update({
      ...(patch.code !== undefined ? { code: patch.code.trim() } : {}),
      ...(patch.label !== undefined ? { label: patch.label.trim() } : {}),
      ...(patch.active !== undefined ? { active: patch.active } : {}),
      ...(patch.sort_order !== undefined ? { sort_order: patch.sort_order } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error("Hubo un error al actualizar el rol");
  return data as unknown as PersonalRoleRow;
}

export async function deactivatePersonalRole(id: string) {
  const { error } = await personalRolesTable().update({ active: false }).eq("id", id);

  if (error) throw new Error("Hubo un error al desactivar el rol");
}

export async function activatePersonalRole(id: string) {
  const { error } = await personalRolesTable().update({ active: true }).eq("id", id);

  if (error) throw new Error("Hubo un error al activar el rol");
}

