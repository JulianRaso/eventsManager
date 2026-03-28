import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, TrendingUp, ShoppingCart } from "lucide-react";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { cn } from "../lib/utils";
import { formatCurrency } from "../utils/formatCurrency";
import useAsientoTeorico from "../hooks/useAsientoTeorico";
import type { AsientoData } from "../hooks/useAsientoTeorico";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type Tab = "ventas" | "costos";

function AsientoTable({ data, label }: { data: AsientoData; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      {data.unassigned > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>${formatCurrency(data.unassigned)}</strong> en artículos sin cuenta de {label.toLowerCase()} asignada — no se incluyen en el asiento.
            Asignalos en <strong>Stock → Param. Contable</strong>.
          </span>
        </div>
      )}

      {data.lines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No hay movimientos con cuentas de {label.toLowerCase()} asignadas en este mes.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground w-28">Código</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Cuenta</th>
                <th className="px-5 py-3 text-center font-medium text-muted-foreground hidden sm:table-cell">Unidades</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Importe</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">%</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((line) => (
                <tr
                  key={line.accountId}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-3 font-mono font-semibold text-foreground">
                    {line.accountCode}
                  </td>
                  <td className="px-5 py-3 text-foreground">{line.accountName}</td>
                  <td className="px-5 py-3 text-center tabular-nums text-muted-foreground hidden sm:table-cell">
                    {line.unidades}
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                    ${formatCurrency(line.importe)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                    {data.total > 0 ? ((line.importe / data.total) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td colSpan={2} className="px-5 py-3 font-semibold text-foreground">
                  Total {label}
                </td>
                <td className="px-5 py-3 text-center font-semibold tabular-nums hidden sm:table-cell">
                  {data.lines.reduce((s, l) => s + l.unidades, 0)}
                </td>
                <td className="px-5 py-3 text-right font-bold tabular-nums text-foreground text-base">
                  ${formatCurrency(data.total)}
                </td>
                <td className="hidden sm:table-cell px-5 py-3 text-right font-semibold text-foreground">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AsientoTeorico() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [tab, setTab] = useState<Tab>("ventas");

  const { ventas, costos, isLoading } = useAsientoTeorico(month, year);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const margen = ventas.total - costos.total;

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Asiento Teórico">
      {/* Selector de mes */}
      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={prevMonth} className="rounded-md p-2 hover:bg-accent transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="min-w-[180px] text-center text-lg font-semibold text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <button type="button" onClick={nextMonth} className="rounded-md p-2 hover:bg-accent transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Resumen del mes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Ventas</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
            ${formatCurrency(ventas.total)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{ventas.lines.length} cuentas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Costos</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
            ${formatCurrency(costos.total)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{costos.lines.length} cuentas</p>
        </div>
        <div className={cn(
          "rounded-xl border p-4 shadow-sm",
          margen >= 0
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
        )}>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Margen</p>
          <p className={cn(
            "mt-1 text-xl font-bold tabular-nums",
            margen >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"
          )}>
            ${formatCurrency(margen)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {ventas.total > 0 ? ((margen / ventas.total) * 100).toFixed(1) : "0.0"}% sobre ventas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-border bg-muted/30 p-0.5 w-fit">
        <button
          type="button"
          onClick={() => setTab("ventas")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "ventas"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          Asiento Ventas
        </button>
        <button
          type="button"
          onClick={() => setTab("costos")}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "costos"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          Asiento Costos
        </button>
      </div>

      {tab === "ventas" ? (
        <AsientoTable data={ventas} label="Ventas" />
      ) : (
        <AsientoTable data={costos} label="Costos" />
      )}
    </CategoryLayout>
  );
}
