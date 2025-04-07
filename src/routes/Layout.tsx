import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full">
      <Navbar />
      <div className="w-full bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
