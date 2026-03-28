import { ReactNode } from "react";
import { IoPerson } from "react-icons/io5";
import { MdDashboard, MdEvent, MdOutlineInventory2, MdTrendingUp } from "react-icons/md";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import {
  Banknote,
  Boxes,
  Scale,
  Users,
  ReceiptText,
  ShoppingCart,
  BookOpen,
  TrendingUp,
  Building2,
  ClipboardList,
  CreditCard,
  Truck,
  Settings2,
  Activity,
} from "lucide-react";

export interface NavItemConfig {
  path: string;
  description: string;
  icon: ReactNode;
  hidden?: boolean;
  className?: string;
}

export interface NavGroupConfig {
  groupLabel: string;
  items: NavItemConfig[];
}

export type NavEntry = NavItemConfig | NavGroupConfig;

export function isNavGroup(entry: NavEntry): entry is NavGroupConfig {
  return "groupLabel" in entry;
}

export const navItems: NavEntry[] = [
  { path: "dashboard", description: "Dashboard", icon: <MdDashboard /> },
  {
    groupLabel: "Ventas",
    items: [
      { path: "reservas", description: "Reservas", icon: <MdEvent /> },
      { path: "clientes", description: "Clientes", icon: <Users size={18} /> },
      { path: "cuenta-corrientes", description: "Cta. Corrientes", icon: <ReceiptText size={18} /> },
      { path: "articulos-vendidos", description: "Artículos Vendidos", icon: <ShoppingCart size={18} /> },
      { path: "personal", description: "Personal", icon: <IoPerson /> },
    ],
  },
  {
    groupLabel: "Compras",
    items: [
      { path: "proveedores", description: "Proveedores", icon: <Building2 size={18} /> },
      { path: "compras", description: "Comprobantes", icon: <ClipboardList size={18} /> },
      { path: "cuenta-proveedores", description: "Cta. Proveedores", icon: <CreditCard size={18} /> },
    ],
  },
  {
    groupLabel: "Stock",
    items: [
      { path: "inventario", description: "Artículos", icon: <MdOutlineInventory2 /> },
      { path: "parametrizacion-contable", description: "Param. Contable", icon: <Settings2 size={18} /> },
      { path: "disponibilidad", description: "Disponibilidad", icon: <Boxes size={18} /> },
      { path: "informe-uso", description: "Informe de uso", icon: <Activity size={18} /> },
    ],
  },
  {
    groupLabel: "Tesorería",
    items: [
      { path: "recaudacion", description: "Recaudación", icon: <Banknote size={18} /> },
      { path: "caja", description: "Caja", icon: <Scale size={18} /> },
      { path: "ingresos", description: "Ingresos", icon: <MdTrendingUp /> },
      { path: "gastos", description: "Gastos", icon: <LiaMoneyBillWaveSolid /> },
    ],
  },
  {
    groupLabel: "Contabilidad",
    items: [
      { path: "cuentas-contables", description: "Cuentas Contables", icon: <BookOpen size={18} /> },
      { path: "asiento-teorico", description: "Asiento Teórico", icon: <ClipboardList size={18} /> },
      { path: "resultado-economico", description: "Resultado Económico", icon: <TrendingUp size={18} /> },
    ],
  },
  {
    groupLabel: "Activo Fijo",
    items: [
      { path: "transporte", description: "Transporte", icon: <Truck size={18} /> },
    ],
  },
];
