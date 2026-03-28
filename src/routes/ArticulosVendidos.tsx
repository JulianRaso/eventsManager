import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Package, BarChart2, DollarSign, Hash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import { formatCurrency } from "../utils/formatCurrency";
import { getAllBookingItemsWithDate } from "../services/bookingItems";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface ArticleRow {
  name: string;
  equipment_id: number;
  unidades: number;
  precioUnit: number;
  total: number;
  eventos: number;
}

export default function ArticulosVendidos() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-based

  const { data = [], isLoading } = useQuery({
    queryKey: ["allBookingItemsWithDate"],
    queryFn: getAllBookingItemsWithDate,
  });

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const articles = useMemo((): ArticleRow[] => {
    const map = new Map<number, ArticleRow>();

    data.forEach((item) => {
      if (!item.booking) return;
      if (item.booking.booking_status === "cancel") return;

      const d = new Date(item.booking.event_date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;

      if (!map.has(item.equipment_id)) {
        map.set(item.equipment_id, {
          name: item.name,
          equipment_id: item.equipment_id,
          unidades: 0,
          precioUnit: item.price,
          total: 0,
          eventos: 0,
        });
      }

      const row = map.get(item.equipment_id)!;
      row.unidades += item.quantity;
      row.total += item.quantity * item.price;
      row.eventos += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.unidades - a.unidades);
  }, [data, year, month]);

  const totals = useMemo(() => ({
    articulos: articles.length,
    unidades: articles.reduce((s, a) => s + a.unidades, 0),
    total: articles.reduce((s, a) => s + a.total, 0),
    eventos: new Set(
      data
        .filter((i) => {
          if (!i.booking || i.booking.booking_status === "cancel") return false;
          const d = new Date(i.booking.event_date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .map((i) => i.booking?.event_date)
    ).size,
  }), [articles, data, year, month]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Artículos Vendidos">
      {/* Selector de mes */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-md p-2 hover:bg-accent transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="min-w-[180px] text-center text-lg font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-md p-2 hover:bg-accent transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Artículos distintos" value={totals.articulos} icon={Package} variant="primary" />
        <KPICard title="Unidades totales" value={totals.unidades} icon={Hash} variant="info" />
        <KPICard title="Eventos del mes" value={totals.eventos} icon={BarChart2} variant="warning" />
        <KPICard
          title="Facturación estimada"
          value={`$${formatCurrency(totals.total)}`}
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Tabla */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Sin artículos en este mes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No hay reservas confirmadas con equipamiento asignado en {MONTH_NAMES[month]} {year}.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-8 px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Artículo</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Eventos</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Unidades</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">Precio unit.</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a, i) => (
                <tr key={a.equipment_id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{a.eventos}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {a.unidades}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                    ${formatCurrency(a.precioUnit)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                    ${formatCurrency(a.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-foreground">
                  Total
                </td>
                <td className="px-4 py-3 text-center font-bold tabular-nums text-foreground">
                  {totals.unidades}
                </td>
                <td className="hidden sm:table-cell" />
                <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">
                  ${formatCurrency(totals.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </CategoryLayout>
  );
}
