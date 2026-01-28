import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-svh h-svh w-full min-w-0 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overscroll-contain bg-muted/30">
        <div className="mx-auto w-full max-w-[1920px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
