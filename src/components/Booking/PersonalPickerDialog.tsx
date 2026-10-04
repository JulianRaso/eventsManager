import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Filter from "../Filter";
import MiniSpinner from "../MiniSpinner";
import { Button } from "../ui/button";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import type { PersonaledProps } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";

const roleLabels: Record<string, string> = {
  tecnico: "Técnico",
  sonidista: "Sonidista",
  iluminador: "Iluminador",
  chofer: "Chofer",
  operario: "Operario",
  asistente: "Asistente",
  coordinador: "Coordinador",
  otro: "Otro",
};

export type PersonalPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personalList: PersonaledProps[];
  assignedIds?: number[];
  isLoading?: boolean;
  isAdding?: boolean;
  onAdd: (item: {
    personal_id: number;
    display_name: string;
    role: string;
    days: number;
    rate: number;
  }) => void;
};

export default function PersonalPickerDialog({
  open,
  onOpenChange,
  personalList,
  assignedIds = [],
  isLoading = false,
  isAdding = false,
  onAdd,
}: PersonalPickerDialogProps) {
  const [roleFilter, setRoleFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [daysById, setDaysById] = useState<Record<number, string>>({});
  const [rateById, setRateById] = useState<Record<number, string>>({});

  const roleOptions = useMemo(() => {
    const roles = new Set(personalList.map((p) => p.role).filter(Boolean));
    return [...roles]
      .sort((a, b) =>
        (roleLabels[a] ?? a).localeCompare(roleLabels[b] ?? b, "es")
      )
      .map((role) => ({
        value: role,
        label: roleLabels[role] ?? role,
      }));
  }, [personalList]);

  const filtered = personalList.filter((p) => {
    const matchRole = roleFilter === "all" || p.role === roleFilter;
    const fullName = `${p.name} ${p.lastName}`.toLowerCase();
    const matchText = fullName.includes(nameFilter.toLowerCase());
    return matchRole && matchText;
  });

  function handleAdd(p: PersonaledProps) {
    const days = Number(daysById[p.id] ?? 1);
    const rate = Number(rateById[p.id] ?? p.daily_rate);
    if (days <= 0 || rate < 0) return;
    onAdd({
      personal_id: p.id,
      display_name: `${p.name} ${p.lastName}`,
      role: p.role,
      days,
      rate,
    });
    setDaysById((prev) => ({ ...prev, [p.id]: "" }));
    setRateById((prev) => ({ ...prev, [p.id]: "" }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] overflow-hidden sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Asignar personal</DialogTitle>
        </DialogHeader>

        <div className="flex min-w-0 flex-col gap-3">
          <Filter
            filterByStatus={roleOptions}
            value={roleFilter === "all" ? "" : roleFilter}
            setValue={(v) => setRoleFilter(v || "all")}
            filterByName={nameFilter}
            setFilterByName={setNameFilter}
            filterLabel="Filtrar por rol..."
            className="min-w-0"
          />

          <div className="max-h-96 min-w-0 overflow-auto rounded-md border border-border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <MiniSpinner />
              </div>
            ) : filtered.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Sin resultados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] text-sm">
                  <thead className="sticky top-0 z-10 bg-card">
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="min-w-[12rem] px-3 py-2 font-medium">
                        Personal
                      </th>
                      <th className="w-36 px-3 py-2 font-medium">Rol</th>
                      <th className="w-28 px-3 py-2 font-medium text-right">
                        Tarifa base
                      </th>
                      <th className="w-24 px-3 py-2 font-medium text-right">
                        Días
                      </th>
                      <th className="w-28 px-3 py-2 font-medium text-right">
                        Tarifa/día
                      </th>
                      <th className="w-28 px-3 py-2 font-medium text-right">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((p) => {
                      const alreadyAdded = assignedIds.includes(p.id);
                      const days = Number(daysById[p.id] ?? 0);
                      const rate = Number(rateById[p.id] ?? 0);
                      const canAdd =
                        !alreadyAdded &&
                        !isAdding &&
                        (daysById[p.id] ? days > 0 : true) &&
                        (rateById[p.id] ? rate >= 0 : true);

                      return (
                        <tr
                          key={p.id}
                          className={
                            alreadyAdded ? "opacity-40" : "hover:bg-muted/30"
                          }
                        >
                          <td className="max-w-0 truncate px-3 py-2 font-medium">
                            {p.name} {p.lastName}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {roleLabels[p.role] ?? p.role}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                            ${formatCurrency(p.daily_rate)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Input
                              type="number"
                              min={1}
                              placeholder="1"
                              className="h-7 w-full min-w-0 text-right"
                              disabled={alreadyAdded}
                              value={daysById[p.id] ?? ""}
                              onChange={(e) =>
                                setDaysById((prev) => ({
                                  ...prev,
                                  [p.id]: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Input
                              type="number"
                              min={0}
                              placeholder={String(p.daily_rate)}
                              className="h-7 w-full min-w-0 text-right"
                              disabled={alreadyAdded}
                              value={rateById[p.id] ?? ""}
                              onChange={(e) =>
                                setRateById((prev) => ({
                                  ...prev,
                                  [p.id]: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="default"
                              className="h-8 gap-1 px-2.5 text-xs"
                              disabled={!canAdd}
                              onClick={() => handleAdd(p)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              {alreadyAdded ? "Agregado" : "Asignar"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
