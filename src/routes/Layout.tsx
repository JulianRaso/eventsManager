import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="h-dvh w-dvw flex">
      <Sidebar />
      <div className="w-full bg-gray-200 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
