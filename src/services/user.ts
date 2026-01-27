import { UserProps } from "../types";
import { supabase, supabaseUrl } from "./supabase";

async function signUp(user: UserProps) {
  const { data, error } = await supabase.auth.signUp(user);

  if (error) {
    throw new Error("There was an error trying to Sign Up. Please try again!");
  }

  return data;
}

async function logIn({ email, password }: UserProps) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(
      "El mail o la contraseña ingresada son incorrectas. Intentelo de nuevo"
    );
  }

  return data;
}

async function logOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Hubo un error al cerrar sesion. Intente de nuevo!");
  }

  return "sucess";
}

async function updateCurrentUser({
  fullName,
  password,
  avatar,
}: {
  fullName?: string;
  password?: string;
  avatar?: File | null;
}) {
  let updateData = {};
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) {
    throw new Error(
      "Hubo un error al intentar actualizar la cuenta. Intente de nuevo!"
    );
  }

  if (!avatar) return data;

  const fileName = `avatar=${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) {
    throw new Error(
      "Hubo un error al intentar subir el avatar. Intente de nuevo!"
    );
  }

  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) {
    throw new Error(
      "Hubo un error al intentar actualizar la cuenta. Intente de nuevo!"
    );
  }
  return updatedUser;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

async function inviteUser(email: string) {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    throw new Error(
      "Hubo un error al intentar invitar al usuario. Intentelo de nuevo!"
    );
  }

  return data;
}

export { inviteUser, logIn, logOut, signUp, updateCurrentUser };
