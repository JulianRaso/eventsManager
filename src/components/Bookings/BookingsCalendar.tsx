import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface Booking {
  id: number;
  event_date: string;
  booking_status: string;
  organization: string;
  client?: { name?: string; lastName?: string } | null;
}

interface Props {
  bookings: Booking[];
}

function statusColor(status: string) {
  if (status === "confirm") return "bg-emerald-500 text-white hover:bg-emerald-600";
  if (status === "cancel") return "bg-red-500 text-white hover:bg-red-600";
  return "bg-amber-500 text-white hover:bg-amber-600";
}

export default function BookingsCalendar({ bookings }: Props) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // semana lunes-domingo
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const byDate = new Map<string, Booking[]>();
  bookings.forEach((b) => {
    const key = b.event_date.slice(0, 10);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(b);
  });

  const today = new Date();

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const events = byDate.get(dateStr) ?? [];
    const isToday =
      dayNum === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    return { dayNum, dateStr, events, isToday };
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Navigation */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="rounded-md p-1.5 hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="rounded-md p-1.5 hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => (
          <div
            key={i}
            className={cn(
              "min-h-[100px] border-b border-r border-border p-1.5",
              !cell && "bg-muted/10",
              (i + 1) % 7 === 0 && "border-r-0"
            )}
          >
            {cell && (
              <>
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    cell.isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {cell.dayNum}
                </span>
                <div className="mt-1 flex flex-col gap-0.5">
                  {cell.events.slice(0, 3).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => navigate(`/evento/${ev.id}`)}
                      className={cn(
                        "w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium transition-colors",
                        statusColor(ev.booking_status)
                      )}
                    >
                      {ev.client?.name
                        ? `${ev.client.name} ${ev.client.lastName ?? ""}`.trim()
                        : ev.organization}
                    </button>
                  ))}
                  {cell.events.length > 3 && (
                    <span className="pl-1 text-xs text-muted-foreground">
                      +{cell.events.length - 3} más
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-border px-4 py-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Confirmado
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Pendiente
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Cancelado
        </span>
      </div>
    </div>
  );
}
