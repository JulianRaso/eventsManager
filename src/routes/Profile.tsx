import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { useUser } from "../hooks/useUser";

function validatePassword(pass: string, toCheck: string) {
  if (pass && toCheck) {
    if (pass === toCheck) return true;
    return false;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [validated, setValidated] = useState(false);
  const { register, reset, handleSubmit, setValue, getValues } = useForm();
  const profileImage = null;

  if (user) {
    if (user.user_metadata.fullName) {
      setValue("fullName", user.user_metadata?.fullName);
    }
    setValue("email", user.email);
  }

  if (isLoading) return <Spinner />;

  function onSubmitProfile(data) {
    console.log(data);
    reset();
  }

  function handleCancel() {
    reset();
    navigate("/dashboard");
  }

  return (
    <div className="flex w-full items-center justify-center h-full sm:text-xl bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmitProfile)}
        className="border-2 rounded-3xl bg-white shadow-lg flex flex-col items-center p-8 w-2/5"
      >
        <div className="text-6xl mb-4">
          {profileImage === null ? (
            <CiUser className="text-gray-500" />
          ) : (
            // <img src={profileImage} alt="profile picture" className="rounded-full w-24 h-24 object-cover" />
            ""
          )}
        </div>

        {/* Profile Information */}
        <div className="flex flex-col w-full gap-6 p-4 sm:p-8">
          <div className="flex flex-col gap-2">
            <p>Nombre completo</p>
            <Input
              type="text"
              id="fullName"
              {...register("fullName")}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Email</p>
            <Input
              type="text"
              id="email"
              {...register("email")}
              disabled
            ></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Contraseña</p>
            <Input
              type="password"
              id="password"
              {...register("password")}
              required
            ></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Repetir contraseña</p>
            <Input type="password" id="passwordCheck" required />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-between items-center mt-6">
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="outline" disabled={validated}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
