import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import companyLogo from "../assets/ShowRental.png";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#111" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: { width: 40, height: 40 },
  company: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flexGrow: 1,
  },
  receipt: { textAlign: "right" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  infoText: { marginBottom: 3 },
  bold: { fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottom: 1,
    borderColor: "#ddd",
    padding: 6,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#eee",
    padding: 6,
  },
  cellDesc: { flex: 2 },
  cell: { flex: 1, textAlign: "center" },
  cellRight: { flex: 1, textAlign: "right" },
  totalRow: { flexDirection: "row", padding: 6, fontWeight: "bold" },
  totalsContainer: { marginTop: 20, alignItems: "flex-end" },
  totalsText: { fontSize: 12, marginBottom: 4 },
  totalsBold: { fontSize: 14, fontWeight: "bold" },
  footer: {
    marginTop: 40,
    borderTop: 1,
    borderColor: "#ddd",
    paddingTop: 10,
    color: "#555",
  },
});

const eventTypes = {
  other: {
    es: "Otro",
    en: "Other",
  },
  fifteen_party: {
    es: "Quince Años",
    en: "Fifteen Party",
  },
  corporate: {
    es: "Corporativo",
    en: "Corporate",
  },
  marriage: {
    es: "Casamiento",
    en: "Marriage",
  },
  birthday: {
    es: "Cumpleaños",
    en: "Birthday",
  },
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
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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
        {/* HEADER */}
        <View style={styles.header}>
          <Image src={companyLogo} style={styles.logo} />
          <Text style={styles.company}>{invoiceData.organization}</Text>
          <View style={styles.receipt}>
            <Text style={styles.bold}>Recibo</Text>
            <Text>Fecha: {formatDate(invoiceData.created_at)}</Text>
          </View>
        </View>

        {/* EVENT INFO */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Evento</Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Cliente: </Text>
            {clientData.name} {clientData.lastName}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Email: </Text>
            {clientData.email}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Tipo: </Text>
            {eventTypes[invoiceData.event_type]?.es}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Lugar: </Text>
            {invoiceData.place}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Fecha: </Text>
            {formatDate(invoiceData.event_date)}
          </Text>
        </View>

        {/* TABLE */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.cellDesc}>Descripción</Text>
            <Text style={styles.cell}>Cantidad</Text>
            <Text style={styles.cell}>Metros</Text>
            <Text style={styles.cellRight}>Total</Text>
          </View>

          {equipment.map((item) => (
            <View style={styles.row} key={item.id}>
              <Text style={styles.cellDesc}>{item.name}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>-</Text>
              <Text style={styles.cellRight}>
                $
                {(
                  item.price * item.quantity +
                  ((item.price * item.quantity) / 100) *
                    Number(invoiceData.revenue ?? 0)
                ).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={styles.cellDesc}>Total</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cellRight}>${subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Totales finales */}
        <View style={styles.totalsContainer}>
          <Text style={styles.totalsText}>
            <Text style={styles.bold}>Impuesto: </Text>${tax.toFixed(2)}
          </Text>
          <Text style={styles.totalsBold}>
            <Text style={styles.bold}>Total: </Text>${total.toFixed(2)}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Recibo no válido como factura. Los pagos deben acompañarse de un
            comprobante.
          </Text>
          <Text>
            {invoiceData.organization} - San Juan 671, Corrientes, Argentina
          </Text>
        </View>
      </Page>
    </Document>
  );
}
