import { useState } from "react";
import { Building2, Pencil, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "../components/ui/dialog";
import { useGetSuppliers, useAddSupplier, useUpdateSupplier, useDeleteSupplier } from "../hooks/useSuppliers";
import { SupplierProps } from "../services/suppliers";

const labelClass = "text-sm font-medium text-foreground";

type FormValues = Omit<SupplierProps, "id" | "created_at">;

export default function Proveedores() {
  const { suppliers, isLoading } = useGetSuppliers();
  const { isDeleting, removeSupplier } = useDeleteSupplier();
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<SupplierProps | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SupplierProps | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const { isAdding, addSupplier } = useAddSupplier();
  const { isUpdating, editSupplier } = useUpdateSupplier();

  // Override navigate from hooks — use local close instead
  const closeForm = () => { setShowForm(false); setEditTarget(null); reset(); };

  const filtered = suppliers.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.tax_id ?? "").includes(search)
  );

  function openNew() { reset({}); setShowForm(true); }
  function openEdit(s: SupplierProps) { reset(s); setEditTarget(s); }

  function onSubmit(values: FormValues) {
    if (editTarget) {
      editSupplier({ ...editTarget, ...values });
    } else {
      addSupplier(values);
    }
    closeForm();
  }

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Proveedores">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Total" value={suppliers.length} icon={Building2} variant="primary" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por nombre o CUIT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button type="button" onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <Building2 className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {search ? "Sin resultados" : "No hay proveedores"}
          </p>
          {!search && (
            <Button type="button" onClick={openNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" /> Nuevo proveedor
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Contacto</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">CUIT</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{s.contact_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{s.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{s.tax_id || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                        <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
                      </Button>
                      <Button
                        variant="outline" size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(s)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog crear/editar */}
      <Dialog open={showForm || !!editTarget} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={labelClass}>Nombre <span className="text-destructive">*</span></label>
              <Input placeholder="Razón social" {...register("name", { required: "Requerido" })} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Contacto</label>
              <Input placeholder="Nombre de contacto" {...register("contact_name")} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Teléfono</label>
              <Input placeholder="Teléfono" {...register("phone")} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Email</label>
              <Input type="email" placeholder="email@proveedor.com" {...register("email")} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>CUIT</label>
              <Input placeholder="xx-xxxxxxxx-x" {...register("tax_id")} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={labelClass}>Dirección</label>
              <Input placeholder="Dirección" {...register("address")} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={labelClass}>Notas</label>
              <Input placeholder="Observaciones" {...register("notes")} />
            </div>
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={closeForm}>Cancelar</Button>
              <Button type="submit" disabled={isAdding || isUpdating}>
                {isAdding || isUpdating ? "Guardando..." : editTarget ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog confirmar eliminar */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar proveedor?</DialogTitle>
            <DialogDescription>
              Se eliminará <strong>{deleteTarget?.name}</strong>. Los comprobantes asociados quedarán sin proveedor asignado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="destructive" disabled={isDeleting}
              onClick={() => { if (deleteTarget?.id) { removeSupplier(deleteTarget.id); setDeleteTarget(null); } }}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CategoryLayout>
  );
}
