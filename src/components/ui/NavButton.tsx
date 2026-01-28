import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

interface NavButtonProps {
  display: boolean;
  icon: ReactNode;
  description: string;
  className?: string;
}

export default function NavButton({
  display,
  icon,
  description,
  className,
}: NavButtonProps) {
  const currLocation = useLocation().pathname.split("/");
  const path = description
    ?.toLowerCase()
    .replace(/\s/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const isActive =
    currLocation[1] === path ||
    (path === "dashboard" && (currLocation[1] === "dashboard" || currLocation[1] === ""));

  return (
    <NavLink
      to={path}
      className={cn(
        className,
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        display ? "" : "w-10 justify-center px-0",
        isActive
          ? "bg-indigo-500/20 text-indigo-200 shadow-sm"
          : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
      )}
    >
      <span className={cn("flex shrink-0 text-lg", isActive && "text-indigo-300")}>
        {icon}
      </span>
      {display && <span className="truncate">{description}</span>}
      {/* Tooltip cuando el sidebar está cerrado */}
      {!display && (
        <span
          className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 shadow-lg ring-1 ring-slate-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          role="tooltip"
        >
          {description}
        </span>
      )}
    </NavLink>
  );
}
