import { CiUser } from "react-icons/ci";
import Input from "../ui/Input";

export default function Profile() {
  const { name, lastName, profileImage } = {
    name: "Test",
    lastName: "Subject",
    profileImage: null,
  };

  return (
    <div className="flex w-full items-center justify-center h-full text-xl">
      <div className="border-2 rounded-2xl bg-gray-200 w-4/12 h-8/12 flex flex-col items-center justify-start gap-4 pt-16">
        <div className="text-5xl">
          {profileImage === null ? (
            <CiUser />
          ) : (
            ""
            // <img src={profileImage} alt="profile picture" />
          )}
        </div>
        <div className="flex flex-col">
          Nombre
          <Input value={name} />
        </div>
        <div>
          Apellido
          <input value={lastName} />
        </div>
        <div className="flex items-center justify-around">
          <button>Cancelar</button>
          <button disabled={true}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}
