import { useState } from "react";
import { ArrowLeft, Plus, Trash2, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { formatDate } from "../components/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import {
  useGetPurchaseDetail,
  useGetPurchaseItems,
  useManagePurchaseItems,
  useGetPurchasePayments,
  useManagePurchasePayments,
} from "../hooks/usePurchases";
import { useGetSuppliers } from "../hooks/useSuppliers";
import { getInventory } from "../services/stock";
import { useQuery } from "@tanstack/react-query";

const paymentMethodLabel: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  bank_check: "Cheque",
};

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  partially_paid: { label: "Parcial", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  paid: { label: "Pagado", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
};

const selectClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function CompraDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const purchaseId = Number(id);

  const { purchase, isLoading: loadingPurchase } = useGetPurchaseDetail(purchaseId);
  const { items } = useGetPurchaseItems(purchaseId);
  const { addItem, removeItem, isRemoving } = useManagePurchaseItems(purchaseId);
  const { payments } = useGetPurchasePayments(purchaseId);
  const { addPayment, removePayment, isAddingPayment, isRemovingPayment } = useManagePurchasePayments(purchaseId);
  const { suppliers } = useGetSuppliers();

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventory(),
  });

  // Item form
  const [itemEquipmentId, setItemEquipmentId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [itemPrice, setItemPrice] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);

  // Payment form
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "transfer" | "card" | "bank_check">("cash");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payNotes, setPayNotes] = useState("");
  const [showPayForm, setShowPayForm] = useState(false);

  if (loadingPurchase) return <Spinner />;
  if (!purchase) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Comprobante no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/compras")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  const totalPagado = payments.reduce((s, p) => s + p.amount, 0);
  const saldo = purchase.total_price - totalPagado;
  const status = paymentStatusConfig[purchase.payment_status] ?? { label: purchase.payment_status, className: "" };
  const supplierName = (purchase.suppliers as { name: string } | null)?.name ?? suppliers.find(s => s.id === purchase.supplier_id)?.name ?? "—";

  function handleAddItem() {
    const eqId = itemEquipmentId ? Number(itemEquipmentId) : null;
    const name = eqId
      ? (inventory.find(i => i.id === eqId)?.name ?? itemName)
      : itemName;
    if (!name) return;
    addItem({
      purchase_id: purchaseId,
      equipment_id: eqId,
      name,
      quantity: Number(itemQty) || 1,
      unit_price: Number(itemPrice) || 0,
    });
    setItemEquipmentId(""); setItemName(""); setItemQty("1"); setItemPrice("");
    setShowItemForm(false);
  }

  function handleAddPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!payAmount) return;
    addPayment({
      purchase_id: purchaseId,
      amount: Number(payAmount),
      payment_method: payMethod,
      payment_date: payDate,
      notes: payNotes || undefined,
    });
    setPayAmount(""); setPayNotes(""); setShowPayForm(false);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 md:p-6">
      {/* Back */}
      <Button variant="ghost" className="w-fit text-muted-foreground" onClick={() => navigate("/compras")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Comprobantes
      </Button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {supplierName}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">
              {purchase.description || `Comprobante #${purchaseId}`}
            </h1>
          </div>
          <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", status.className)}>
            {status.label}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{formatDate(purchase.purchase_date)}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-base font-bold text-foreground">${formatCurrency(purchase.total_price)}</span>
          </div>
        </div>
      </div>

      {/* Artículos */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-semibold text-foreground">Artículos</h2>
          <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => setShowItemForm(v => !v)}>
            <Plus className="h-3.5 w-3.5" /> Agregar
          </Button>
        </div>

        {showItemForm && (
          <div className="border-b border-border bg-muted/20 px-5 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <p className="mb-1 text-xs text-muted-foreground">Artículo del inventario (opcional)</p>
                <select
                  className={selectClass}
                  value={itemEquipmentId}
                  onChange={(e) => {
                    setItemEquipmentId(e.target.value);
                    const found = inventory.find(i => String(i.id) === e.target.value);
                    if (found) setItemName(found.name);
                  }}
                >
                  <option value="">— Libre (sin inventario) —</option>
                  {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              {!itemEquipmentId && (
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs text-muted-foreground">Nombre</p>
                  <Input placeholder="Nombre del artículo" value={itemName} onChange={e => setItemName(e.target.value)} />
                </div>
              )}
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Cantidad</p>
                <Input type="number" min={1} value={itemQty} onChange={e => setItemQty(e.target.value)} />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Precio unit.</p>
                <Input type="number" min={0} step="0.01" placeholder="0.00" value={itemPrice} onChange={e => setItemPrice(e.target.value)} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button type="button" size="sm" onClick={handleAddItem}>Agregar</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowItemForm(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Sin artículos agregados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Artículo</th>
                <th className="px-5 py-3 text-center font-medium text-muted-foreground">Cantidad</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Precio unit.</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Total</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-foreground">{item.name}</td>
                  <td className="px-5 py-3 text-center tabular-nums">{item.quantity}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">${formatCurrency(item.unit_price)}</td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">${formatCurrency(item.quantity * item.unit_price)}</td>
                  <td className="px-5 py-3 text-right">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      disabled={isRemoving} onClick={() => item.id && removeItem(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/20">
                <td colSpan={3} className="px-5 py-3 font-semibold text-foreground">Total artículos</td>
                <td className="px-5 py-3 text-right font-bold tabular-nums">
                  ${formatCurrency(items.reduce((s, i) => s + i.quantity * i.unit_price, 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Pagos */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-semibold text-foreground">Pagos al proveedor</h2>
          <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => setShowPayForm(v => !v)}>
            <CreditCard className="h-3.5 w-3.5" /> Registrar pago
          </Button>
        </div>

        {showPayForm && (
          <form onSubmit={handleAddPayment} className="border-b border-border bg-muted/20 px-5 py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Monto</p>
                <Input type="number" min={0} step="0.01" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} required />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Método</p>
                <select className={selectClass} value={payMethod} onChange={e => setPayMethod(e.target.value as typeof payMethod)}>
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="card">Tarjeta</option>
                  <option value="bank_check">Cheque</option>
                </select>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Fecha</p>
                <Input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Notas</p>
                <Input placeholder="Notas" value={payNotes} onChange={e => setPayNotes(e.target.value)} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button type="submit" size="sm" disabled={isAddingPayment}>
                {isAddingPayment ? "Guardando..." : "Confirmar"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowPayForm(false)}>Cancelar</Button>
            </div>
          </form>
        )}

        {payments.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">Sin pagos registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Método</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Notas</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Monto</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-foreground">{formatDate(p.payment_date)}</td>
                  <td className="px-5 py-3 text-foreground">{paymentMethodLabel[p.payment_method] ?? p.payment_method}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{p.notes ?? "—"}</td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums">${formatCurrency(p.amount)}</td>
                  <td className="px-5 py-3 text-right">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      disabled={isRemovingPayment} onClick={() => removePayment(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Resumen */}
        <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-4">
          <div className="flex flex-col gap-1.5 text-sm w-64">
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Total comprobante</span>
              <span className="tabular-nums">${formatCurrency(purchase.total_price)}</span>
            </div>
            <div className="flex justify-between gap-8">
              <span className="text-muted-foreground">Total pagado</span>
              <span className="tabular-nums text-emerald-600 dark:text-emerald-400">${formatCurrency(totalPagado)}</span>
            </div>
            <div className="flex justify-between gap-8 border-t border-border pt-1.5">
              <span className="font-semibold text-foreground">Saldo pendiente</span>
              <span className={cn("font-bold tabular-nums", saldo > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                ${formatCurrency(Math.max(0, saldo))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
