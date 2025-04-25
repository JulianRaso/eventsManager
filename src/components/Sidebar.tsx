import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

//Icons
import { CiDeliveryTruck, CiUser } from "react-icons/ci";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { GrConfigure } from "react-icons/gr";
import { IoExitOutline, IoPerson } from "react-icons/io5";
import { MdDashboard, MdEvent, MdOutlineInventory2 } from "react-icons/md";
import companyLogo from "../assets/ShowRental.png";

//UI
import NavButton from "./ui/NavButton";
import { Button } from "./ui/button";
import { logOut } from "../services/user";

export default function Sidebar() {
  const companyName = "Show Rental";
  const [display, setDisplay] = useState(true);
  const { profilePicture } = {
    profilePicture: null,
  };
  const { user_metadata, email } = useQueryClient().getQueryData(["user"]);
  const { fullName } = user_metadata || "";

  function handleLogOut() {
    logOut();
  }

  return (
    <div className="flex flex-col justify-between bg-gray-800 text-gray-300 shadow-lg transition-all duration-300">
      <div
        className={`flex flex-col  items-center justify-center${
          display ? "text-center m-7" : "text-xl m-2"
        }`}
      >
        <div
          className={`w-full flex text-3xl mb-4 transition-all duration-300 ${
            display ? "justify-end" : "justify-center"
          }`}
        >
          {display ? (
            <GoSidebarExpand
              onClick={() => setDisplay(!display)}
              className="cursor-pointer transition-transform duration-300"
            />
          ) : (
            <GoSidebarCollapse
              onClick={() => setDisplay(!display)}
              className="cursor-pointer transition-transform duration-300"
            />
          )}
        </div>

        {/* Logo y título con transición de escala y opacidad */}
        <div
          className={`m-4 flex flex-col gap-4 w-full items-center transition-all duration-300 ${
            display ? "scale-100 opacity-100" : "scale-75 opacity-70"
          }`}
        >
          <img
            src={companyLogo}
            className={`rounded-2xl border-2 border-gray-300 shadow-lg transition-all duration-300 ${
              display ? "w-[90px] h-[90px]" : "w-[60px] h-[60px]"
            }`}
            alt="company logo"
          />
          <div
            className={`xl:text-xl font-bold mt-2 transition-all duration-300 ${
              display ? "" : "hidden"
            }`}
          >
            {companyName}
          </div>
        </div>

        {/* Botones del menú */}
        <div
          className={`flex flex-col gap-3 w-full transition-all duration-300 ${
            display ? "" : "items-center"
          }`}
        >
          <NavButton
            display={display}
            icon={<MdDashboard />}
            description={"Dashboard"}
          />
          <NavButton
            display={display}
            icon={<MdEvent />}
            description={"Reservas"}
          />
          <NavButton
            display={display}
            icon={<IoPerson />}
            description={"Personal"}
          />
          <NavButton
            display={display}
            icon={<MdOutlineInventory2 />}
            description={"Inventario"}
          />
          <NavButton
            display={display}
            icon={<CiDeliveryTruck />}
            description={"Transporte"}
          />
          <NavButton
            display={display}
            icon={<GrConfigure />}
            description={"Configuracion"}
          />
        </div>
      </div>

      {/* Perfil de usuario */}
      <div className="border-t-1 p-2">
        <div
          className={`flex items-center justify-between gap-2 p-2  ${
            display ? "" : "flex-col"
          }`}
        >
          <div
            className={`flex gap-1 items-center transition-all duration-300 ${
              display ? "" : "flex-col"
            }`}
          >
            {display && (
              <>
                <div className="p-3">
                  {profilePicture != null ? profilePicture : <CiUser />}
                </div>

                <div>
                  <div className=" font-semibold mt-2 text-sm">{fullName}</div>
                  <div className=" font-semibold mt-2 text-xs">{email}</div>
                </div>
              </>
            )}
          </div>
          <Button variant="secondary" onClick={handleLogOut}>
            <IoExitOutline />
          </Button>
        </div>
      </div>
    </div>
  );
}
