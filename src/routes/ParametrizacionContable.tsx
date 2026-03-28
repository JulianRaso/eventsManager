import { useState } from "react";
import { BookOpen, Pencil, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { cn } from "../lib/utils";
import { useGetItemAccounting, useUpsertItemAccounting } from "../hooks/useItemAccounting";
import { useGetAccounts } from "../hooks/useAccountingAccounts";
import { ItemAccountingProps } from "../services/itemAccounting";

const categoryLabels: Record<string, string> = {
  sound: "Sonido",
  lights: "Iluminación",
  ambientation: "Ambientación",
  structure: "Estructura",
  screen: "Pantalla",
  furniture: "Muebles",
  cables: "Cables",
  tools: "Herramientas",
  others: "Otros",
};

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

type FormValues = {
  purchase_account_id: string;
  sale_account_id: string;
};

export default function ParametrizacionContable() {
  const { data, isLoading: loadingItems } = useGetItemAccounting();
  const { accounts, isLoading: loadingAccounts } = useGetAccounts();
  const { isSaving, saveAccounting } = useUpsertItemAccounting();

  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<{ id: number; name: string } | null>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const filtered = data.filter(
    (item) =>
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabels[item.category]?.toLowerCase().includes(search.toLowerCase())
  );

  const assigned = data.filter((item) => item.item_accounting !== null).length;

  function openEdit(item: typeof data[0]) {
    setEditItem({ id: item.id, name: item.name });
    reset({
      purchase_account_id: item.item_accounting?.purchase_account_id
        ? String(item.item_accounting.purchase_account_id)
        : "",
      sale_account_id: item.item_accounting?.sale_account_id
        ? String(item.item_accounting.sale_account_id)
        : "",
    });
  }

  function onSubmit(values: FormValues) {
    if (!editItem) return;
    const payload: ItemAccountingProps = {
      equipment_id: editItem.id,
      purchase_account_id: values.purchase_account_id ? Number(values.purchase_account_id) : null,
      sale_account_id: values.sale_account_id ? Number(values.sale_account_id) : null,
    };
    saveAccounting(payload);
    setEditItem(null);
  }

  if (loadingItems || loadingAccounts) return <Spinner />;

  return (
    <CategoryLayout title="Parametrización Contable">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Artículos totales" value={data.length} icon={BookOpen} variant="primary" />
        <KPICard title="Parametrizados" value={assigned} icon={CheckCircle2} variant="success" />
        <KPICard title="Sin parametrizar" value={data.length - assigned} icon={AlertCircle} variant="warning" />
      </div>

      {accounts.length === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          No hay cuentas contables creadas. Creá las cuentas en <strong className="ml-1">Contabilidad → Cuentas Contables</strong> primero.
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Artículo</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Categoría</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cta. Compra</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cta. Venta</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const acc = item.item_accounting;
              return (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {categoryLabels[item.category] ?? item.category}
                  </td>
                  <td className="px-4 py-3">
                    {acc?.purchase_account ? (
                      <span className="text-xs">
                        <span className="font-mono font-semibold">{acc.purchase_account.code}</span>
                        <span className="ml-1.5 text-muted-foreground">· {acc.purchase_account.name}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {acc?.sale_account ? (
                      <span className="text-xs">
                        <span className="font-mono font-semibold">{acc.sale_account.code}</span>
                        <span className="ml-1.5 text-muted-foreground">· {acc.sale_account.name}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={accounts.length === 0}
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      {acc ? "Editar" : "Asignar"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dialog edición */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="truncate">{editItem?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Cuenta de Compra</label>
                <select className={cn(selectClass)} {...register("purchase_account_id")}>
                  <option value="">— Sin asignar —</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} · {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Cuenta de Venta</label>
                <select className={cn(selectClass)} {...register("sale_account_id")}>
                  <option value="">— Sin asignar —</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} · {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CategoryLayout>
  );
}
