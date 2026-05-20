import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import companyLogo from "../assets/ShowRental.png";
import NavButton from "./ui/NavButton";
import UserSection from "./UserSection";
import { navItems, isNavGroup } from "../config/navItems";
import { cn } from "../lib/utils";

function getInitialOpenGroups(): Record<string, boolean> {
  return Object.fromEntries(
    navItems.filter(isNavGroup).map((g) => [g.groupLabel, false])
  );
}

export default function Sidebar() {
  const companyName = "Show Rental";
  const [display, setDisplay] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    getInitialOpenGroups
  );
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const toggleGroup = (label: string) => {
    const currentlyOpen = Object.keys(openGroups).find((k) => openGroups[k]);

    if (currentlyOpen && currentlyOpen !== label) {
      // Cerrar el grupo abierto primero, luego abrir el nuevo
      setOpenGroups(Object.fromEntries(Object.keys(openGroups).map((k) => [k, false])));
      setTimeout(() => {
        setOpenGroups((prev) => ({ ...prev, [label]: true }));
      }, 260);
    } else {
      // Toggle normal (abrir/cerrar el mismo)
      setOpenGroups((prev) => {
        const allClosed = Object.fromEntries(Object.keys(prev).map((k) => [k, false]));
        return { ...allClosed, [label]: !prev[label] };
      });
    }
  };

  const toggleCollapsedGroup = (label: string) =>
    setActiveGroup((prev) => (prev === label ? null : label));

  return (
    <aside
      className={cn(
        "relative flex shrink-0 flex-col justify-between border-r border-slate-700/50 bg-slate-900 text-slate-200 shadow-xl transition-[width] duration-300 ease-in-out",
        display ? "w-64 min-w-64" : "w-20 min-w-20"
      )}
    >
      {/* Overlay para cerrar flyout al hacer click afuera */}
      {!display && activeGroup && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveGroup(null)}
        />
      )}

      <div className="flex flex-col gap-2 p-3">
        {/* Toggle button */}
        <div
          className={cn(
            "flex w-full items-center transition-all duration-300",
            display ? "justify-end" : "justify-center"
          )}
        >
          <button
            type="button"
            onClick={() => {
              setDisplay(!display);
              setActiveGroup(null);
            }}
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

        {/* Logo */}
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
              display
                ? "max-h-8 overflow-visible"
                : "max-h-0 overflow-hidden opacity-0"
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
          {navItems.map((entry) =>
            isNavGroup(entry) ? (
              display ? (
                // Expanded: accordion — solo un grupo abierto a la vez
                <div key={entry.groupLabel}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(entry.groupLabel)}
                    className="mt-3 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-slate-300"
                  >
                    <span>{entry.groupLabel}</span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        openGroups[entry.groupLabel] && "rotate-90"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openGroups[entry.groupLabel] ? "max-h-96" : "max-h-0"
                    )}
                  >
                    {entry.items
                      .filter((item) => !item.hidden)
                      .map((item) => (
                        <NavButton
                          key={item.path}
                          display={display}
                          icon={item.icon}
                          description={item.description}
                          to={item.path}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                // Collapsed: un ícono por grupo + flyout al hacer click
                <div key={entry.groupLabel} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleCollapsedGroup(entry.groupLabel)}
                    title={entry.groupLabel}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors",
                      activeGroup === entry.groupLabel
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-100"
                    )}
                  >
                    {entry.groupIcon}
                  </button>
                  {activeGroup === entry.groupLabel && (
                    <div className="absolute left-full top-0 z-50 ml-2 w-52 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-xl">
                      <div className="mb-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {entry.groupLabel}
                      </div>
                      {entry.items
                        .filter((item) => !item.hidden)
                        .map((item) => (
                          <NavButton
                            key={item.path}
                            display={true}
                            icon={item.icon}
                            description={item.description}
                            to={item.path}
                            onClick={() => setActiveGroup(null)}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )
            ) : (
              <NavButton
                key={entry.path}
                display={display}
                icon={entry.icon}
                description={entry.description}
                to={entry.path}
                className={entry.hidden ? "hidden" : undefined}
              />
            )
          )}
        </nav>
      </div>

      <UserSection variant={display ? "expanded" : "compact"} />
    </aside>
  );
}
