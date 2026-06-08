import { useState } from "react";
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
import type { AvailabilityItem } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";

const filterByCategory = [
  { value: "sound", label: "Sonido" },
  { value: "lights", label: "Iluminación" },
  { value: "ambientation", label: "Ambientación" },
  { value: "structure", label: "Estructuras" },
  { value: "cables", label: "Cables" },
  { value: "screen", label: "Pantalla" },
  { value: "furniture", label: "Muebles" },
  { value: "tools", label: "Herramientas" },
  { value: "others", label: "Otros" },
];

const eventTypeLabels: Record<string, string> = {
  other: "Otro",
  fifteen_party: "Quince Años",
  corporate: "Corporativo",
  marriage: "Casamiento",
  birthday: "Cumpleaños",
};

function formatTimeRange(start: string | null, end: string | null): string {
  if (!start && !end) return "sin horario";
  const s = start?.slice(0, 5) ?? "?";
  const e = end?.slice(0, 5) ?? "?";
  return `${s}–${e}`;
}

function formatConflictTooltip(item: AvailabilityItem): string | undefined {
  if (item.conflicts.length === 0) return undefined;
  return item.conflicts
    .map((c) => {
      const label = eventTypeLabels[c.event_type] ?? c.event_type;
      const place = c.place ? ` (${c.place})` : "";
      return `${c.quantity} u. en ${label}${place} ${formatTimeRange(c.start_time, c.end_time)}`;
    })
    .join("\n");
}

export type EquipmentPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: AvailabilityItem[];
  isLoading: boolean;
  hasIncompleteTimes: boolean;
  hasTimeContext: boolean;
  eventDate?: string;
  startTime?: string | null;
  endTime?: string | null;
  onAdd: (item: {
    equipment_id: number;
    name: string;
    quantity: number;
    price: number;
  }) => void;
  isAdding?: boolean;
};

export default function EquipmentPickerDialog({
  open,
  onOpenChange,
  availability,
  isLoading,
  hasIncompleteTimes,
  hasTimeContext,
  eventDate,
  startTime,
  endTime,
  onAdd,
  isAdding = false,
}: EquipmentPickerDialogProps) {
  const [equipCategory, setEquipCategory] = useState("all");
  const [equipFilter, setEquipFilter] = useState("");
  const [equipQty, setEquipQty] = useState<Record<number, string>>({});

  const filteredStock = availability.filter((item) => {
    const matchCat =
      equipCategory === "all" || item.category === equipCategory;
    const matchText = item.name
      .toLowerCase()
      .includes(equipFilter.toLowerCase());
    return matchCat && matchText;
  });

  function handleAdd(item: AvailabilityItem) {
    const qty = Number(equipQty[item.id] ?? 1);
    if (qty <= 0 || qty > item.available) return;
    onAdd({
      equipment_id: item.id,
      name: item.name,
      quantity: qty,
      price: item.price,
    });
    setEquipQty((prev) => ({ ...prev, [item.id]: "" }));
  }

  const slotLabel =
    hasTimeContext && eventDate
      ? `${eventDate} ${startTime?.slice(0, 5)}–${endTime?.slice(0, 5)}`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] overflow-hidden sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Agregar equipamiento</DialogTitle>
        </DialogHeader>

        {hasIncompleteTimes && (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            Sin hora de inicio y fin, los artículos asignados a otros eventos
            del mismo día se consideran ocupados todo el día. Completá los
            horarios para poder reutilizarlos.
          </div>
        )}

        {hasTimeContext && slotLabel && (
          <p className="text-sm text-muted-foreground">
            Disponibilidad calculada para{" "}
            <span className="font-medium text-foreground">{slotLabel}</span>.
            Los artículos de otros turnos del mismo día pueden reutilizarse si
            no se solapan.
          </p>
        )}

        {!eventDate && (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            Seleccioná la fecha del evento para calcular la disponibilidad
            correctamente.
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-3">
          <Filter
            filterByStatus={filterByCategory}
            value={equipCategory === "all" ? "" : equipCategory}
            setValue={(v) => setEquipCategory(v || "all")}
            filterByName={equipFilter}
            setFilterByName={setEquipFilter}
            filterLabel="Filtrar por categoría..."
            className="min-w-0"
          />
          <div className="max-h-96 min-w-0 overflow-auto rounded-md border border-border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <MiniSpinner />
              </div>
            ) : filteredStock.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Sin resultados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[52rem] text-sm">
                  <thead className="sticky top-0 z-10 bg-card">
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="min-w-[10rem] px-3 py-2 font-medium">
                        Artículo
                      </th>
                      <th className="w-14 px-3 py-2 font-medium text-right">
                        Stock
                      </th>
                      <th
                        className="w-20 px-3 py-2 font-medium text-right"
                        title="Unidades reservadas en eventos que se solapan con tu horario"
                      >
                        Ocupado
                      </th>
                      <th className="w-14 px-3 py-2 font-medium text-right">
                        Disp.
                      </th>
                      <th
                        className="w-32 px-3 py-2 font-medium text-center"
                        title="Unidades en otro evento del mismo día cuyo horario no se pisa con el tuyo"
                      >
                        Otro turno
                      </th>
                      <th className="w-20 px-3 py-2 font-medium text-right">
                        Precio
                      </th>
                      <th className="w-20 px-3 py-2 font-medium text-right">
                        Cant.
                      </th>
                      <th className="w-28 px-3 py-2 font-medium text-right">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStock.map((item) => {
                      const qty = Number(equipQty[item.id] ?? 0);
                      const canAdd =
                        item.available > 0 &&
                        qty > 0 &&
                        qty <= item.available &&
                        !isAdding;

                      return (
                        <tr
                          key={item.id}
                          className={
                            item.available === 0
                              ? "opacity-40"
                              : "hover:bg-muted/30"
                          }
                        >
                          <td className="max-w-0 truncate px-3 py-2">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                            {item.quantity}
                          </td>
                          <td
                            className="cursor-help px-3 py-2 text-right tabular-nums text-muted-foreground"
                            title={formatConflictTooltip(item)}
                          >
                            {item.allocatedInSlot}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium">
                            {item.available}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {item.reusableSameDay > 0 ? (
                              <span className="inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                                {item.reusableSameDay} otro turno
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            ${formatCurrency(item.price)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Input
                              type="number"
                              min={1}
                              max={item.available}
                              placeholder="1"
                              className="h-7 w-full min-w-0 text-right"
                              disabled={item.available === 0}
                              value={equipQty[item.id] ?? ""}
                              onChange={(e) =>
                                setEquipQty((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value,
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
                              onClick={() => handleAdd(item)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Agregar
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
