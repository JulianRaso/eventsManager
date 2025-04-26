import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { useUser } from "../hooks/useUser";
import useUpdateUser from "../hooks/useUpdateUser";

function validatePassword(pass: string, toCheck: string) {
  if (pass && toCheck) {
    if (pass === toCheck) return true;
    return false;
  }
}

export default function Profile() {
  const { user, isLoading } = useUser();
  let email = "";
  const { register, reset, handleSubmit, setValue } = useForm();
  const { isUpdating, updateUser } = useUpdateUser();
  const profileImage = null;

  if (user) {
    if (user.user_metadata.fullName) {
      setValue("fullName", user.user_metadata?.fullName);
    }
    email = user.email || "";
  }

  if (isLoading) return <Spinner />;

  function onSubmitProfile(data) {
    const { fullName, password } = data || [];

    if (fullName) updateUser({ fullName });
    reset();
  }

  function handleCancel() {
    reset();
  }

  return (
    <div className="flex items-center justify-center h-dvh sm:text-xl bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmitProfile)}
        className="border-2 rounded-3xl bg-white shadow-lg flex flex-col items-center justify-center p-6 "
      >
        <div className="text-6xl">
          {profileImage === null ? (
            <CiUser className="text-gray-500" />
          ) : (
            // <img src={profileImage} alt="profile picture" className="rounded-full w-24 h-24 object-cover" />
            ""
          )}
        </div>

        {/* Profile Information */}
        <div className="flex flex-col w-full gap-5 p-4 sm:p-8">
          <div className="flex flex-col gap-2">
            <p>Nombre completo</p>
            <Input type="text" id="name" {...register("fullName")} required />
          </div>
          <div className="flex flex-col gap-2">
            <p>Email</p>
            <Input type="text" id="email" defaultValue={email} disabled></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Contraseña</p>
            <Input
              type="password"
              id="password"
              {...register("password")}
            ></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Repetir contraseña</p>
            <Input type="password" id="passwordCheck" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-wrap justify-between items-center gap-2">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="outline" disabled={isUpdating}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
