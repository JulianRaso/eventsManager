import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pdf } from "@react-pdf/renderer";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  CheckCircle2,
  DollarSign,
  FileDown,
  Plus,
  UserCircle,
} from "lucide-react";
import CategoryLayout from "../../components/CategoryLayout";
import Spinner from "../../components/Spinner";
import PersonalReportGeneralPDF from "../../components/PersonalReportGeneralPDF";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { KPICard } from "../../components/ui/KPICard";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { formatCurrency } from "../../utils/formatCurrency";
import usePersonalBalances from "../../hooks/usePersonalBalances";
import useGetPersonal from "../../hooks/useGetPersonal";
import { getPersonalRoles } from "../../services/personalRoles";
import type { PersonaledProps } from "../../types";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

type SortColumn = "name" | "role" | "trabajos" | "adeudado" | "pagado" | "saldo";
type SortDir = "asc" | "desc";

function SortableTh({
  label,
  column,
  sortColumn,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  column: SortColumn;
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (column: SortColumn) => void;
  align?: "left" | "center" | "right";
}) {
  const active = sortColumn === column;
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;

  return (
    <th
      className={cn(
        "px-4 py-3 font-medium text-muted-foreground",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right"
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md transition-colors hover:text-foreground",
          align === "right" && "flex-row-reverse",
          align === "center" && "justify-center",
          active && "text-foreground"
        )}
      >
        {label}
        <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? "opacity-100" : "opacity-40")} />
      </button>
    </th>
  );
}

export default function PersonalReport() {
  const navigate = useNavigate();
  const { staff, isLoading, addPayment, isAddingPayment } = usePersonalBalances(true);
  const { data: personalList = [] } = useGetPersonal();
  const [search, setSearch] = useState("");
  const [onlyDebt, setOnlyDebt] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>("saldo");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payPersonalId, setPayPersonalId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payMethod, setPayMethod] = useState<"cash" | "transfer" | "card" | "bank_check">("transfer");
  const [payNotes, setPayNotes] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    setSortDir(column === "name" || column === "role" ? "asc" : "desc");
  }

  function openPayDialog() {
    const first = personalList[0] as PersonaledProps | undefined;
    setPayPersonalId(first ? String(first.id) : "");
    setPayAmount("");
    setPayDate(new Date().toISOString().slice(0, 10));
    setPayMethod("transfer");
    setPayNotes("");
    setPayDialogOpen(true);
  }

  async function handleSubmitPayment() {
    const pid = Number(payPersonalId);
    const amt = Number(payAmount);
    if (!pid || !amt || amt <= 0) return;
    await addPayment({
      personal_id: pid,
      amount: amt,
      payment_date: payDate,
      payment_method: payMethod,
      notes: payNotes.trim() || undefined,
    });
    setPayDialogOpen(false);
  }

  const { data: personalRoles = [] } = useQuery({
    queryKey: ["personal_roles"],
    queryFn: () => getPersonalRoles({ includeInactive: true }),
  });

  const roleLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const r of personalRoles) map[r.code] = r.label;
    return map;
  }, [personalRoles]);

  const filtered = useMemo(() => {
    const rows = staff.filter((s) => {
      const matchSearch =
        !search ||
        `${s.name} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        String(s.personalId).includes(search);
      const matchDebt = !onlyDebt || s.saldo > 0;
      return matchSearch && matchDebt;
    });

    const fullName = (s: (typeof staff)[number]) =>
      `${s.lastName ?? ""} ${s.name ?? ""}`.trim().toLowerCase();

    const roleLabel = (s: (typeof staff)[number]) =>
      (roleLabels[s.role] ?? s.role ?? "").toLowerCase();

    const dir = sortDir === "asc" ? 1 : -1;
    const num = (n: number | null | undefined) => Number(n) || 0;

    return [...rows].sort((a, b) => {
      switch (sortColumn) {
        case "name":
          return dir * fullName(a).localeCompare(fullName(b), "es");
        case "role": {
          const byRole = roleLabel(a).localeCompare(roleLabel(b), "es");
          return dir * (byRole || fullName(a).localeCompare(fullName(b), "es"));
        }
        case "trabajos":
          return dir * (num(a.trabajos) - num(b.trabajos));
        case "adeudado":
          return dir * (num(a.totalAdeudado) - num(b.totalAdeudado));
        case "pagado":
          return dir * (num(a.totalPagado) - num(b.totalPagado));
        case "saldo":
        default:
          return dir * (num(a.saldo) - num(b.saldo));
      }
    });
  }, [staff, search, onlyDebt, sortColumn, sortDir, roleLabels]);

  const totals = useMemo(() => {
    return {
      people: staff.length,
      withDebt: staff.filter((s) => s.saldo > 0).length,
      totalAdeudado: staff.reduce((sum, s) => sum + s.totalAdeudado, 0),
      totalSaldo: staff.reduce((sum, s) => sum + s.saldo, 0),
    };
  }, [staff]);

  const pdfSummary = useMemo(() => {
    return {
      people: filtered.length,
      withDebt: filtered.filter((s) => s.saldo > 0).length,
      totalAdeudado: filtered.reduce((sum, s) => sum + s.totalAdeudado, 0),
      totalPagado: filtered.reduce((sum, s) => sum + s.totalPagado, 0),
      totalSaldo: filtered.reduce((sum, s) => sum + s.saldo, 0),
    };
  }, [filtered]);

  const pdfRows = useMemo(() => {
    return filtered.map((s) => ({
      name: s.name,
      lastName: s.lastName,
      roleLabel: roleLabels[s.role] ?? s.role,
      trabajos: s.trabajos,
      totalAdeudado: s.totalAdeudado,
      totalPagado: s.totalPagado,
      saldo: s.saldo,
    }));
  }, [filtered, roleLabels]);

  async function handleExportPdf() {
    if (pdfRows.length === 0 || exportingPdf) return;
    setExportingPdf(true);
    try {
      const blob = await pdf(
        <PersonalReportGeneralPDF
          generatedAtIso={new Date().toISOString()}
          summary={pdfSummary}
          rows={pdfRows}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-personal-general-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportingPdf(false);
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Reporte de personal">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="En reporte" value={totals.people} icon={UserCircle} variant="primary" />
        <KPICard title="Con saldo pendiente" value={totals.withDebt} icon={AlertCircle} variant="warning" />
        <KPICard
          title="Total adeudado (trabajos)"
          value={`$${formatCurrency(totals.totalAdeudado)}`}
          icon={DollarSign}
          variant="info"
        />
        <KPICard
          title="Saldo total pendiente"
          value={`$${formatCurrency(totals.totalSaldo)}`}
          icon={CheckCircle2}
          variant={totals.totalSaldo > 0 ? "warning" : "success"}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          placeholder="Buscar por nombre o ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full lg:max-w-sm"
        />
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button type="button" variant="default" size="sm" className="gap-1" onClick={openPayDialog}>
            <Plus className="h-4 w-4" />
            Registrar pago
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={pdfRows.length === 0 || exportingPdf}
            onClick={() => void handleExportPdf()}
          >
            <FileDown className="h-4 w-4" />
            {exportingPdf ? "Generando…" : "Exportar PDF"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOnlyDebt((v) => !v)}
            className={cn(
              "gap-1.5",
              onlyDebt &&
                "border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
            )}
          >
            <AlertCircle className="h-4 w-4" />
            {onlyDebt ? "Solo con deuda" : "Solo deuda"}
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <BarChart3 className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Sin datos para mostrar</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No hay personal con movimientos en cuenta corriente o el filtro no coincide.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <SortableTh
                  label="Personal"
                  column="name"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableTh
                  label="Rol"
                  column="role"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortableTh
                  label="Trabajos"
                  column="trabajos"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSort}
                  align="center"
                />
                <SortableTh
                  label="Adeudado"
                  column="adeudado"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSort}
                  align="right"
                />
                <SortableTh
                  label="Pagado"
                  column="pagado"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSort}
                  align="right"
                />
                <SortableTh
                  label="Saldo"
                  column="saldo"
                  sortColumn={sortColumn}
                  sortDir={sortDir}
                  onSort={handleSort}
                  align="right"
                />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.personalId}
                  className="cursor-pointer border-b border-border transition-colors hover:bg-muted/25"
                  onClick={() => navigate(`/reporte-personal/${row.personalId}`)}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.name} {row.lastName}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">#{row.personalId}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {roleLabels[row.role] ?? row.role}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">{row.trabajos}</td>
                  <td className="px-4 py-3 text-right tabular-nums">${formatCurrency(row.totalAdeudado)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                    ${formatCurrency(row.totalPagado)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    <span
                      className={
                        row.saldo > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      ${formatCurrency(row.saldo)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
            Tocá una fila para ver eventos, montos por trabajo y pagos registrados. Tocá un encabezado para ordenar.
          </p>
        </div>
      )}

      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar pago al personal</DialogTitle>
            <DialogDescription>
              El importe se descuenta del saldo global adeudado por trabajos en eventos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-foreground">Persona</label>
              <select
                className={selectClass}
                value={payPersonalId}
                onChange={(e) => setPayPersonalId(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {(personalList as PersonaledProps[]).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-foreground">Importe</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-foreground">Fecha</label>
              <Input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-foreground">Medio de pago</label>
              <select
                className={selectClass}
                value={payMethod}
                onChange={(e) =>
                  setPayMethod(e.target.value as "cash" | "transfer" | "card" | "bank_check")
                }
              >
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
                <option value="card">Tarjeta</option>
                <option value="bank_check">Cheque</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-foreground">Notas (opcional)</label>
              <Input
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="Referencia, período…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPayDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmitPayment()}
              disabled={
                isAddingPayment || !payPersonalId || !payAmount || Number(payAmount) <= 0
              }
            >
              {isAddingPayment ? "Guardando…" : "Guardar pago"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CategoryLayout>
  );
}
