import { useState } from "react";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
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
  DialogDescription,
} from "../components/ui/dialog";
import {
  useGetAccounts,
  useAddAccount,
  useUpdateAccount,
  useDeleteAccount,
} from "../hooks/useAccountingAccounts";
import { AccountingAccount, NewAccount } from "../services/accountingAccounts";

const labelClass = "text-sm font-medium text-foreground";

export default function CuentasContables() {
  const { accounts, isLoading } = useGetAccounts();
  const { isDeleting, removeAccount } = useDeleteAccount();

  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<AccountingAccount | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AccountingAccount | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewAccount>();

  const { isAdding, addAccount } = useAddAccount(() => { setShowForm(false); reset(); });
  const { isUpdating, editAccount } = useUpdateAccount(() => { setEditTarget(null); reset(); });

  const filtered = accounts.filter(
    (a) =>
      !search ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    reset({ code: "", name: "" });
    setShowForm(true);
  }

  function openEdit(account: AccountingAccount) {
    reset({ code: account.code, name: account.name });
    setEditTarget(account);
  }

  function onSubmit(values: NewAccount) {
    if (editTarget) {
      editAccount({ ...editTarget, ...values });
    } else {
      addAccount(values);
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Cuentas Contables">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Total cuentas" value={accounts.length} icon={BookOpen} variant="primary" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button type="button" onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva cuenta
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {search ? "Sin resultados" : "No hay cuentas contables"}
          </p>
          {!search && (
            <Button type="button" onClick={openNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Nueva cuenta
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Código</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((account) => (
                <tr key={account.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-foreground">{account.code}</td>
                  <td className="px-4 py-3 text-foreground">{account.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(account)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(account)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog crear / editar */}
      <Dialog
        open={showForm || !!editTarget}
        onOpenChange={(open) => { if (!open) { setShowForm(false); setEditTarget(null); } }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar cuenta" : "Nueva cuenta contable"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Código <span className="text-destructive">*</span></label>
              <Input
                placeholder="ej. 111022"
                {...register("code", { required: "El código es requerido" })}
              />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Nombre <span className="text-destructive">*</span></label>
              <Input
                placeholder="ej. Venta sonido Gral"
                {...register("name", { required: "El nombre es requerido" })}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditTarget(null); }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isAdding || isUpdating}>
                {isAdding || isUpdating ? "Guardando..." : editTarget ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog confirmar eliminar */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar cuenta?</DialogTitle>
            <DialogDescription>
              Se eliminará <strong>{deleteTarget?.code} · {deleteTarget?.name}</strong>. Los artículos que la usaban quedarán sin cuenta asignada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => { if (deleteTarget) { removeAccount(deleteTarget.id); setDeleteTarget(null); } }}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CategoryLayout>
  );
}
