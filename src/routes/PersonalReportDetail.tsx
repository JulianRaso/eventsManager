import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  ArrowLeft,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileDown,
  MapPin,
  Phone,
  UserCircle,
} from "lucide-react";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import { KPICard } from "../components/ui/KPICard";
import { cn } from "../lib/utils";
import { formatDate } from "../components/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import usePersonalReportDetail from "../hooks/usePersonalReportDetail";
import { getPersonalRoles } from "../services/personalRoles";
import type { PersonalAssignmentDetail } from "../services/personalReport";
import type { PersonaledProps } from "../types";
import PersonalReportDetailPDF from "../components/PersonalReportDetailPDF";
import type { PersonalReportDetailPDFProps } from "../components/PersonalReportDetailPDF";

const eventTypes: Record<string, string> = {
  other: "Otro",
  fifteen_party: "Quince años",
  corporate: "Corporativo",
  marriage: "Casamiento",
  birthday: "Cumpleaños",
};

const bookingStatusConfig: Record<string, { label: string; className: string }> = {
  confirm: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  pending: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  cancel: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

const paymentMethodLabel: Record<string, string> = {
  cash: "Efectivo",
  transfer: "Transferencia",
  card: "Tarjeta",
  bank_check: "Cheque",
};

function formatTime(t: string | null | undefined) {
  if (!t) return "—";
  return t.slice(0, 5);
}

function AssignmentTableRow({
  assignment: a,
  b,
  cfg,
  clientLabel,
}: {
  assignment: PersonalAssignmentDetail;
  b: PersonalAssignmentDetail["booking"];
  cfg: { label: string; className: string };
  clientLabel: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      <tr className="border-b border-border bg-muted/5">
        <td className="px-3 py-3 align-top font-medium">
          {b ? formatDate(b.event_date) : "—"}
          <span className="mt-1 block text-xs text-muted-foreground">{b?.organization ?? ""}</span>
        </td>
        <td className="px-3 py-3 align-top">{clientLabel}</td>
        <td className="hidden px-3 py-3 align-top lg:table-cell">
          <span className="inline-flex items-start gap-1">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span>{b?.place ?? "—"}</span>
          </span>
        </td>
        <td className="hidden px-3 py-3 text-center align-top text-xs tabular-nums md:table-cell">
          {b?.start_time
            ? `${formatTime(b.start_time)} — ${formatTime(b.end_time)}`
            : "—"}
        </td>
        <td className="hidden px-3 py-3 text-center align-top text-xs xl:table-cell">
          {b ? eventTypes[b.event_type] ?? b.event_type : "—"}
        </td>
        <td className="px-3 py-3 text-center align-top">
          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", cfg.className)}>
            {cfg.label}
          </span>
        </td>
        <td className="px-3 py-3 text-right align-top tabular-nums">{a.days}</td>
        <td className="px-3 py-3 text-right align-top tabular-nums">${formatCurrency(a.rate)}</td>
        <td className="px-3 py-3 text-right align-top font-semibold tabular-nums">${formatCurrency(a.amount)}</td>
        <td className="px-3 py-3 text-right align-top">
          {a.booking_id ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => navigate(`/evento/${a.booking_id}`)}
            >
              Ver evento
            </Button>
          ) : null}
        </td>
      </tr>
      {a.notes ? (
        <tr className="border-b border-border bg-muted/10">
          <td colSpan={10} className="px-3 py-2 pl-8 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Notas asignación:</span> {a.notes}
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function PersonalReportDetail() {
  const { personalId: param } = useParams();
  const navigate = useNavigate();
  const personalId = Number(param);

  const { data, isLoading, isError } = usePersonalReportDetail(
    Number.isFinite(personalId) && personalId > 0 ? personalId : undefined
  );

  const { data: personalRoles = [] } = useQuery({
    queryKey: ["personal_roles"],
    queryFn: () => getPersonalRoles({ includeInactive: true }),
  });

  const roleLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const r of personalRoles) map[r.code] = r.label;
    return map;
  }, [personalRoles]);

  const detailPdfPayload = useMemo((): PersonalReportDetailPDFProps | null => {
    if (!data) return null;
    const pers = data.personal as unknown as PersonaledProps;
    const assignments = data.assignments.map((a) => {
      const b = a.booking;
      const dateRaw = b?.event_date?.split("T")[0] ?? "";
      const statusKey = b?.booking_status ?? "";
      const statusLabel = bookingStatusConfig[statusKey]?.label ?? statusKey;
      return {
        eventDateLabel: dateRaw ? formatDate(dateRaw) : "—",
        organization: b?.organization ?? "—",
        clientName: b?.client ? `${b.client.name} ${b.client.lastName}` : "—",
        place: b?.place ?? "—",
        timeRange:
          b?.start_time != null && b.start_time !== ""
            ? `${formatTime(b.start_time)} — ${formatTime(b.end_time)}`
            : "—",
        eventTypeLabel: b ? eventTypes[b.event_type] ?? b.event_type : "—",
        statusLabel,
        days: a.days,
        rate: a.rate,
        amount: a.amount,
        assignmentNotes: a.notes?.trim() ? a.notes : null,
      };
    });
    const payments = data.payments.map((pay) => ({
      dateLabel: formatDate(pay.payment_date.split("T")[0]),
      methodLabel: paymentMethodLabel[pay.payment_method] ?? pay.payment_method,
      notes: pay.notes?.trim() ?? "",
      amount: pay.amount,
    }));
    return {
      generatedAtIso: new Date().toISOString(),
      fullName: `${pers.name} ${pers.lastName}`,
      roleLabel: roleLabels[pers.role] ?? pers.role,
      phone: pers.phoneNumber ?? "",
      dni: pers.dni != null ? String(pers.dni) : "",
      cbu: pers.cbu ?? "",
      alias: pers.alias ?? "",
      personNotes: pers.notes?.trim() ?? "",
      totals: {
        trabajos: data.assignments.length,
        totalAdeudado: data.totalAdeudado,
        totalPagado: data.totalPagado,
        saldo: data.saldo,
      },
      assignments,
      payments,
    };
  }, [data, roleLabels]);

  if (!Number.isFinite(personalId) || personalId <= 0) {
    return (
      <CategoryLayout title="Reporte de personal">
        <p className="text-muted-foreground">Identificador no válido.</p>
        <Button variant="outline" className="mt-4 w-fit" asChild>
          <Link to="/reporte-personal">Volver al listado</Link>
        </Button>
      </CategoryLayout>
    );
  }

  if (isLoading) return <Spinner />;

  if (isError || data === null || data === undefined) {
    return (
      <CategoryLayout title="Reporte de personal">
        <p className="text-muted-foreground">No se encontró el empleado o hubo un error al cargar.</p>
        <Button variant="outline" className="mt-4 w-fit" asChild>
          <Link to="/reporte-personal">Volver al listado</Link>
        </Button>
      </CategoryLayout>
    );
  }

  const p = data.personal as unknown as PersonaledProps;
  const title = `${p.name} ${p.lastName} — Detalle`;

  return (
    <CategoryLayout title={title}>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate("/reporte-personal")}>
          <ArrowLeft className="h-4 w-4" />
          Reporte general
        </Button>
        {detailPdfPayload ? (
          <PDFDownloadLink
            document={<PersonalReportDetailPDF {...detailPdfPayload} />}
            fileName={`reporte-personal-${p.name}-${p.id}.pdf`.toLowerCase().replace(/\s+/g, "-")}
          >
            {({ loading }) => (
              <Button type="button" variant="outline" size="sm" disabled={loading} className="gap-1">
                <FileDown className="h-4 w-4" />
                {loading ? "Generando…" : "Exportar PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        ) : null}
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link to={`/personal/editar/${p.id}`}>Editar ficha</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Datos del integrante
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-2 text-sm">
            <UserCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Rol</p>
              <p className="font-medium">{roleLabels[p.role] ?? p.role}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Teléfono</p>
              <p className="font-medium">{p.phoneNumber ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">DNI</p>
              <p className="font-medium">{p.dni ?? "—"}</p>
            </div>
          </div>
          {p.cbu ? (
            <div className="text-sm">
              <p className="text-xs text-muted-foreground">CBU</p>
              <p className="font-mono text-xs font-medium">{p.cbu}</p>
            </div>
          ) : null}
          {p.alias ? (
            <div className="text-sm">
              <p className="text-xs text-muted-foreground">Alias</p>
              <p className="font-medium">{p.alias}</p>
            </div>
          ) : null}
          {p.notes ? (
            <div className="sm:col-span-2 lg:col-span-3 text-sm">
              <p className="text-xs text-muted-foreground">Notas</p>
              <p className="text-foreground">{p.notes}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard
          title="Trabajos en eventos"
          value={data.assignments.length}
          icon={Calendar}
          variant="primary"
        />
        <KPICard
          title="Total adeudado"
          value={`$${formatCurrency(data.totalAdeudado)}`}
          icon={DollarSign}
          variant="info"
        />
        <KPICard
          title="Total pagado"
          value={`$${formatCurrency(data.totalPagado)}`}
          icon={CheckCircle2}
          variant="success"
        />
        <KPICard
          title="Saldo"
          value={`$${formatCurrency(data.saldo)}`}
          icon={AlertCircle}
          variant={data.saldo > 0 ? "warning" : "success"}
        />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Eventos en los que participó
        </h2>
        {data.assignments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            No hay asignaciones registradas en eventos.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                  <th className="hidden px-3 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                    Lugar
                  </th>
                  <th className="hidden px-3 py-3 text-center font-medium text-muted-foreground md:table-cell">
                    Horario
                  </th>
                  <th className="hidden px-3 py-3 text-center font-medium text-muted-foreground xl:table-cell">
                    Tipo
                  </th>
                  <th className="px-3 py-3 text-center font-medium text-muted-foreground">Estado</th>
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground">Días</th>
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground">Tarifa</th>
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground">Importe</th>
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground" />
                </tr>
              </thead>
              <tbody>
                {data.assignments.map((a) => {
                  const b = a.booking;
                  const st = b?.booking_status ?? "";
                  const cfg = bookingStatusConfig[st] ?? {
                    label: st,
                    className: "bg-muted text-muted-foreground",
                  };
                  const clientLabel = b?.client ? `${b.client.name} ${b.client.lastName}` : "—";
                  return (
                    <AssignmentTableRow
                      key={a.id}
                      assignment={a}
                      b={b}
                      cfg={cfg}
                      clientLabel={clientLabel}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pagos registrados
        </h2>
        {data.payments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            No hay pagos registrados a esta persona.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Medio</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Notas</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Importe</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((pay) => (
                  <tr key={pay.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {formatDate(pay.payment_date)}
                    </td>
                    <td className="px-4 py-3">
                      {paymentMethodLabel[pay.payment_method] ?? pay.payment_method}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{pay.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                      ${formatCurrency(pay.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </CategoryLayout>
  );
}
