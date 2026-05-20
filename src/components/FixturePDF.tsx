import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: colors.primary },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 28, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, borderRadius: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: colors.primary },
  headerSubtitle: { fontSize: 9, color: colors.muted, marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  badge: { fontSize: 13, fontWeight: "bold", color: colors.primary, letterSpacing: 0.5 },
  badgeDate: { fontSize: 9, color: colors.muted, marginTop: 3 },
  infoRow: {
    flexDirection: "row", gap: 24, marginBottom: 24,
    paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 9, color: colors.muted, marginBottom: 3, textTransform: "uppercase" as const },
  infoValue: { fontSize: 11, fontWeight: "bold", color: colors.primary },
  infoValueSub: { fontSize: 10, color: colors.primary, marginTop: 2 },
  sectionTitle: {
    fontSize: 11, fontWeight: "bold", color: colors.primary,
    marginBottom: 10, paddingBottom: 5,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tableHeaderRow: {
    flexDirection: "row", backgroundColor: colors.tableHeader,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  tableHeaderText: { fontSize: 9, fontWeight: "bold", color: colors.muted, textTransform: "uppercase" as const },
  row: {
    flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowAlt: { backgroundColor: colors.tableRowAlt },
  cellDesc: { flex: 4, fontSize: 10 },
  cellQty: { flex: 1, textAlign: "center" as const, fontSize: 10, fontWeight: "bold" },
  notesBox: {
    marginTop: 24, padding: 12,
    borderWidth: 1, borderColor: colors.border, borderRadius: 4,
    backgroundColor: colors.tableRowAlt,
  },
  notesLabel: { fontSize: 9, color: colors.muted, marginBottom: 4, textTransform: "uppercase" as const },
  notesText: { fontSize: 10, color: colors.primary, lineHeight: 1.5 },
  firmaSection: {
    marginTop: 32, flexDirection: "row", gap: 32,
  },
  firmaBlock: {
    flex: 1, borderTopWidth: 1, borderTopColor: colors.primary,
    paddingTop: 6,
  },
  firmaLabel: { fontSize: 9, color: colors.muted },
  footer: {
    position: "absolute", bottom: 36, left: 48, right: 48,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerText: { fontSize: 8, color: colors.footer, textAlign: "center" },
});

const eventTypes: Record<string, string> = {
  other: "Otro", fifteen_party: "Quince Años", corporate: "Corporativo",
  marriage: "Casamiento", birthday: "Cumpleaños",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", {
    weekday: "long", year: "numeric", month: "long", day: "2-digit",
  });
}

function formatTime(t: string | null | undefined) {
  return t ? t.slice(0, 5) : "—";
}

type Props = {
  booking: {
    organization: string;
    event_type: string;
    event_date: string;
    start_time?: string | null;
    end_time?: string | null;
    place: string;
    comments?: string | null;
  };
  client: {
    name: string;
    lastName: string;
    phoneNumber?: string | null;
  } | null;
  items: { name: string; quantity: number }[];
};

export default function FixturePDF({ booking, client, items }: Props) {
  const generatedAt = new Date().toLocaleDateString("es-AR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const hasTime = booking.start_time || booking.end_time;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={companyLogo} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>{booking.organization}</Text>
              <Text style={styles.headerSubtitle}>San Juan 671, Corrientes, Argentina</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.badge}>Fixture</Text>
            <Text style={styles.badgeDate}>Emitida: {generatedAt}</Text>
          </View>
        </View>

        {/* Info del evento */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Evento</Text>
            <Text style={styles.infoValue}>{eventTypes[booking.event_type] ?? booking.event_type}</Text>
            <Text style={styles.infoValueSub}>{formatDate(booking.event_date)}</Text>
            {hasTime && (
              <Text style={styles.infoValueSub}>
                {formatTime(booking.start_time)} — {formatTime(booking.end_time)} hs
              </Text>
            )}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Lugar</Text>
            <Text style={styles.infoValue}>{booking.place}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Contacto</Text>
            <Text style={styles.infoValue}>
              {client ? `${client.name} ${client.lastName}` : "—"}
            </Text>
            {client?.phoneNumber && (
              <Text style={styles.infoValueSub}>{client.phoneNumber}</Text>
            )}
          </View>
        </View>

        {/* Equipamiento */}
        <Text style={styles.sectionTitle}>Equipamiento a transportar</Text>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.cellDesc, styles.tableHeaderText]}>Descripción</Text>
          <Text style={[styles.cellQty, styles.tableHeaderText]}>Cant.</Text>
        </View>
        {items.map((item, i) => (
          <View key={i} style={i % 2 === 1 ? [styles.row, styles.rowAlt] : styles.row}>
            <Text style={styles.cellDesc}>{item.name}</Text>
            <Text style={styles.cellQty}>{item.quantity}</Text>
          </View>
        ))}

        {/* Observaciones */}
        {booking.comments ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Observaciones</Text>
            <Text style={styles.notesText}>{booking.comments}</Text>
          </View>
        ) : null}

        {/* Firmas */}
        <View style={styles.firmaSection}>
          <View style={styles.firmaBlock}>
            <Text style={styles.firmaLabel}>Centro de Logistica</Text>
            <Text style={styles.firmaLabel}>Responsable de salida</Text>
          </View>
          <View style={styles.firmaBlock}>
          <Text style={styles.firmaLabel}>Evento</Text>
            <Text style={styles.firmaLabel}>Responsable de entrega</Text>
          </View>
        </View>

        <View style={styles.firmaSection}>
          <View style={styles.firmaBlock}>
            <Text style={styles.firmaLabel}>Centro de Logistica</Text>
            <Text style={styles.firmaLabel}>Responsable de entrega</Text>
          </View>
          <View style={styles.firmaBlock}>
            <Text style={styles.firmaLabel}>Centro de Logistica</Text>
            <Text style={styles.firmaLabel}>Responsable de control</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {booking.organization} — San Juan 671, Corrientes, Argentina
          </Text>
        </View>
      </Page>
    </Document>
  );
}
