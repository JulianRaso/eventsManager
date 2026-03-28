import { PersonalProps, PersonaledProps } from "../types";
import { supabase } from "./supabase";

export async function getPersonal() {
  const { data, error } = await supabase
    .from("personal")
    .select("*")
    .order("lastName", { ascending: true });

  if (error) throw new Error("Hubo un error al cargar el personal");
  return data;
}

export async function getPersonalById(id: number) {
  const { data, error } = await supabase
    .from("personal")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Hubo un error al cargar el empleado");
  return data;
}

export async function addPersonal(personal: PersonalProps) {
  const { data, error } = await supabase
    .from("personal")
    .insert([{ ...personal }])
    .select()
    .single();

  if (error) throw new Error("Hubo un error al agregar el empleado");
  return data;
}

export async function updatePersonal(personal: PersonaledProps) {
  const { data, error } = await supabase
    .from("personal")
    .update({ ...personal })
    .eq("id", personal.id)
    .select();

  if (error) throw new Error("Hubo un error al actualizar el empleado");
  return data;
}

export async function deletePersonal(id: number) {
  const { error } = await supabase.from("personal").delete().eq("id", id);

  if (error) throw new Error("Hubo un error al eliminar el empleado");
}
