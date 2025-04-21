import { useState } from "react";

//Icons
import { CiDeliveryTruck } from "react-icons/ci";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { MdDashboard, MdEvent, MdOutlineInventory2 } from "react-icons/md";
import companyLogo from "../assets/ShowRental.png";

//UI
import ProfileNav from "./ProfileNav";
import NavButton from "./ui/NavButton";

function Navbar() {
  const companyName = "Show Rental";
  const [display, setDisplay] = useState(true);

  return (
    <div className="flex flex-col justify-between p-2 xl:p-4 bg-gray-800 text-gray-300 shadow-lg transition-all duration-300">
      <div
        className={`flex flex-col items-center justify-center${
          display ? "text-center" : "text-xl"
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
        </div>
      </div>

      {/* Perfil de usuario */}
      <ProfileNav display={display} />
    </div>
  );
}

export default Navbar;
