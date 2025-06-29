import AddButton from "@/components/AddButton";
import CategoryLayout from "@/components/CategoryLayout";
import { formatDateTime } from "@/components/formatDate";
import Spinner from "@/components/Spinner";
import {
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableRow,
} from "@/components/Table";
import TableButtons from "@/components/TableButtons";
import { useDeleteInvoice } from "@/hooks/useDeleteInvoice";
import useGetBills from "@/hooks/UseGetBills";

const paidTypes = {
  cash: {
    es: "Efectivo",
    en: "Cash",
  },
  card: {
    es: "Tarjeta",
    en: "Card",
  },
  transfer: {
    es: "Transferencia",
    en: "Transfer",
  },
  "bank check": {
    es: "Cheque",
    en: "Check",
  },
};

export default function Bill() {
  const { data, isLoading } = useGetBills();
  const { isDeleting, deleteInvoice } = useDeleteInvoice();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <CategoryLayout title="Gastos">
        <TableContainer>
          <Table>
            <TableHead>
              <TableData>
                <AddButton navigateTo="/gastos/agregar" />
              </TableData>
              <TableData>Nombre</TableData>
              <TableData>Cantidad</TableData>
              <TableData>Precio</TableData>
              <TableData>Evento</TableData>
              <TableData>Abonado por</TableData>
              <TableData>Abonado con</TableData>
              <TableData>Fecha</TableData>
              <TableData>Acciones</TableData>
            </TableHead>
            <TableBody>
              {data?.length != 0 &&
                data?.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableData>{index + 1}</TableData>
                    <TableData>{invoice.name}</TableData>
                    <TableData>{invoice.quantity}</TableData>
                    <TableData>${invoice.amount}</TableData>
                    <TableData>
                      {invoice.booking_id ? invoice.booking_id : "-"}
                    </TableData>
                    <TableData>{invoice.paid_by}</TableData>
                    <TableData>{paidTypes[invoice.paid_with].es}</TableData>
                    <TableData>{formatDateTime(invoice.created_at)}</TableData>
                    <TableData>
                      <TableButtons
                        id={invoice.id}
                        route="/gastos/editar"
                        isDeleting={isDeleting}
                        onDelete={deleteInvoice}
                      />
                    </TableData>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {data?.length === 0 && (
            <div className="text-xl text-center mt-4">
              Comenza a cargar tus gastos...
            </div>
          )}
        </TableContainer>
      </CategoryLayout>
    </div>
  );
}
