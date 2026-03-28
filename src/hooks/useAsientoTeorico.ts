import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllBookingItemsWithDate } from "../services/bookingItems";
import { getAllPurchaseItemsWithDate } from "../services/purchases";
import { getInventoryWithAccounting } from "../services/itemAccounting";

export interface AsientoLine {
  accountId: number;
  accountCode: string;
  accountName: string;
  unidades: number;
  importe: number;
}

export interface AsientoData {
  lines: AsientoLine[];
  total: number;
  unassigned: number; // items sin cuenta asignada (importe excluido)
}

export default function useAsientoTeorico(month: number, year: number) {
  const { data: saleItems = [], isLoading: loadingItems } = useQuery({
    queryKey: ["allBookingItemsWithDate"],
    queryFn: getAllBookingItemsWithDate,
  });

  const { data: purchaseItems = [], isLoading: loadingPurchaseItems } = useQuery({
    queryKey: ["allPurchaseItemsWithDate"],
    queryFn: getAllPurchaseItemsWithDate,
  });

  const { data: inventory = [], isLoading: loadingInventory } = useQuery({
    queryKey: ["itemAccounting"],
    queryFn: getInventoryWithAccounting,
  });

  // Map equipment_id → accounting info
  const accountingMap = useMemo(() => {
    const map = new Map<number, { purchase: { id: number; code: string; name: string } | null; sale: { id: number; code: string; name: string } | null }>();
    inventory.forEach((item) => {
      map.set(item.id, {
        purchase: item.item_accounting?.purchase_account ?? null,
        sale: item.item_accounting?.sale_account ?? null,
      });
    });
    return map;
  }, [inventory]);

  // Ventas: booking_items del mes
  const monthSaleItems = useMemo(() => {
    return saleItems.filter((item) => {
      if (!item.booking) return false;
      if (item.booking.booking_status === "cancel") return false;
      const d = new Date(item.booking.event_date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [saleItems, month, year]);

  // Costos: purchase_items del mes
  const monthPurchaseItems = useMemo(() => {
    return purchaseItems.filter((item) => {
      if (!item.purchases) return false;
      const d = new Date(item.purchases.purchase_date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [purchaseItems, month, year]);

  function buildVentas(): AsientoData {
    const map = new Map<number, AsientoLine>();
    let unassigned = 0;

    monthSaleItems.forEach((item) => {
      const acct = accountingMap.get(item.equipment_id)?.sale;
      const importe = item.quantity * item.price;
      if (!acct) { unassigned += importe; return; }
      if (!map.has(acct.id)) {
        map.set(acct.id, { accountId: acct.id, accountCode: acct.code, accountName: acct.name, unidades: 0, importe: 0 });
      }
      const line = map.get(acct.id)!;
      line.unidades += item.quantity;
      line.importe += importe;
    });

    const lines = Array.from(map.values()).sort((a, b) => b.importe - a.importe);
    return { lines, total: lines.reduce((s, l) => s + l.importe, 0), unassigned };
  }

  function buildCostos(): AsientoData {
    const map = new Map<number, AsientoLine>();
    let unassigned = 0;

    monthPurchaseItems.forEach((item) => {
      if (!item.equipment_id) { unassigned += item.quantity * item.unit_price; return; }
      const acct = accountingMap.get(item.equipment_id)?.purchase;
      const importe = item.quantity * item.unit_price;
      if (!acct) { unassigned += importe; return; }
      if (!map.has(acct.id)) {
        map.set(acct.id, { accountId: acct.id, accountCode: acct.code, accountName: acct.name, unidades: 0, importe: 0 });
      }
      const line = map.get(acct.id)!;
      line.unidades += item.quantity;
      line.importe += importe;
    });

    const lines = Array.from(map.values()).sort((a, b) => b.importe - a.importe);
    return { lines, total: lines.reduce((s, l) => s + l.importe, 0), unassigned };
  }

  const ventas = useMemo(() => buildVentas(), [monthSaleItems, accountingMap]);
  const costos = useMemo(() => buildCostos(), [monthPurchaseItems, accountingMap]);

  return {
    ventas,
    costos,
    isLoading: loadingItems || loadingPurchaseItems || loadingInventory,
    totalItems: monthSaleItems.length,
  };
}
