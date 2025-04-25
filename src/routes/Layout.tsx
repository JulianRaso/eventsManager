import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="w-full bg-gray-200 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
