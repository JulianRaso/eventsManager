import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { formatDate } from "../components/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import useClientBalances from "../hooks/useClientBalances";

export default function CuentaCorrientes() {
  const navigate = useNavigate();
  const { clients, isLoading } = useClientBalances();
  const [search, setSearch] = useState("");
  const [onlyDebt, setOnlyDebt] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggleExpand(dni: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(dni)) next.delete(dni);
      else next.add(dni);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        !search ||
        `${c.name} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        String(c.dni).includes(search);
      const matchDebt = !onlyDebt || c.saldo > 0;
      return matchSearch && matchDebt;
    });
  }, [clients, search, onlyDebt]);

  const totals = useMemo(() => {
    const all = clients;
    return {
      totalClients: all.length,
      withDebt: all.filter((c) => c.saldo > 0).length,
      totalFacturado: all.reduce((s, c) => s + c.totalFacturado, 0),
      totalSaldo: all.reduce((s, c) => s + c.saldo, 0),
    };
  }, [clients]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Cuenta Corrientes">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Clientes" value={totals.totalClients} icon={Users} variant="primary" />
        <KPICard title="Con deuda" value={totals.withDebt} icon={AlertCircle} variant="warning" />
        <KPICard
          title="Total facturado"
          value={`$${formatCurrency(totals.totalFacturado)}`}
          icon={DollarSign}
          variant="info"
        />
        <KPICard
          title="Saldo pendiente"
          value={`$${formatCurrency(totals.totalSaldo)}`}
          icon={CheckCircle2}
          variant={totals.totalSaldo > 0 ? "warning" : "success"}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <button
          type="button"
          onClick={() => setOnlyDebt((v) => !v)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
            onlyDebt
              ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertCircle className="h-4 w-4" />
          {onlyDebt ? "Mostrando solo con deuda" : "Mostrar solo con deuda"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-500" />
          <p className="text-lg font-medium text-foreground">Sin deudas pendientes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Todos los clientes están al día.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-8 px-3 py-3" />
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Eventos</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Facturado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cobrado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => {
                const isOpen = expanded.has(client.dni);
                return (
                  <>
                    {/* Fila cliente */}
                    <tr
                      key={client.dni}
                      className="cursor-pointer border-b border-border hover:bg-muted/20 transition-colors"
                      onClick={() => toggleExpand(client.dni)}
                    >
                      <td className="px-3 py-3 text-muted-foreground">
                        {isOpen
                          ? <ChevronDown className="h-4 w-4" />
                          : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {client.name} {client.lastName}
                        <span className="ml-2 text-xs text-muted-foreground">DNI {client.dni}</span>
                      </td>
                      <td className="px-4 py-3 text-center tabular-nums">{client.eventos}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        ${formatCurrency(client.totalFacturado)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                        ${formatCurrency(client.totalCobrado)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        <span className={client.saldo > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>
                          ${formatCurrency(client.saldo)}
                        </span>
                      </td>
                    </tr>

                    {/* Detalle de reservas */}
                    {isOpen && client.bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-border bg-muted/10 last:border-0"
                      >
                        <td className="px-3 py-2" />
                        <td className="px-4 py-2 pl-8 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span>{formatDate(b.event_date)}</span>
                            <span className="text-xs">· {b.organization}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            b.booking_status === "confirm"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          )}>
                            {b.booking_status === "confirm" ? "Confirmado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                          ${formatCurrency(b.totalFacturado)}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                          ${formatCurrency(b.totalCobrado)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={cn(
                              "font-medium tabular-nums",
                              b.saldo > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                            )}>
                              ${formatCurrency(b.saldo)}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/evento/${b.id}`);
                              }}
                            >
                              Ver
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-foreground">
                  Total
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  ${formatCurrency(totals.totalFacturado)}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  ${formatCurrency(totals.totalFacturado - totals.totalSaldo)}
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-amber-600 dark:text-amber-400">
                  ${formatCurrency(totals.totalSaldo)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </CategoryLayout>
  );
}
