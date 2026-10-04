import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Banknote, CreditCard, DollarSign, ArrowRightLeft } from "lucide-react";
import CategoryLayout from "@/components/CategoryLayout";
import Spinner from "@/components/Spinner";
import { KPICard } from "@/components/ui/KPICard";
import { getAllPayments } from "@/services/bookingPayments";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/components/formatDate";

const methodLabel: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
};

export default function Recaudacion() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["allPayments"],
    queryFn: getAllPayments,
  });

  const totals = useMemo(() => {
    const sum = (method?: string) =>
      data
        .filter((p) => (method ? p.payment_method === method : true))
        .reduce((acc, p) => acc + p.amount, 0);
    return {
      total: sum(),
      cash: sum("cash"),
      transfer: sum("transfer"),
      card: sum("card"),
    };
  }, [data]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Recaudación">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard
          title="Total recaudado"
          value={`$${formatCurrency(totals.total)}`}
          icon={DollarSign}
          variant="primary"
        />
        <KPICard
          title="Efectivo"
          value={`$${formatCurrency(totals.cash)}`}
          icon={Banknote}
          variant="success"
        />
        <KPICard
          title="Transferencia"
          value={`$${formatCurrency(totals.transfer)}`}
          icon={ArrowRightLeft}
          variant="info"
        />
        <KPICard
          title="Tarjeta"
          value={`$${formatCurrency(totals.card)}`}
          icon={CreditCard}
          variant="warning"
        />
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <DollarSign className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Sin pagos registrados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Los pagos se registran desde cada evento.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Evento</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Organización</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Método</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDate(p.payment_date)}
                  </td>
                  <td className="px-5 py-3">
                    #{p.booking?.id ?? "—"}
                    {p.booking?.event_date && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {formatDate(p.booking.event_date)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">
                    {p.booking?.client
                      ? `${p.booking.client.name} ${p.booking.client.lastName}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground">
                    {p.booking?.organization ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {methodLabel[p.payment_method] ?? p.payment_method}
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">
                    ${formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/20">
                <td colSpan={5} className="px-5 py-3 text-sm font-semibold text-foreground">
                  Total
                </td>
                <td className="px-5 py-3 text-right font-bold tabular-nums text-foreground">
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
