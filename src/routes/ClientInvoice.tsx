import AddLayout from "@/components/AddLayout";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "@/components/Table";
import { getCurrentBooking } from "@/services/booking";
import { getItems } from "@/services/bookingItems";
import { checkClient } from "@/services/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import companyLogo from "../assets/ShowRental.png";
import Spinner from "@/components/Spinner";

import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/Pdf";

type EquipmentItem = {
  id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

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

type eventType = {
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function ClientInvoice() {
  const [isLoading, setIsLoading] = useState(true);
  const invoiceID = Number(useParams().invoiceID);
  const [invoiceData, setInvoiceData] = useState({} as eventType);

  const [clientData, setClientData] = useState({
    dni: 0 as number,
    name: "....",
    lastName: "....",
    phoneNumber: "....",
    email: "....",
  });
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getCurrentBooking(invoiceID)
      .then((data = []) => {
        if (data && data.length > 0) {
          setInvoiceData({
            created_at: data[0].created_at,
            client_dni: data[0].client_dni,
            event_date: data[0].event_date,
            event_type: data[0].event_type,
            organization: data[0].organization,
            place: data[0].place,
            booking_status: data[0].booking_status,
            payment_status: data[0].payment_status,
            comments: data[0].comments ?? "No comments",
            tax: data[0].tax,
            revenue: data[0].revenue,
          });
          checkClient(data[0].client_dni).then((res) => {
            if (res.data) {
              const { dni, name, lastName, phoneNumber, email } = res.data;
              setClientData({
                dni: dni || 0,
                name: name || "....",
                lastName: lastName || "....",
                phoneNumber: phoneNumber || "....",
                email: email || "....",
              });
            }
          });
          getItems(Number(invoiceID)).then((res) => {
            if (res) {
              setEquipment(
                res.map((item) => ({
                  id: item.id,
                  booking_id: item.booking_id,
                  equipment_id: item.equipment_id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price ?? 0,
                }))
              );
              setPrice(
                res?.reduce((acc, item) => {
                  return (
                    acc + (item.price != null ? item.price : 0) * item.quantity
                  );
                }, 0)
              );
            }
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      });
  }, [invoiceID]);

  if (!invoiceID || isLoading) return <Spinner />;
  return (
    <AddLayout>
      <div className="flex items-center justify-between mb-10">
        <img
          className="h-14 w-14 mr-2 rounded-lg"
          src={companyLogo}
          alt="Logo"
        />
        <div className="text-gray-800 font-semibold text-3xl">
          {invoiceData.organization}
        </div>
        <div className="text-gray-700">
          <div className="font-bold text-xl mb-2">Recibo</div>
          <div className="text-sm">
            Fecha: {formatDate(invoiceData.created_at)}
          </div>
        </div>
      </div>

      <div className="border-b-2 border-gray-300 pb-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Evento</h2>
        <div className="text-gray-700 mb-2">
          <b>Cliente:</b> {clientData.name + " " + clientData.lastName}
        </div>
        <div className="text-gray-700 mb-2">
          <b>Email:</b> {clientData.email}
        </div>
        <div className="text-gray-700 mb-2">
          <b>Tipo:</b> {eventTypes[invoiceData.event_type]?.es}
        </div>
        <div className="text-gray-700 mb-2">
          <b>Lugar:</b> {invoiceData.place}
        </div>
        <div className="text-gray-700 mb-2">
          <b>Fecha:</b> {formatDate(invoiceData.event_date)}
        </div>
      </div>
      <Table>
        <TableHead>
          <TableData className="text-start">Descripcion</TableData>
          <TableData>Cantidad</TableData>
          <TableData>Metros</TableData>
          <TableData>Total</TableData>
        </TableHead>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableData className="text-start">{item.name}</TableData>
              <TableData>{item.quantity}</TableData>
              <TableData>{null}</TableData>
              <TableData>
                $
                {Number(
                  item.price * item.quantity +
                    ((item.price * item.quantity) / 100) *
                      Number(invoiceData.revenue ?? 0)
                ).toFixed(2)}
              </TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableData className="text-start font-bold">Total</TableData>
        <TableData>{null}</TableData>
        <TableData>{null}</TableData>
        <TableData className="font-bold">
          $
          {Number(
            price + (price / 100) * Number(invoiceData.revenue ?? 0)
          ).toFixed(2)}
        </TableData>
      </Table>

      <div className="text-right mb-8 mt-4">
        <div className="text-gray-700 mr-2">
          <b>Impuesto</b>
        </div>
        <div className="text-gray-700 font-bold text-lg">
          $
          {(
            (Number(price + (price / 100) * Number(invoiceData.revenue ?? 0)) /
              100) *
            invoiceData.tax
          ).toFixed(2)}
        </div>
      </div>
      <div className="flex flex-col items-end mb-8">
        <div className="text-gray-700 mr-2 font-bold">Total</div>
        <div className="text-gray-700 font-bold text-xl">
          $
          {(
            Number(price + (price / 100) * Number(invoiceData.revenue ?? 0)) +
            (Number(price + (price / 100) * Number(invoiceData.revenue ?? 0)) /
              100) *
              invoiceData.tax
          ).toFixed(2)}
        </div>
      </div>
      <div className="border-t-2 border-gray-300 pt-6 mb-4">
        <div className="text-gray-700 mb-2">
          Recibo no valido como factura. Los pagos deben acompañarse de un
          comprobante.
        </div>
        <div className="text-gray-700">
          {invoiceData.organization} - San Juan 671, Corrientes, Argentina
        </div>
      </div>
      <div className="flex justify-end">
        <PDFDownloadLink
          document={
            <InvoicePDF
              invoiceData={invoiceData}
              clientData={clientData}
              equipment={equipment}
              price={price}
            />
          }
          fileName={`${clientData.name}_${clientData.lastName}_${invoiceID}.pdf`}
        >
          {({ loading }) => (
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg  hover:cursor-pointer">
              {loading ? "Generando..." : "Descargar PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>
    </AddLayout>
  );
}
