import { AssignmentProps, AssignedProps } from "../types";
import { supabase } from "./supabase";

export async function getBookingPersonal(bookingId: number) {
  const { data, error } = await supabase
    .from("booking_personal")
    .select("*, personal(name, lastName, role)")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true });

  if (error) throw new Error("Hubo un error al cargar el personal asignado");
  return (data ?? []) as AssignedProps[];
}

export async function addAssignment(assignment: AssignmentProps) {
  const { data, error } = await supabase
    .from("booking_personal")
    .insert([{ ...assignment }])
    .select()
    .single();

  if (error) throw new Error("Hubo un error al asignar el empleado");
  return data;
}

export async function updateAssignment(
  assignment: Pick<AssignedProps, "id" | "days" | "rate" | "notes">
) {
  const { data, error } = await supabase
    .from("booking_personal")
    .update({ days: assignment.days, rate: assignment.rate, notes: assignment.notes })
    .eq("id", assignment.id)
    .select();

  if (error) throw new Error("Hubo un error al actualizar la asignación");
  return data;
}

export async function addAssignments(assignments: AssignmentProps[]) {
  const { error } = await supabase.from("booking_personal").insert(assignments);
  if (error) throw new Error("Hubo un error al asignar el personal");
}

export async function deleteAssignment(id: number) {
  const { error } = await supabase
    .from("booking_personal")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Hubo un error al eliminar la asignación");
}
