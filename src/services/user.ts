import toast from "react-hot-toast";
import { supabase } from "./supabase";

interface userProps {
  email: string;
  password: string;
}

async function signUp(user: userProps) {
  console.log(user);

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
    throw new Error(error.message);
  }

  return data;
}

async function logOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("There was an error trying to Log Out. Please try again!");
  }

  return "sucess";
}

async function updateUser({ email, password }: userProps) {
  const { data, error } = await supabase.auth.updateUser({
    email,
    password,
  });

  if (error) {
    throw new Error(
      "There was an error trying to Update the account. Please try again!"
    );
  }

  return data;
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
      "There was an error trying to invite the user. Please try again!"
    );
  }

  return data;
}

export { signUp, logIn, logOut, updateUser, inviteUser };
