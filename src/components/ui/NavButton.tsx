import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

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
  const currLocation = useLocation().pathname.split("/");
  return (
    <NavLink
      to={description?.toLowerCase()}
      className={`flex gap-1 mt- items-center  hover:bg-gray-500 hover:text-gray-50 font-semibold py-2 px-4 border border-gray-400 hover:border-transparent rounded ${
        display ? "" : "w-fit"
      } ${
        currLocation[1] === description?.toLowerCase()
          ? "bg-gray-700 text-gray-50"
          : ""
      }`}
    >
      {icon}
      {display ? description : ""}
    </NavLink>
  );
}
