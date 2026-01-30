import { ReactNode } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { GrConfigure } from "react-icons/gr";
import { IoPerson } from "react-icons/io5";
import { MdDashboard, MdEvent, MdOutlineInventory2 } from "react-icons/md";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";

export interface NavItemConfig {
  path: string;
  description: string;
  icon: ReactNode;
  hidden?: boolean;
}

export const navItems: NavItemConfig[] = [
  { path: "dashboard", description: "Dashboard", icon: <MdDashboard /> },
  { path: "reservas", description: "Reservas", icon: <MdEvent /> },
  { path: "gastos", description: "Gastos", icon: <LiaMoneyBillWaveSolid /> },
  {
    path: "personal",
    description: "Personal",
    icon: <IoPerson />,
    hidden: true,
  },
  { path: "inventario", description: "Inventario", icon: <MdOutlineInventory2 /> },
  { path: "transporte", description: "Transporte", icon: <CiDeliveryTruck /> },
  { path: "configuracion", description: "Configuración", icon: <GrConfigure /> },
];
