import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import companyLogo from "../assets/ShowRental.png";

// Paleta: gris neutro + acento para títulos y totales
const colors = {
  primary: "#1e293b",
  primaryLight: "#334155",
  muted: "#64748b",
  border: "#e2e8f0",
  tableHeader: "#f1f5f9",
  tableRowAlt: "#f8fafc",
  totalBg: "#f1f5f9",
  footer: "#94a3b8",
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: colors.primary,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  receiptBadge: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
    letterSpacing: 1,
  },
  receiptDate: {
    fontSize: 10,
    color: colors.muted,
  },
  organization: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 2,
  },
  intro: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 24,
    lineHeight: 1.5,
  },
  // Secciones
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    letterSpacing: 0.3,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  infoBlock: {
    width: "48%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primary,
  },
  infoText: {
    fontSize: 10,
    color: colors.primary,
    marginBottom: 6,
  },
  bold: { fontWeight: "bold" },
  // Tabla
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primaryLight,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowAlt: {
    backgroundColor: colors.tableRowAlt,
  },
  cellDesc: { flex: 2, fontSize: 10 },
  cell: { flex: 1, textAlign: "center" as const, fontSize: 10 },
  cellRight: {
    flex: 1,
    textAlign: "right" as const,
    fontSize: 10,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.totalBg,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  totalLabel: {
    flex: 2,
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
  },
  totalValue: {
    flex: 1,
    textAlign: "right" as const,
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
  },
  // Totales finales
  totalsBox: {
    marginTop: 24,
    alignItems: "flex-end",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.tableHeader,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
    marginBottom: 6,
  },
  totalsLabel: {
    fontSize: 10,
    color: colors.muted,
    minWidth: 80,
    textAlign: "right" as const,
  },
  totalsAmount: {
    fontSize: 10,
    fontWeight: "bold",
    minWidth: 70,
    textAlign: "right" as const,
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 24,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalFinalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
    minWidth: 80,
    textAlign: "right" as const,
  },
  totalFinalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    minWidth: 90,
    textAlign: "right" as const,
  },
  thanks: {
    fontSize: 9,
    color: colors.muted,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 40,
    left: 48,
    right: 48,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 8,
    color: colors.footer,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 1.4,
  },
});

const eventTypes: Record<string, { es: string }> = {
  other: { es: "Otro" },
  fifteen_party: { es: "Quince Años" },
  corporate: { es: "Corporativo" },
  marriage: { es: "Casamiento" },
  birthday: { es: "Cumpleaños" },
};

type invoiceProps = {
  created_at: string;
  client_dni: number;
  event_date: string;
  event_type: "other" | "fifteen_party" | "corporate" | "marriage" | "birthday";
  organization: string;
  place: string;
  booking_status: string;
  payment_status: string;
  comments: string;
  tax: number;
  revenue: number;
};

type clientProps = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type equipmentProps = {
  id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

/** Formato amigable de moneda para Argentina (ej: $ 12.345,67) */
function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function InvoicePDF({
  invoiceData,
  clientData,
  equipment,
  price,
}: { price: number } & { clientData: clientProps } & {
  equipment: equipmentProps[];
} & { invoiceData: invoiceProps }) {
  const subtotal = price + (price / 100) * Number(invoiceData.revenue ?? 0);
  const tax = (subtotal / 100) * invoiceData.tax;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={companyLogo} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>{invoiceData.organization}</Text>
              <Text style={styles.organization}>San Juan 671, Corrientes, Argentina</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.receiptBadge}>Recibo</Text>
            <Text style={styles.receiptDate}>{formatDate(invoiceData.created_at)}</Text>
          </View>
        </View>

        <Text style={styles.intro}>
          Este es el resumen de tu reserva. Aquí podés ver los datos del evento,
          el detalle de lo que contrataste y el total a abonar.
        </Text>

        {/* Datos del evento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu evento</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>
                {clientData.name} {clientData.lastName}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Tipo de evento</Text>
              <Text style={styles.infoValue}>
                {eventTypes[invoiceData.event_type]?.es ?? invoiceData.event_type}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{clientData.email}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{clientData.phoneNumber || "—"}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Lugar</Text>
              <Text style={styles.infoValue}>{invoiceData.place}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Fecha del evento</Text>
              <Text style={styles.infoValue}>{formatDate(invoiceData.event_date)}</Text>
            </View>
          </View>
        </View>

        {/* Qué incluye */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qué incluye tu reserva</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.cellDesc, styles.tableHeaderText]}>Descripción</Text>
              <Text style={[styles.cell, styles.tableHeaderText]}>Cantidad</Text>
              <Text style={[styles.cell, styles.tableHeaderText]}>Metros</Text>
              <Text style={[styles.cellRight, styles.tableHeaderText]}>Precio</Text>
            </View>

            {equipment.map((item, index) => (
              <View
                style={
                  index % 2 === 1 ? [styles.row, styles.rowAlt] : styles.row
                }
                key={item.id ?? index}
              >
                <Text style={styles.cellDesc}>{item.name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>—</Text>
                <Text style={styles.cellRight}>
                  $ {formatCurrency(
                    item.price * item.quantity +
                      ((item.price * item.quantity) / 100) *
                        Number(invoiceData.revenue ?? 0)
                  )}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.totalValue}>$ {formatCurrency(subtotal)}</Text>
            </View>
          </View>
        </View>

        {/* Total a abonar */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Impuesto ({invoiceData.tax}%)</Text>
            <Text style={styles.totalsAmount}>$ {formatCurrency(tax)}</Text>
          </View>
          <View style={styles.totalFinalRow}>
            <Text style={styles.totalFinalLabel}>Total a abonar</Text>
            <Text style={styles.totalFinalAmount}>$ {formatCurrency(total)}</Text>
          </View>
        </View>

        <Text style={styles.thanks}>Gracias por elegirnos. Ante cualquier duda, contactanos.</Text>

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
