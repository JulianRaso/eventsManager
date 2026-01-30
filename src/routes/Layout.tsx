import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { cn } from "../lib/utils";

export default function Layout() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div
      className={cn(
        "flex min-h-svh h-svh w-full min-w-0 overflow-hidden",
        !isDesktop && "flex-col"
      )}
    >
      {isDesktop ? <Sidebar /> : <Navbar />}
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overscroll-contain bg-muted/30">
        <div className="mx-auto w-full max-w-[1920px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
