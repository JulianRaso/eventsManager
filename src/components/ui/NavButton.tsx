import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface NavButtonProps {
  display: boolean;
  icon: ReactNode;
  description: string;
}

export default function NavButton({
  display,
  icon,
  description,
}: NavButtonProps) {
  return (
    <NavLink
      to={description?.toLowerCase()}
      className={`flex gap-1 mt- items-center bg-transparent hover:bg-gray-500 hover:text-gray-50 font-semibold py-2 px-4 border border-gray-400 hover:border-transparent rounded ${
        display ? "" : "w-fit"
      }`}
    >
      {icon}
      {display ? description : ""}
    </NavLink>
  );
}
