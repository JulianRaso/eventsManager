//Icon
import { CiUser } from "react-icons/ci";
import { NavLink } from "react-router-dom";

interface ProfileNavProps {
  display: boolean;
}

export default function ProfileNav({ display }: ProfileNavProps) {
  const { id, name, profilePicture } = {
    id: "0001",
    name: "Test",
    profilePicture: null,
  };

  return (
    <NavLink
      to="/perfil"
      className={`flex flex-col items-center text-xl rounded-2xl transition-all duration-300 ${
        display ? "border-2 hover:bg-gray-600 p-3" : ""
      }`}
    >
      <div className="text-4xl border-2 rounded-3xl p-3 hover:bg-gray-600 cursor-pointer transition-all duration-300">
        {profilePicture != null ? profilePicture : <CiUser />}
      </div>
      {display ? (
        <div className="text-lg font-semibold mt-2 transition-all duration-300">
          {name}
        </div>
      ) : (
        ""
      )}
      {display ? (
        <div className="text-xs mt-1 transition-all duration-300">#{id}</div>
      ) : (
        ""
      )}
    </NavLink>
  );
}
