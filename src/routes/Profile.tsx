import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiUser } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Input } from "../components/ui/Input";
import { useUser } from "../hooks/useUser";

export default function Profile() {
  const [option, setOption] = useState(false);
  const { user, isLoading } = useUser();
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [grandAccess, setGrandAccess] = useState(false);
  const { register, reset, handleSubmit, setValue } = useForm();
  const profileImage = null;

  if (user) {
    if (user.user_metadata.fullName) {
      setValue("fullName", user.user_metadata?.fullName);
    }
    setValue("email", user.email);
  }
  function handleConfiguration() {
    if (!option) {
      setOption(!option);
      return;
    }
    if (option) {
      setOption(!option);
    }
  }

  if (isLoading) return <Spinner />;

  function onSubmitProfile(data) {
    console.log(data);

    reset();
  }

  return (
    <div className="flex w-full items-center justify-center h-full sm:text-xl bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmitProfile)}
        className="border-2 rounded-3xl bg-white shadow-lg flex flex-col items-center gap-6 p-8 max-w-lg w-full"
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
            <Input type="text" {...register("fullName")} required />
          </div>
          <div className="flex flex-col gap-2">
            <p>Email</p>
            <Input type="text" {...register("email")} disabled={true}></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Contraseña</p>
            <Input
              type="text"
              {...register("password")}
              disabled
              required
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </div>
          <div className="flex flex-col gap-2">
            <p>Repetir contraseña</p>
            <Input
              type="text"
              disabled
              required
              onBlur={(e) => setCheckPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-between items-center mt-6">
          <NavLink
            to="/"
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-lg py-2 px-4 transition duration-300"
          >
            {option ? "Cancelar" : "Volver"}
          </NavLink>
          <button
            onClick={() => handleConfiguration()}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg py-2 px-4 transition duration-300"
          >
            {option ? "Guardar" : "Editar"}
          </button>
        </div>
      </form>
    </div>
  );
}
