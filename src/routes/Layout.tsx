import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex h-dvh w-full min-w-0">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto bg-muted/30">
        <div className="mx-auto min-h-full w-full max-w-[1920px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
