import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import InputProfile from "../components/ui/InputProfile";
import { getUserData, logIn } from "../services/user";

export default function Profile() {
  const [option, setOption] = useState(false);
  const { displayName, email, password } = {
    displayName: "Test",
    email: "user@example.com",
    password: "",
  };
  const profileImage = null;

  const userLogIn = async () => {
    return await logIn({ email, password });
  };

  userLogIn();
  const userData = async () => {
    return await getUserData();
  };
  userData();

  function handleConfiguration() {
    if (option != true) {
      setOption(!option);
      return;
    }
    if (option) {
      setOption(!option);
    }
  }

  return (
    <div className="flex w-full items-center justify-center h-full sm:text-xl bg-gray-100">
      <div className="border-2 rounded-3xl bg-white shadow-lg flex flex-col items-center gap-6 p-8 max-w-lg w-full">
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
          <InputProfile
            required={option}
            title="Nombre"
            inputValue={displayName}
            disabled={!option}
          />
          <InputProfile
            required={option}
            title="Email"
            inputValue={email}
            disabled={!option}
          />
          <InputProfile
            required={option}
            title="Contraseña"
            inputValue={password}
            disabled={!option}
          />
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
      </div>
    </div>
  );
}
