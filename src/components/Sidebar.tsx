import { useState } from "react";

import { CiDeliveryTruck, CiUser } from "react-icons/ci";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { GrConfigure } from "react-icons/gr";
import { IoExitOutline, IoPerson } from "react-icons/io5";
import { MdDashboard, MdEvent, MdOutlineInventory2 } from "react-icons/md";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import companyLogo from "../assets/ShowRental.png";

import NavButton from "./ui/NavButton";
import { Button } from "./ui/button";
import { useUser } from "../hooks/useUser";
import useLogOut from "../hooks/useLogOut";
import { cn } from "../lib/utils";

export default function Sidebar() {
  const companyName = "Show Rental";
  const { user } = useUser();
  const [display, setDisplay] = useState(true);
  const { isLoginOut, logOut } = useLogOut();

  const email = user?.email ?? "";
  const user_metadata = user?.user_metadata ?? {};
  const fullName = user_metadata.fullName ?? "";
  const avatar = user_metadata.avatar ?? "";

  const words: string[] = fullName ? fullName.split(" ") : [];
  const initials = words.length
    ? words
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email?.slice(0, 2).toUpperCase() ?? "?";

  function handleLogOut() {
    logOut();
  }

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col justify-between border-r border-slate-700/50 bg-slate-900 text-slate-200 shadow-xl transition-[width] duration-300 ease-in-out",
        display ? "w-64 min-w-64" : "w-20 min-w-20"
      )}
    >
      {/* Header: toggle + logo */}
      <div className="flex flex-col gap-2 p-3">
        <div
          className={cn(
            "flex w-full items-center transition-all duration-300",
            display ? "justify-end" : "justify-center"
          )}
        >
          <button
            type="button"
            onClick={() => setDisplay(!display)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label={display ? "Contraer menú" : "Expandir menú"}
          >
            {display ? (
              <GoSidebarExpand className="h-5 w-5" />
            ) : (
              <GoSidebarCollapse className="h-5 w-5" />
            )}
          </button>
        </div>

        <div
          className={cn(
            "flex flex-col items-center gap-3 transition-all duration-300",
            display ? "opacity-100" : "opacity-90"
          )}
        >
          <div
            className={cn(
              "overflow-hidden rounded-xl border-2 border-slate-600/50 bg-slate-800 shadow-lg transition-all duration-300",
              display ? "h-20 w-20" : "h-12 w-12"
            )}
          >
            <img
              src={companyLogo}
              alt="Logo Show Rental"
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={cn(
              "text-center text-lg font-bold tracking-tight text-slate-100 transition-all duration-300",
              display ? "max-h-8 overflow-visible" : "max-h-0 overflow-hidden opacity-0"
            )}
          >
            {companyName}
          </span>
        </div>

        {/* Nav */}
        <nav
          className={cn(
            "mt-4 flex flex-col gap-1 transition-all duration-300",
            !display && "items-center"
          )}
          aria-label="Navegación principal"
        >
          <NavButton display={display} icon={<MdDashboard />} description="Dashboard" />
          <NavButton display={display} icon={<MdEvent />} description="Reservas" />
          <NavButton display={display} icon={<LiaMoneyBillWaveSolid />} description="Gastos" />
          <NavButton
            display={display}
            className="hidden"
            icon={<IoPerson />}
            description="Personal"
          />
          <NavButton display={display} icon={<MdOutlineInventory2 />} description="Inventario" />
          <NavButton display={display} icon={<CiDeliveryTruck />} description="Transporte" />
          <NavButton display={display} icon={<GrConfigure />} description="Configuración" />
        </nav>
      </div>

      {/* User section */}
      <div className="border-t border-slate-700/50 p-3">
        <div
          className={cn(
            "flex items-center gap-2 transition-all duration-300",
            display ? "flex-row" : "flex-col"
          )}
        >
          {display ? (
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/30 text-sm font-semibold text-indigo-200">
                {avatar ? (
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">
                  {fullName || "Usuario"}
                </p>
                <p className="truncate text-xs text-slate-400">{email}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/30 text-indigo-200">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <CiUser className="h-5 w-5" />
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogOut}
            disabled={isLoginOut}
            className="shrink-0 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            aria-label="Cerrar sesión"
          >
            <IoExitOutline className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
