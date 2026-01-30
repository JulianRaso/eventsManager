import { CiUser } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { useUser } from "../hooks/useUser";
import useLogOut from "../hooks/useLogOut";
import { cn } from "../lib/utils";

type UserSectionVariant = "expanded" | "compact" | "drawer";

interface UserSectionProps {
  variant?: UserSectionVariant;
}

export default function UserSection({ variant = "expanded" }: UserSectionProps) {
  const { user } = useUser();
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

  return (
    <div className="border-t border-slate-700/50 p-3">
      <div
        className={cn(
          "flex items-center gap-2 transition-all duration-300",
          variant === "expanded" && "flex-row",
          variant === "compact" && "flex-col",
          variant === "drawer" && "flex-row"
        )}
      >
        {variant === "expanded" && (
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-2.5">
            {avatarEl}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">
                {fullName || "Usuario"}
              </p>
              <p className="truncate text-xs text-slate-400">{email}</p>
            </div>
          </div>
        )}
        {variant === "compact" && avatarCompactEl}
        {variant === "drawer" && (
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-2.5">
            {avatarEl}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">
                {fullName || "Usuario"}
              </p>
              <p className="truncate text-xs text-slate-400">{email}</p>
            </div>
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
  );
}
