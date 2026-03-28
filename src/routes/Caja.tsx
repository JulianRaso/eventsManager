import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownCircle, ArrowUpCircle, Scale } from "lucide-react";
import CategoryLayout from "@/components/CategoryLayout";
import Spinner from "@/components/Spinner";
import { KPICard } from "@/components/ui/KPICard";
import { getAllPayments } from "@/services/bookingPayments";
import { getInvoices } from "@/services/bill";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/components/formatDate";
import { cn } from "@/lib/utils";

const methodLabel: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  "bank check": "Cheque",
};

export default function Caja() {
  const { data: payments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["allPayments"],
    queryFn: getAllPayments,
  });

  const { data: bills = [], isLoading: loadingBills } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(),
  });

  const totals = useMemo(() => {
    const ingresos = payments.reduce((sum, p) => sum + p.amount, 0);
    const egresos = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
    return { ingresos, egresos, balance: ingresos - egresos };
  }, [payments, bills]);

  if (loadingPayments || loadingBills) return <Spinner />;

  return (
    <CategoryLayout title="Caja">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <KPICard
          title="Ingresos"
          value={`$${formatCurrency(totals.ingresos)}`}
          icon={ArrowUpCircle}
          variant="success"
        />
        <KPICard
          title="Egresos"
          value={`$${formatCurrency(totals.egresos)}`}
          icon={ArrowDownCircle}
          variant="warning"
        />
        <KPICard
          title="Balance"
          value={`$${formatCurrency(Math.abs(totals.balance))}`}
          icon={Scale}
          variant={totals.balance >= 0 ? "success" : "warning"}
        />
      </div>

      {/* Ingresos */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ingresos
          </h2>
          <span className="ml-auto text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            ${formatCurrency(totals.ingresos)}
          </span>
        </div>
        {payments.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            Sin pagos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Evento</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Cliente</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Método</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Monto</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-3 text-muted-foreground">
                      {formatDate(p.payment_date)}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">
                      #{p.booking?.id ?? "—"}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground">
                      {p.booking?.client
                        ? `${p.booking.client.name} ${p.booking.client.lastName}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {methodLabel[p.payment_method] ?? p.payment_method}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                      +${formatCurrency(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Egresos */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Egresos
          </h2>
          <span className="ml-auto text-sm font-bold tabular-nums text-red-600 dark:text-red-400">
            -${formatCurrency(totals.egresos)}
          </span>
        </div>
        {bills.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            Sin gastos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">Descripción</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Pagado por</th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Método</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">Monto</th>
                </tr>
              </thead>
              <tbody>
                {(bills as {id: number; name: string; paid_by: string; paid_with: string; amount: number}[]).map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-3">{b.name}</td>
                    <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">
                      {b.paid_by}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground">
                      {methodLabel[b.paid_with] ?? b.paid_with}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-red-600 dark:text-red-400">
                      -${formatCurrency(b.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Balance final */}
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border px-6 py-4 text-sm font-semibold shadow-sm",
          totals.balance >= 0
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
            : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
        )}
      >
        <span className="text-foreground">Balance neto</span>
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            totals.balance >= 0
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-red-700 dark:text-red-400"
          )}
        >
          {totals.balance >= 0 ? "+" : "-"}${formatCurrency(Math.abs(totals.balance))}
        </span>
      </div>
    </CategoryLayout>
  );
}
