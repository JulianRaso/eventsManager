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
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 40, height: 40, borderRadius: 4 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: colors.primary },
  headerSubtitle: { fontSize: 8, color: colors.muted, marginTop: 2 },
  badge: { fontSize: 11, fontWeight: "bold", color: colors.primary },
  badgeDate: { fontSize: 9, color: colors.muted },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
    padding: 12,
    backgroundColor: colors.tableRowAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  summaryBlock: { width: "22%", minWidth: 90 },
  summaryLabel: { fontSize: 8, color: colors.muted, marginBottom: 2 },
  summaryValue: { fontSize: 11, fontWeight: "bold" },
  hint: { fontSize: 8, color: colors.muted, marginBottom: 10 },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowAlt: { backgroundColor: colors.tableRowAlt },
  cellName: { flex: 2.4, fontSize: 9 },
  cellRole: { flex: 1.4, fontSize: 8, color: colors.muted },
  cellNum: { flex: 0.65, fontSize: 9, textAlign: "center" as const },
  cellMoney: { flex: 1, fontSize: 9, textAlign: "right" as const },
  th: { fontSize: 8, fontWeight: "bold", color: colors.muted, textTransform: "uppercase" as const },
  footer: {
    marginTop: 16,
    paddingTop: 10,
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

export type PersonalReportGeneralRow = {
  name: string;
  lastName: string;
  roleLabel: string;
  trabajos: number;
  totalAdeudado: number;
  totalPagado: number;
  saldo: number;
};

export type PersonalReportGeneralPDFProps = {
  generatedAtIso: string;
  summary: {
    people: number;
    withDebt: number;
    totalAdeudado: number;
    totalPagado: number;
    totalSaldo: number;
  };
  rows: PersonalReportGeneralRow[];
  /** Texto corto sobre filtros, ej. "Lista según búsqueda y filtros actuales." */
  scopeNote?: string;
};

export default function PersonalReportGeneralPDF({
  generatedAtIso,
  summary,
  rows,
  scopeNote = "Incluye solo las filas visibles según filtros en pantalla.",
}: PersonalReportGeneralPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            <Image src={companyLogo} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>Reporte general — Personal</Text>
              <Text style={styles.headerSubtitle}>Deuda por trabajos en eventos y pagos registrados</Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.badge}>Resumen equipo</Text>
            <Text style={styles.badgeDate}>{formatGenerated(generatedAtIso)}</Text>
          </View>
        </View>

        <Text style={styles.hint}>{scopeNote}</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Integrantes listados</Text>
            <Text style={styles.summaryValue}>{summary.people}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Con saldo pendiente</Text>
            <Text style={styles.summaryValue}>{summary.withDebt}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Total adeudado</Text>
            <Text style={styles.summaryValue}>${fmt(summary.totalAdeudado)}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Total pagado</Text>
            <Text style={styles.summaryValue}>${fmt(summary.totalPagado)}</Text>
          </View>
          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Saldo pendiente</Text>
            <Text style={styles.summaryValue}>${fmt(summary.totalSaldo)}</Text>
          </View>
        </View>

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.th, styles.cellName]}>Personal</Text>
          <Text style={[styles.th, styles.cellRole]}>Rol</Text>
          <Text style={[styles.th, styles.cellNum]}>Trab.</Text>
          <Text style={[styles.th, styles.cellMoney]}>Adeudado</Text>
          <Text style={[styles.th, styles.cellMoney]}>Pagado</Text>
          <Text style={[styles.th, styles.cellMoney]}>Saldo</Text>
        </View>

        {rows.map((r, i) => (
          <View key={`${r.name}-${r.lastName}-${i}`} style={[styles.row, i % 2 === 1 ? styles.rowAlt : {}]}>
            <Text style={styles.cellName}>
              {r.name} {r.lastName}
            </Text>
            <Text style={styles.cellRole}>{r.roleLabel}</Text>
            <Text style={styles.cellNum}>{r.trabajos}</Text>
            <Text style={styles.cellMoney}>${fmt(r.totalAdeudado)}</Text>
            <Text style={styles.cellMoney}>${fmt(r.totalPagado)}</Text>
            <Text style={styles.cellMoney}>${fmt(r.saldo)}</Text>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Documento generado desde la aplicación · {formatGenerated(generatedAtIso)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
