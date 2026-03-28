import { useMemo, useState } from "react";
import { ShoppingCart, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import { cn } from "../lib/utils";
import { formatDate } from "../components/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { useGetPurchases, useAddPurchase, useDeletePurchase } from "../hooks/usePurchases";
import { useGetSuppliers } from "../hooks/useSuppliers";
import { PurchaseProps } from "../services/purchases";
import TableButtons from "../components/TableButtons";

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  partially_paid: { label: "Parcial", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  paid: { label: "Pagado", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
};

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "text-sm font-medium text-foreground";

type NewPurchaseForm = Omit<PurchaseProps, "id" | "created_at" | "supplier" | "purchase_payments" | "payment_status">;

export default function OrdenCompra() {
const { purchases, isLoading } = useGetPurchases();
  const { suppliers } = useGetSuppliers();
  const { isDeleting, removePurchase } = useDeletePurchase();
  const { isAdding, addPurchase } = useAddPurchase();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewPurchaseForm>();

  const filtered = useMemo(() => {
    if (!search) return purchases;
    const q = search.toLowerCase();
    return purchases.filter(p =>
      (p.suppliers as { name: string } | null)?.name?.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
    );
  }, [purchases, search]);

  const totals = useMemo(() => ({
    total: purchases.length,
    pending: purchases.filter(p => p.payment_status === "pending").length,
    partial: purchases.filter(p => p.payment_status === "partially_paid").length,
    paid: purchases.filter(p => p.payment_status === "paid").length,
    totalAmount: purchases.reduce((s, p) => s + p.total_price, 0),
  }), [purchases]);

  function onSubmit(values: NewPurchaseForm) {
    addPurchase({ ...values, total_price: Number(values.total_price), payment_status: "pending" });
    setShowForm(false);
    reset();
  }

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Comprobantes de Compra">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Total" value={totals.total} icon={ShoppingCart} variant="primary" />
        <KPICard title="Pendientes" value={totals.pending} icon={Clock} variant="warning" />
        <KPICard title="Parciales" value={totals.partial} icon={AlertCircle} variant="info" />
        <KPICard title="Pagados" value={totals.paid} icon={CheckCircle2} variant="success" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por proveedor o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button type="button" onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo comprobante
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <ShoppingCart className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {search ? "Sin resultados" : "No hay comprobantes"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Proveedor</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Descripción</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const status = paymentStatusConfig[p.payment_status] ?? { label: p.payment_status, className: "" };
                const paidAmount = (p.purchase_payments ?? []).reduce((s, x) => s + x.amount, 0);
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {(p.suppliers as { name: string } | null)?.name ?? <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">
                      {p.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.purchase_date)}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">${formatCurrency(p.total_price)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", status.className)}>
                        {status.label}
                      </span>
                      {p.payment_status !== "paid" && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Pagado: ${formatCurrency(paidAmount)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <TableButtons
                        id={p.id!}
                        route="/compras"
                        viewRoute="/compras"
                        isDeleting={isDeleting}
                        onDelete={removePurchase}
                        deleteLabel="este comprobante"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td colSpan={3} className="px-4 py-3 font-semibold text-foreground">Total</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">${formatCurrency(totals.totalAmount)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Dialog nuevo comprobante */}
      <Dialog open={showForm} onOpenChange={(o) => { if (!o) { setShowForm(false); reset(); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo comprobante</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Proveedor</label>
              <select className={selectClass} {...register("supplier_id")}>
                <option value="">— Sin proveedor —</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Descripción</label>
              <Input placeholder="Descripción general de la compra" {...register("description")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Fecha <span className="text-destructive">*</span></label>
                <Input type="date" {...register("purchase_date", { required: "Requerido" })} />
                {errors.purchase_date && <p className="text-xs text-destructive">{errors.purchase_date.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Total <span className="text-destructive">*</span></label>
                <Input
                  type="number" min={0} step="0.01" placeholder="0.00"
                  {...register("total_price", { required: "Requerido", min: 0 })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Notas</label>
              <Input placeholder="Observaciones" {...register("notes")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset(); }}>Cancelar</Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CategoryLayout>
  );
}
