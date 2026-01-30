import { useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import companyLogo from "../assets/ShowRental.png";
import NavButton from "./ui/NavButton";
import UserSection from "./UserSection";
import { navItems } from "../config/navItems";
import { cn } from "../lib/utils";

export default function Sidebar() {
  const companyName = "Show Rental";
  const [display, setDisplay] = useState(true);

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
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              display={display}
              icon={item.icon}
              description={item.description}
              to={item.path}
              className={item.hidden ? "hidden" : undefined}
            />
          ))}
        </nav>
      </div>

      <UserSection variant={display ? "expanded" : "compact"} />
    </aside>
  );
}
