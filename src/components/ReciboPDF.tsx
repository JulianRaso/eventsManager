import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import companyLogo from "../assets/ShowRental.png";
import { formatLocalDate } from "./formatDate";

const colors = {
  primary: "#1e293b",
  primaryLight: "#334155",
  muted: "#64748b",
  border: "#e2e8f0",
  tableHeader: "#f1f5f9",
  tableRowAlt: "#f8fafc",
  green: "#16a34a",
  amber: "#d97706",
  footer: "#94a3b8",
};

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: colors.primary },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 32, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 48, height: 48, borderRadius: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: colors.primary },
  headerSubtitle: { fontSize: 9, color: colors.muted, marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  badge: { fontSize: 11, fontWeight: "bold", color: colors.primary, marginBottom: 4, letterSpacing: 1 },
  badgeDate: { fontSize: 10, color: colors.muted },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12, fontWeight: "bold", color: colors.primary, marginBottom: 12,
    paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  infoBlock: { width: "48%", marginBottom: 8 },
  infoLabel: { fontSize: 9, color: colors.muted, marginBottom: 2 },
  infoValue: { fontSize: 10, fontWeight: "bold", color: colors.primary },
  tableHeaderRow: {
    flexDirection: "row", backgroundColor: colors.tableHeader,
    paddingVertical: 10, paddingHorizontal: 12,
  },
  tableHeaderText: { fontSize: 10, fontWeight: "bold", color: colors.primaryLight },
  row: {
    flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowAlt: { backgroundColor: colors.tableRowAlt },
  cellDate: { flex: 2, fontSize: 10 },
  cellMethod: { flex: 2, fontSize: 10 },
  cellNotes: { flex: 3, fontSize: 10, color: colors.muted },
  cellAmount: { flex: 2, textAlign: "right" as const, fontSize: 10, fontWeight: "bold" },
  totalsBox: {
    marginTop: 8, alignItems: "flex-end", paddingVertical: 16, paddingHorizontal: 20,
    backgroundColor: colors.tableHeader, borderWidth: 1, borderColor: colors.border,
  },
  totalsRow: { flexDirection: "row", justifyContent: "flex-end", gap: 24, marginBottom: 6 },
  totalsLabel: { fontSize: 10, color: colors.muted, minWidth: 110, textAlign: "right" as const },
  totalsAmount: { fontSize: 10, fontWeight: "bold", minWidth: 80, textAlign: "right" as const },
  totalsAmountGreen: { fontSize: 10, fontWeight: "bold", minWidth: 80, textAlign: "right" as const, color: colors.green },
  totalFinalRow: {
    flexDirection: "row", justifyContent: "flex-end", gap: 24,
    marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  totalFinalLabel: { fontSize: 12, fontWeight: "bold", color: colors.primary, minWidth: 110, textAlign: "right" as const },
  totalFinalAmountGreen: { fontSize: 14, fontWeight: "bold", color: colors.green, minWidth: 80, textAlign: "right" as const },
  totalFinalAmountAmber: { fontSize: 14, fontWeight: "bold", color: colors.amber, minWidth: 80, textAlign: "right" as const },
  footer: {
    position: "absolute", bottom: 40, left: 48, right: 48,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerText: { fontSize: 8, color: colors.footer, textAlign: "center", marginBottom: 4, lineHeight: 1.4 },
});

const eventTypes: Record<string, string> = {
  other: "Otro", fifteen_party: "Quince Años", corporate: "Corporativo",
  marriage: "Casamiento", birthday: "Cumpleaños",
};

const paymentMethodLabel: Record<string, string> = {
  cash: "Efectivo", transfer: "Transferencia", card: "Tarjeta",
};

function fmt(n: number) {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type Payment = {
  id: number;
  payment_date: string;
  payment_method: string;
  notes?: string | null;
  amount: number;
};

type Props = {
  invoiceData: {
    created_at: string; organization: string; event_date: string;
    event_type: string; place: string; price: number; tax: number;
  };
  clientData: { name: string; lastName: string; phoneNumber: string };
  payments: Payment[];
};

export default function ReciboPDF({ invoiceData, clientData, payments }: Props) {
  const iva = (invoiceData.price / 100) * (invoiceData.tax ?? 0);
  const totalCliente = invoiceData.price + iva;
  const totalPagado = payments.reduce((sum, p) => sum + p.amount, 0);
  const saldo = Math.max(0, totalCliente - totalPagado);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={companyLogo} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>{invoiceData.organization}</Text>
              <Text style={styles.headerSubtitle}>San Juan 671, Corrientes, Argentina</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.badge}>Recibo</Text>
            <Text style={styles.badgeDate}>{formatLocalDate(invoiceData.created_at)}</Text>
          </View>
        </View>

        {/* Datos del evento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del evento</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{clientData.name} {clientData.lastName}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Tipo de evento</Text>
              <Text style={styles.infoValue}>{eventTypes[invoiceData.event_type] ?? invoiceData.event_type}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{clientData.phoneNumber || "—"}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Fecha del evento</Text>
              <Text style={styles.infoValue}>{formatLocalDate(invoiceData.event_date)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Lugar</Text>
              <Text style={styles.infoValue}>{invoiceData.place}</Text>
            </View>
          </View>
        </View>

        {/* Pagos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pagos realizados</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cellDate, styles.tableHeaderText]}>Fecha</Text>
            <Text style={[styles.cellMethod, styles.tableHeaderText]}>Método</Text>
            <Text style={[styles.cellNotes, styles.tableHeaderText]}>Notas</Text>
            <Text style={[styles.cellAmount, styles.tableHeaderText]}>Monto</Text>
          </View>
          {payments.map((p, i) => (
            <View key={p.id} style={i % 2 === 1 ? [styles.row, styles.rowAlt] : styles.row}>
              <Text style={styles.cellDate}>{formatLocalDate(p.payment_date)}</Text>
              <Text style={styles.cellMethod}>{paymentMethodLabel[p.payment_method] ?? p.payment_method}</Text>
              <Text style={styles.cellNotes}>{p.notes ?? "—"}</Text>
              <Text style={styles.cellAmount}>$ {fmt(p.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Resumen */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Total del evento</Text>
            <Text style={styles.totalsAmount}>$ {fmt(invoiceData.price)}</Text>
          </View>
          {invoiceData.tax > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>IVA ({invoiceData.tax}%)</Text>
              <Text style={styles.totalsAmount}>$ {fmt(iva)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Total a abonar</Text>
            <Text style={styles.totalsAmount}>$ {fmt(totalCliente)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Total pagado</Text>
            <Text style={styles.totalsAmountGreen}>$ {fmt(totalPagado)}</Text>
          </View>
          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalLabel}>Saldo pendiente</Text>
            <Text style={saldo <= 0 ? styles.totalFinalAmountGreen : styles.totalFinalAmountAmber}>
              $ {fmt(saldo)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Este recibo no reemplaza la factura. Conservá tu comprobante de pago.
          </Text>
          <Text style={styles.footerText}>
            {invoiceData.organization} — San Juan 671, Corrientes, Argentina
          </Text>
        </View>
      </Page>
    </Document>
  );
}
