import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Pencil, Power, PowerOff } from "lucide-react";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  activatePersonalRole,
  addPersonalRole,
  deactivatePersonalRole,
  getPersonalRoles,
  updatePersonalRole,
  type PersonalRoleRow,
} from "../services/personalRoles";

type FormValues = {
  code: string;
  label: string;
  sort_order: number;
};

const labelClass = "text-sm font-medium text-foreground";

export default function PersonalRoles() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<PersonalRoleRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["personal_roles"],
    queryFn: () => getPersonalRoles({ includeInactive: true }),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.label.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormValues>({
      defaultValues: { code: "", label: "", sort_order: 0 },
    });

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    reset({ code: "", label: "", sort_order: 0 });
  };

  const { isPending: isSaving, mutate: saveRole } = useMutation({
    mutationFn: async (values: FormValues) => {
      if (editTarget) {
        return updatePersonalRole(editTarget.id, {
          code: values.code,
          label: values.label,
          sort_order: Number(values.sort_order) || 0,
        });
      }
      return addPersonalRole({
        code: values.code,
        label: values.label,
        sort_order: Number(values.sort_order) || 0,
      });
    },
    onSuccess: () => {
      toast.success(editTarget ? "Rol actualizado" : "Rol creado");
      queryClient.invalidateQueries({ queryKey: ["personal_roles"] });
      closeForm();
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const { isPending: isToggling, mutate: toggleActive } = useMutation({
    mutationFn: async (role: PersonalRoleRow) => {
      if (role.active) return deactivatePersonalRole(role.id);
      return activatePersonalRole(role.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal_roles"] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  function openNew() {
    reset({ code: "", label: "", sort_order: 0 });
    setShowForm(true);
  }

  function openEdit(role: PersonalRoleRow) {
    setEditTarget(role);
    reset({
      code: role.code,
      label: role.label,
      sort_order: role.sort_order ?? 0,
    });
  }

  function onSubmit(values: FormValues) {
    saveRole(values);
  }

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Roles de Personal">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button type="button" onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo rol
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <p className="text-lg font-medium text-foreground">
            {search ? "Sin resultados" : "No hay roles"}
          </p>
          {!search && (
            <Button type="button" onClick={openNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" /> Nuevo rol
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Código
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                  Orden
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {r.label}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">
                    {r.code}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell tabular-nums">
                    {r.sort_order ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        r.active
                          ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "inline-flex rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      }
                    >
                      {r.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(r)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isToggling}
                        onClick={() => toggleActive(r)}
                        className={
                          r.active
                            ? "text-destructive hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                            : ""
                        }
                      >
                        {r.active ? (
                          <>
                            <PowerOff className="mr-1 h-3.5 w-3.5" /> Desactivar
                          </>
                        ) : (
                          <>
                            <Power className="mr-1 h-3.5 w-3.5" /> Activar
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showForm || !!editTarget} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar rol" : "Nuevo rol"}</DialogTitle>
            <DialogDescription>
              El <strong>código</strong> es el valor que se guarda en el empleado (ej. <code>tecnico</code>).
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={labelClass}>
                Nombre <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ej: Técnico"
                {...register("label", { required: "Requerido" })}
              />
              {errors.label && (
                <p className="text-xs text-destructive">{errors.label.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>
                Código <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ej: tecnico"
                {...register("code", {
                  required: "Requerido",
                  validate: (v) =>
                    /^[a-z0-9_]+$/.test(v.trim()) ||
                    "Usá solo minúsculas, números y _",
                })}
              />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Orden</label>
              <Input
                type="number"
                step={1}
                {...register("sort_order", { valueAsNumber: true })}
              />
            </div>

            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : editTarget ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </CategoryLayout>
  );
}

