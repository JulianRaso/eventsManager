import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { MdMenu } from "react-icons/md";
import companyLogo from "../assets/ShowRental.png";
import NavButton from "./ui/NavButton";
import UserSection from "./UserSection";
import { navItems, isNavGroup } from "../config/navItems";
import { cn } from "../lib/utils";

function getInitialOpenGroups(): Record<string, boolean> {
  return Object.fromEntries(
    navItems.filter(isNavGroup).map((g) => [g.groupLabel, true])
  );
}

const companyName = "Show Rental";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    getInitialOpenGroups
  );

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

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
            <div className="flex flex-col gap-2 overflow-y-auto p-3">
              {/* Header */}
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

              {/* Nav */}
              <nav className="mt-2 flex flex-col gap-1" aria-label="Navegación principal">
                {navItems.map((entry) =>
                  isNavGroup(entry) ? (
                    <div key={entry.groupLabel}>
                      <button
                        type="button"
                        onClick={() => toggleGroup(entry.groupLabel)}
                        className="mt-3 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-300"
                      >
                        <span>{entry.groupLabel}</span>
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            openGroups[entry.groupLabel] && "rotate-90"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          openGroups[entry.groupLabel] ? "max-h-96" : "max-h-0"
                        )}
                      >
                        {entry.items
                          .filter((item) => !item.hidden)
                          .map((item) => (
                            <div key={item.path} onClick={() => setMenuOpen(false)}>
                              <NavButton
                                display
                                icon={item.icon}
                                description={item.description}
                                to={item.path}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : entry.hidden ? null : (
                    <div key={entry.path} onClick={() => setMenuOpen(false)}>
                      <NavButton
                        display
                        icon={entry.icon}
                        description={entry.description}
                        to={entry.path}
                      />
                    </div>
                  )
                )}
              </nav>
            </div>
            <UserSection variant="drawer" />
          </aside>
        </>
      )}
    </>
  );
}
