import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { useUser } from "../hooks/useUser";
import useLogOut from "../hooks/useLogOut";
import { cn } from "../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

type UserSectionVariant = "expanded" | "compact" | "drawer";

interface UserSectionProps {
  variant?: UserSectionVariant;
}

export default function UserSection({ variant = "expanded" }: UserSectionProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isLoginOut, logOut } = useLogOut();

  const email = user?.email ?? "";
  const fullName = user?.user_metadata?.fullName ?? "";
  const avatar = user?.user_metadata?.avatar ?? "";

  const words: string[] = fullName ? fullName.split(" ") : [];
  const initials = words.length
    ? words.map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.slice(0, 2).toUpperCase() ?? "?";

  const avatarEl = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/30 text-sm font-semibold text-indigo-200">
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

  const avatarCompactEl = (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-500/30 text-indigo-200">
      {avatar ? (
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      ) : (
        <CiUser className="h-5 w-5" />
      )}
    </div>
  );

  const popoverContent = (
    <PopoverContent
      side={variant === "compact" ? "right" : "top"}
      align={variant === "compact" ? "start" : "end"}
      className="w-56 p-1"
    >
      {/* User info header */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-foreground truncate">
          {fullName || "Usuario"}
        </p>
        <p className="text-xs text-muted-foreground truncate">{email}</p>
      </div>

      <div className="my-1 h-px bg-border" />

      {/* Mi perfil */}
      <button
        type="button"
        onClick={() => navigate("/configuracion")}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <User className="h-4 w-4 text-muted-foreground" />
        Mi perfil
      </button>

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={() => logOut()}
        disabled={isLoginOut}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          "text-red-600 hover:bg-red-50 hover:text-red-700",
          "dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300",
          "disabled:opacity-50"
        )}
      >
        <LogOut className="h-4 w-4" />
        {isLoginOut ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </PopoverContent>
  );

  return (
    <div className="border-t border-slate-700/50 p-3">
      {variant === "compact" ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-lg p-1 transition-colors hover:bg-slate-700/50"
              aria-label="Menú de usuario"
            >
              {avatarCompactEl}
            </button>
          </PopoverTrigger>
          {popoverContent}
        </Popover>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-2.5 transition-colors hover:bg-slate-700/60"
              aria-label="Menú de usuario"
            >
              {avatarEl}
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium text-slate-100">
                  {fullName || "Usuario"}
                </p>
                <p className="truncate text-xs text-slate-400">{email}</p>
              </div>
            </button>
          </PopoverTrigger>
          {popoverContent}
        </Popover>
      )}
    </div>
  );
}
