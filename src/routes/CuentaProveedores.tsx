import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2, Building2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { formatDate } from "../components/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { useGetPurchases } from "../hooks/usePurchases";
import { useGetSuppliers } from "../hooks/useSuppliers";

interface SupplierBalance {
  supplierId: number | null;
  supplierName: string;
  comprobantes: number;
  totalComprado: number;
  totalPagado: number;
  saldo: number;
  purchases: {
    id: number;
    description: string;
    purchase_date: string;
    payment_status: string;
    totalComprado: number;
    totalPagado: number;
    saldo: number;
  }[];
}

export default function CuentaProveedores() {
  const navigate = useNavigate();
  const { purchases, isLoading } = useGetPurchases();
  const { suppliers } = useGetSuppliers();
  const [search, setSearch] = useState("");
  const [onlyDebt, setOnlyDebt] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpand(key: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const balances = useMemo((): SupplierBalance[] => {
    const map = new Map<string, SupplierBalance>();

    purchases.forEach((p) => {
      const key = String(p.supplier_id ?? "sin-proveedor");
      const supplierName = suppliers.find(s => s.id === p.supplier_id)?.name ?? "Sin proveedor";
      const totalPagado = (p.purchase_payments ?? []).reduce((s, x) => s + x.amount, 0);
      const saldo = p.total_price - totalPagado;

      if (!map.has(key)) {
        map.set(key, {
          supplierId: p.supplier_id,
          supplierName,
          comprobantes: 0,
          totalComprado: 0,
          totalPagado: 0,
          saldo: 0,
          purchases: [],
        });
      }

      const entry = map.get(key)!;
      entry.comprobantes += 1;
      entry.totalComprado += p.total_price;
      entry.totalPagado += totalPagado;
      entry.saldo += saldo;
      entry.purchases.push({
        id: p.id!,
        description: p.description || `Comprobante #${p.id}`,
        purchase_date: p.purchase_date,
        payment_status: p.payment_status,
        totalComprado: p.total_price,
        totalPagado,
        saldo,
      });
    });

    return Array.from(map.values()).sort((a, b) => b.saldo - a.saldo);
  }, [purchases, suppliers]);

  const filtered = useMemo(() => {
    return balances.filter(b => {
      const matchSearch = !search || b.supplierName.toLowerCase().includes(search.toLowerCase());
      const matchDebt = !onlyDebt || b.saldo > 0;
      return matchSearch && matchDebt;
    });
  }, [balances, search, onlyDebt]);

  const totals = useMemo(() => ({
    suppliers: balances.length,
    withDebt: balances.filter(b => b.saldo > 0).length,
    totalComprado: balances.reduce((s, b) => s + b.totalComprado, 0),
    totalSaldo: balances.reduce((s, b) => s + b.saldo, 0),
  }), [balances]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Cuenta Corriente Proveedores">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Proveedores" value={totals.suppliers} icon={Building2} variant="primary" />
        <KPICard title="Con deuda" value={totals.withDebt} icon={AlertCircle} variant="warning" />
        <KPICard title="Total comprado" value={`$${formatCurrency(totals.totalComprado)}`} icon={DollarSign} variant="info" />
        <KPICard title="Saldo a pagar" value={`$${formatCurrency(totals.totalSaldo)}`} icon={CheckCircle2} variant={totals.totalSaldo > 0 ? "warning" : "success"} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input placeholder="Buscar proveedor..." value={search} onChange={e => setSearch(e.target.value)} className="sm:max-w-sm" />
        <button
          type="button"
          onClick={() => setOnlyDebt(v => !v)}
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
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-8 px-3 py-3" />
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Proveedor</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Comprobantes</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Comprado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Pagado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const key = String(b.supplierId ?? "sin-proveedor");
                const isOpen = expanded.has(key);
                return (
                  <>
                    <tr key={key} className="cursor-pointer border-b border-border hover:bg-muted/20 transition-colors" onClick={() => toggleExpand(key)}>
                      <td className="px-3 py-3 text-muted-foreground">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{b.supplierName}</td>
                      <td className="px-4 py-3 text-center tabular-nums">{b.comprobantes}</td>
                      <td className="px-4 py-3 text-right tabular-nums">${formatCurrency(b.totalComprado)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">${formatCurrency(b.totalPagado)}</td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        <span className={b.saldo > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>
                          ${formatCurrency(b.saldo)}
                        </span>
                      </td>
                    </tr>
                    {isOpen && b.purchases.map((p) => (
                      <tr key={p.id} className="border-b border-border bg-muted/10 last:border-0">
                        <td className="px-3 py-2" />
                        <td className="px-4 py-2 pl-8 text-muted-foreground">
                          <span>{formatDate(p.purchase_date)}</span>
                          <span className="ml-2 text-xs">· {p.description}</span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            p.payment_status === "paid" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                            p.payment_status === "partially_paid" ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" :
                            "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          )}>
                            {p.payment_status === "paid" ? "Pagado" : p.payment_status === "partially_paid" ? "Parcial" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">${formatCurrency(p.totalComprado)}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">${formatCurrency(p.totalPagado)}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={cn("font-medium tabular-nums", p.saldo > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                              ${formatCurrency(p.saldo)}
                            </span>
                            <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs"
                              onClick={(e) => { e.stopPropagation(); navigate(`/compras/${p.id}`); }}>
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
                <td colSpan={3} className="px-4 py-3 font-semibold text-foreground">Total</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">${formatCurrency(totals.totalComprado)}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  ${formatCurrency(totals.totalComprado - totals.totalSaldo)}
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
