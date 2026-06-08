import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AvailabilityConflict, AvailabilityItem } from "../types";
import { getInventory } from "../services/stock";
import {
  getUpcomingBookingItems,
  type UpcomingBookingItem,
} from "../services/bookingItems";

type LocalItem = { equipment_id: number; quantity: number };

type Options = {
  date?: string;
  startTime?: string | null;
  endTime?: string | null;
  excludeBookingId?: number;
  localItems?: LocalItem[];
};

function normalizeTime(t: string | null | undefined): string | null {
  if (!t) return null;
  return t.slice(0, 5);
}

function timesOverlap(
  bStart: string | null,
  bEnd: string | null,
  tStart: string | null | undefined,
  tEnd: string | null | undefined
): boolean {
  const start = normalizeTime(bStart);
  const end = normalizeTime(bEnd);
  const slotStart = normalizeTime(tStart);
  const slotEnd = normalizeTime(tEnd);
  if (!start || !end || !slotStart || !slotEnd) return true;
  return slotStart < end && slotEnd > start;
}

function buildConflicts(
  items: UpcomingBookingItem[],
  overlaps: boolean
): AvailabilityConflict[] {
  const byBooking = new Map<number, AvailabilityConflict>();

  for (const bi of items) {
    if (!overlaps) continue;
    const existing = byBooking.get(bi.booking_id);
    if (existing) {
      existing.quantity += bi.quantity;
      continue;
    }
    byBooking.set(bi.booking_id, {
      booking_id: bi.booking_id,
      quantity: bi.quantity,
      organization: bi.organization,
      event_type: bi.event_type,
      place: bi.place,
      start_time: bi.start_time,
      end_time: bi.end_time,
    });
  }

  return Array.from(byBooking.values());
}

export default function useGetStockAvailability(options?: Options) {
  const { date, startTime, endTime, excludeBookingId, localItems = [] } =
    options ?? {};

  const hasTimeContext = !!(date && startTime && endTime);
  const hasIncompleteTimes = !!(date && (!startTime || !endTime));

  const { data: stock = [], isLoading: isLoadingStock } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(),
  });

  const { data: upcomingItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["upcomingBookingItems"],
    queryFn: getUpcomingBookingItems,
  });

  const availability = useMemo((): AvailabilityItem[] => {
    return stock.map((item) => {
      const relevant = upcomingItems.filter((bi) => {
        if (bi.equipment_id !== item.id) return false;
        if (excludeBookingId && bi.booking_id === excludeBookingId) return false;
        return true;
      });

      let allocatedInSlot = 0;
      let allocatedSameDay = 0;
      const overlapping: UpcomingBookingItem[] = [];

      for (const bi of relevant) {
        if (!date) {
          allocatedInSlot += bi.quantity;
          overlapping.push(bi);
          continue;
        }

        if (bi.event_date !== date) continue;

        allocatedSameDay += bi.quantity;

        if (timesOverlap(bi.start_time, bi.end_time, startTime, endTime)) {
          allocatedInSlot += bi.quantity;
          overlapping.push(bi);
        }
      }

      const localQty = localItems
        .filter((li) => li.equipment_id === item.id)
        .reduce((sum, li) => sum + li.quantity, 0);

      const reusableSameDay = Math.max(0, allocatedSameDay - allocatedInSlot);

      return {
        ...item,
        allocatedInSlot,
        allocatedSameDay,
        reusableSameDay,
        allocated: allocatedInSlot,
        available: Math.max(0, item.quantity - allocatedInSlot - localQty),
        hasTimeContext,
        conflicts: buildConflicts(overlapping, true),
      };
    });
  }, [
    stock,
    upcomingItems,
    date,
    startTime,
    endTime,
    excludeBookingId,
    localItems,
    hasTimeContext,
  ]);

  return {
    availability,
    isLoading: isLoadingStock || isLoadingItems,
    hasTimeContext,
    hasIncompleteTimes,
  };
}
