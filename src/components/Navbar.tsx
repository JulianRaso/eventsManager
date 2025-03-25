import { useState } from "react";

//Icons
import { GiLightProjector } from "react-icons/gi";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoPerson } from "react-icons/io5";
import { MdDashboard, MdEvent } from "react-icons/md";
import { RiSoundModuleFill } from "react-icons/ri";
import { TfiBlackboard } from "react-icons/tfi";
import companyLogo from "../assets/ShowRental.png";

//UI
import NavButton from "../ui/NavButton";
import ProfileNav from "./ProfileNav";

function Navbar() {
  const companyName = "Show Rental";
  const [display, setDisplay] = useState(true);

  return (
    <div className="flex flex-col justify-between p-4 border-r-1 bg-gray-800 text-gray-300 ">
      <div className={display ? "text-center" : "text-xl"}>
        <div
          className={`w-full flex text-3xl mb-4 ${
            display ? "justify-end" : "justify-center"
          }`}
        >
          {display ? (
            <GoSidebarExpand onClick={() => setDisplay(!display)} />
          ) : (
            <GoSidebarCollapse onClick={() => setDisplay(!display)} />
          )}
        </div>
        <div
          className={`m-4 flex flex-col gap-4  items-center  ${
            display ? "" : "hidden"
          }`}
        >
          <img
            src={companyLogo}
            className="rounded-3xl w-[100px] h-[100px]"
            alt="company logo"
          />
          <div className="text-xl font-bold">{companyName}</div>
        </div>
        <div className={`flex flex-col gap-3 ${display ? "" : "items-center"}`}>
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
            icon={<RiSoundModuleFill />}
            description={"Sonido"}
          />
          <NavButton
            display={display}
            icon={<GiLightProjector />}
            description={"Iluminacion"}
          />
          <NavButton
            display={display}
            icon={<TfiBlackboard />}
            description={"Ambientacion"}
          />
        </div>
      </div>
      <ProfileNav display={display} />
    </div>
  );
}

export default Navbar;
