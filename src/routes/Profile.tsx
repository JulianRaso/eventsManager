import { CiUser } from "react-icons/ci";
import userData from "../_data/useData.json";
import InputProfile from "../ui/InputProfile";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Profile() {
  const [option, setOption] = useState(false);
  const { name, lastName } = userData;
  const profileImage = null;

  function handleConfiguration(){
    if(option != true) {
      setOption(!option)
      return
    }
    if(option) {
      console.log(name);
      setOption(!option)
    }
    

  }

  return (
    <div className="flex w-full items-center justify-center h-full sm:text-xl">
      <div className="border-2 rounded-2xl bg-gray-200 flex flex-col items-center gap-4 p-8">
        <div className="text-5xl">
          {profileImage === null ? (
            <CiUser />
          ) : (
            ""
            // <img src={profileImage} alt="profile picture" />
          )}
        </div>
        
        {/* Profile Information */}
        <div className="flex flex-col w-full p-4 sm:p-8">

        <InputProfile required={option} title="Nombre" inputValue={name} />
        <InputProfile required={option} title="Apellido" inputValue={lastName} />
        <InputProfile required={option} title="Email" inputValue={lastName} />
        <InputProfile required={option} title="Telefono" inputValue={name} />

        </div>

        <div className="flex w-full justify-between items-center">
        <NavLink to='/' className="border rounded-lg p-2">{option ? "Cancelar" : "Volver"}</NavLink>
          <button onClick={() => handleConfiguration()} className="border rounded-lg p-2">{option ? "Guardar" : "Editar"}</button>
        </div>
      </div>
    </div>
  );
}
