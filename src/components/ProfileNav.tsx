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
      className={`flex flex-col items-center text-xl rounded-2xl ${
        display ? "border-2 hover:bg-gray-600 p-2  " : ""
      }
      `}
    >
      <div className="text-4xl border-1 rounded-3xl p-2 hover:bg-gray-600 ">
        {profilePicture != null ? profilePicture : <CiUser />}
      </div>
      {display ? name : ""}
      {display ? <div className="text-xs">#{id}</div> : ""}
    </NavLink>
  );
}
