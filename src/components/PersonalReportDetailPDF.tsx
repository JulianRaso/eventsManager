import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import companyLogo from "../assets/ShowRental.png";

const colors = {
  primary: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  tableHeader: "#f1f5f9",
  tableRowAlt: "#f8fafc",
  footer: "#94a3b8",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: colors.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 40, height: 40, borderRadius: 4 },
  headerTitle: { fontSize: 15, fontWeight: "bold", color: colors.primary },
  headerSubtitle: { fontSize: 8, color: colors.muted, marginTop: 2 },
  badgeDate: { fontSize: 9, color: colors.muted },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 14,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  infoBlock: { width: "31%", marginBottom: 6 },
  infoLabel: { fontSize: 8, color: colors.muted },
  infoValue: { fontSize: 10, fontWeight: "bold" },
  notesBox: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: colors.tableRowAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.tableRowAlt,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryBlock: { width: "23%" },
  summaryLabel: { fontSize: 8, color: colors.muted },
  summaryValue: { fontSize: 10, fontWeight: "bold" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowAlt: { backgroundColor: colors.tableRowAlt },
  rowNote: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    paddingLeft: 14,
    fontSize: 8,
    color: colors.muted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "#fafafa",
  },
  th: { fontSize: 7, fontWeight: "bold", color: colors.muted, textTransform: "uppercase" as const },
  cellDate: { flex: 1.15, fontSize: 8 },
  cellMain: { flex: 2.2, fontSize: 8 },
  cellSmall: { flex: 1, fontSize: 7, color: colors.muted },
  cellMoney: { flex: 0.85, fontSize: 8, textAlign: "right" as const },
  footer: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: { fontSize: 8, color: colors.footer, textAlign: "center" },
});

function fmt(n: number) {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatGenerated(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-AR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export type PersonalReportDetailAssignmentPdf = {
  eventDateLabel: string;
  organization: string;
  clientName: string;
  place: string;
  timeRange: string;
  eventTypeLabel: string;
  statusLabel: string;
  days: number;
  rate: number;
  amount: number;
  assignmentNotes: string | null;
};

export type PersonalReportDetailPaymentPdf = {
  dateLabel: string;
  methodLabel: string;
  notes: string;
  amount: number;
};

export type PersonalReportDetailPDFProps = {
  generatedAtIso: string;
  fullName: string;
  roleLabel: string;
  phone: string;
  dni: string;
  cbu: string;
  alias: string;
  personNotes: string;
  totals: {
    trabajos: number;
    totalAdeudado: number;
    totalPagado: number;
    saldo: number;
  };
  assignments: PersonalReportDetailAssignmentPdf[];
  payments: PersonalReportDetailPaymentPdf[];
};

export default function PersonalReportDetailPDF({
  generatedAtIso,
  fullName,
  roleLabel,
  phone,
  dni,
  cbu,
  alias,
  personNotes,
  totals,
  assignments,
  payments,
}: PersonalReportDetailPDFProps) {
  const showPersonNotes = personNotes.trim().length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image src={companyLogo} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>Reporte personal — {fullName}</Text>
              <Text style={styles.headerSubtitle}>
                Eventos, montos por asignación y pagos registrados
              </Text>
            </View>
          </View>
          <Text style={styles.badgeDate}>{formatGenerated(generatedAtIso)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Datos del integrante</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>{roleLabel}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{phone || "—"}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>DNI</Text>
            <Text style={styles.infoValue}>{dni || "—"}</Text>
          </View>
          {cbu ? (
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>CBU</Text>
              <Text style={[styles.infoValue, { fontSize: 9 }]}>{cbu}</Text>
            </View>
          ) : null}
          {alias ? (
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Alias</Text>
              <Text style={styles.infoValue}>{alias}</Text>
            </View>
          ) : null}
        </View>

        {showPersonNotes ? (
          <View style={styles.notesBox}>
            <Text style={styles.infoLabel}>Notas</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.45 }}>{personNotes}</Text>
          </View>
        ) : null}

        <View style={styles.summaryRow}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Trabajos</Text>
            <Text style={styles.summaryValue}>{totals.trabajos}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Adeudado</Text>
            <Text style={styles.summaryValue}>${fmt(totals.totalAdeudado)}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Pagado</Text>
            <Text style={styles.summaryValue}>${fmt(totals.totalPagado)}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={styles.summaryValue}>${fmt(totals.saldo)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Eventos</Text>
        {assignments.length === 0 ? (
          <Text style={{ fontSize: 9, color: colors.muted, marginBottom: 8 }}>
            Sin asignaciones en eventos.
          </Text>
        ) : (
          <>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, styles.cellDate]}>Fecha</Text>
              <Text style={[styles.th, styles.cellMain]}>Empresa / Cliente / Lugar</Text>
              <Text style={[styles.th, styles.cellSmall]}>Tipo · Estado</Text>
              <Text style={[styles.th, styles.cellSmall]}>Horario</Text>
              <Text style={[styles.th, styles.cellMoney]}>Importe</Text>
            </View>
            {assignments.map((a, i) => (
              <View key={`${a.eventDateLabel}-${i}`} wrap={false}>
                <View style={[styles.row, i % 2 === 1 ? styles.rowAlt : {}]}>
                  <Text style={styles.cellDate}>{a.eventDateLabel}</Text>
                  <View style={{ flex: 2.2, flexDirection: "column" }}>
                    <Text style={{ fontSize: 8, marginBottom: 2 }}>{a.organization}</Text>
                    <Text style={{ fontSize: 7, color: colors.muted }}>
                      {a.clientName} · {a.place}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    <Text style={{ fontSize: 7, marginBottom: 2 }}>{a.eventTypeLabel}</Text>
                    <Text style={{ fontSize: 7, color: colors.muted }}>{a.statusLabel}</Text>
                  </View>
                  <Text style={styles.cellSmall}>{a.timeRange}</Text>
                  <View style={{ flex: 0.85, alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 9, fontWeight: "bold" }}>${fmt(a.amount)}</Text>
                    <Text style={{ fontSize: 7, color: colors.muted }}>
                      {a.days} d × ${fmt(a.rate)}
                    </Text>
                  </View>
                </View>
                {a.assignmentNotes ? (
                  <Text style={styles.rowNote}>Notas asignación: {a.assignmentNotes}</Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Pagos registrados</Text>
        {payments.length === 0 ? (
          <Text style={{ fontSize: 9, color: colors.muted }}>Sin pagos registrados.</Text>
        ) : (
          <>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { flex: 1.2 }]}>Fecha</Text>
              <Text style={[styles.th, { flex: 1 }]}>Medio</Text>
              <Text style={[styles.th, { flex: 2 }]}>Notas</Text>
              <Text style={[styles.th, { flex: 0.9, textAlign: "right" }]}>Importe</Text>
            </View>
            {payments.map((p, i) => (
              <View key={`${p.dateLabel}-${i}`} style={[styles.row, i % 2 === 1 ? styles.rowAlt : {}]}>
                <Text style={{ flex: 1.2, fontSize: 8 }}>{p.dateLabel}</Text>
                <Text style={{ flex: 1, fontSize: 8 }}>{p.methodLabel}</Text>
                <Text style={{ flex: 2, fontSize: 8 }}>{p.notes || "—"}</Text>
                <Text style={{ flex: 0.9, fontSize: 8, textAlign: "right" }}>${fmt(p.amount)}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Reporte individual · {formatGenerated(generatedAtIso)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
