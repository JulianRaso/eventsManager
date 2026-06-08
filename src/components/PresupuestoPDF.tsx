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
  cellDesc: { flex: 3, fontSize: 10 },
  cellCenter: { flex: 1, textAlign: "center" as const, fontSize: 10 },
  totalsBox: {
    marginTop: 8, alignItems: "flex-end", paddingVertical: 16, paddingHorizontal: 20,
    backgroundColor: colors.tableHeader, borderWidth: 1, borderColor: colors.border,
  },
  totalsRow: { flexDirection: "row", justifyContent: "flex-end", gap: 24, marginBottom: 6 },
  totalsLabel: { fontSize: 10, color: colors.muted, minWidth: 100, textAlign: "right" as const },
  totalsAmount: { fontSize: 10, fontWeight: "bold", minWidth: 80, textAlign: "right" as const },
  totalFinalRow: {
    flexDirection: "row", justifyContent: "flex-end", gap: 24,
    marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
  totalFinalLabel: { fontSize: 12, fontWeight: "bold", color: colors.primary, minWidth: 100, textAlign: "right" as const },
  totalFinalAmount: { fontSize: 16, fontWeight: "bold", color: colors.primary, minWidth: 80, textAlign: "right" as const },
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

function fmt(n: number) {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type Props = {
  bookingData: {
    created_at: string; organization: string; event_date: string;
    event_type: string; place: string; price: number; tax: number;
  };
  clientData: { name: string; lastName: string; phoneNumber: string; email: string };
  equipment: { id?: number; equipment_id: number; name: string; quantity: number }[];
};

export default function PresupuestoPDF({ bookingData, clientData, equipment }: Props) {
  const iva = (bookingData.price / 100) * (bookingData.tax ?? 0);
  const total = bookingData.price + iva;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={companyLogo} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>{bookingData.organization}</Text>
              <Text style={styles.headerSubtitle}>San Juan 671, Corrientes, Argentina</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.badge}>Presupuesto</Text>
            <Text style={styles.badgeDate}>{formatLocalDate(bookingData.created_at)}</Text>
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
              <Text style={styles.infoValue}>{eventTypes[bookingData.event_type] ?? bookingData.event_type}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{clientData.phoneNumber || "—"}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Fecha del evento</Text>
              <Text style={styles.infoValue}>{formatLocalDate(bookingData.event_date)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Lugar</Text>
              <Text style={styles.infoValue}>{bookingData.place}</Text>
            </View>
          </View>
        </View>

        {/* Detalle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de la reserva</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cellDesc, styles.tableHeaderText]}>Descripción</Text>
            <Text style={[styles.cellCenter, styles.tableHeaderText]}>Cantidad</Text>
          </View>
          {equipment.map((item, i) => (
            <View key={item.id ?? i} style={i % 2 === 1 ? [styles.row, styles.rowAlt] : styles.row}>
              <Text style={styles.cellDesc}>{item.name}</Text>
              <Text style={styles.cellCenter}>{item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Precio base</Text>
            <Text style={styles.totalsAmount}>$ {fmt(bookingData.price)}</Text>
          </View>
          {bookingData.tax > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>IVA ({bookingData.tax}%)</Text>
              <Text style={styles.totalsAmount}>$ {fmt(iva)}</Text>
            </View>
          )}
          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalAmount}>$ {fmt(total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Este presupuesto tiene validez de 30 días desde su emisión.
          </Text>
          <Text style={styles.footerText}>
            {bookingData.organization} — San Juan 671, Corrientes, Argentina
          </Text>
        </View>
      </Page>
    </Document>
  );
}
