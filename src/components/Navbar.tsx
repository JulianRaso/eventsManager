import { useState } from "react";
import { MdMenu } from "react-icons/md";
import companyLogo from "../assets/ShowRental.png";
import NavButton from "./ui/NavButton";
import UserSection from "./UserSection";
import { navItems } from "../config/navItems";
import { cn } from "../lib/utils";

const companyName = "Show Rental";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-700/50 bg-slate-900 px-4 text-slate-200 shadow-xl">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 border-slate-600/50 bg-slate-800">
            <img
              src={companyLogo}
              alt="Logo Show Rental"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="truncate text-lg font-bold tracking-tight text-slate-100">
            {companyName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="Abrir menú"
        >
          <MdMenu className="h-6 w-6" />
        </button>
      </header>

      {/* Drawer overlay + panel */}
      {menuOpen && (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
            aria-hidden
          />
          <aside
            className={cn(
              "fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between",
              "border-r border-slate-700/50 bg-slate-900 text-slate-200 shadow-xl"
            )}
            aria-label="Menú de navegación"
          >
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border-2 border-slate-600/50 bg-slate-800">
                    <img
                      src={companyLogo}
                      alt="Logo Show Rental"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-slate-100">
                    {companyName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-100"
                  aria-label="Cerrar menú"
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>
              <nav
                className="mt-4 flex flex-col gap-1"
                aria-label="Navegación principal"
              >
                {navItems
                  .filter((item) => !item.hidden)
                  .map((item) => (
                    <div
                      key={item.path}
                      onClick={() => setMenuOpen(false)}
                    >
                      <NavButton
                        display
                        icon={item.icon}
                        description={item.description}
                        to={item.path}
                      />
                    </div>
                  ))}
              </nav>
            </div>
            <UserSection variant="drawer" />
          </aside>
        </>
      )}
    </>
  );
}
