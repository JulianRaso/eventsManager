import { supabase } from "./supabase";

interface userProps {
  fullName?: string;
  email: string;
  password: string;
  avatar?: string;
}

async function signUp(user: userProps) {
  const { data, error } = await supabase.auth.signUp(user);

  if (error) {
    throw new Error("There was an error trying to Sign Up. Please try again!");
  }

  return data;
}

async function logIn({ email, password }: userProps) {
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
  fullName: string;
  password?: string;
  avatar?: string;
}) {
  let updateData = {};
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) {
    throw new Error(
      "There was an error trying to Update the account. Please try again!"
    );
  }

  if (!avatar) return data;

  const fileName = `avatar=${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) {
    throw new Error(
      "There was an error trying to upload the avatar. Please try again!"
    );
  }

  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: ``,
    },
  });

  if (error2) {
    throw new Error(
      "There was an error trying to Update the account. Please try again!"
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
