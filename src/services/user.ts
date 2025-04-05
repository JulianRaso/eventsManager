import { supabase } from "./supabase";

interface userProps {
  email: string;
  password: string;
}

async function signUp({ email, password }: userProps) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

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
    throw new Error("There was an error trying to Log In. Please try again!");
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

export async function getUserData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No user found");
  }

  console.log(user);

  return user;
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
