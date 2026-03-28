import { useMemo } from "react";
import { ArrowRightLeft, Banknote, CreditCard, DollarSign } from "lucide-react";
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
import { KPICard } from "@/components/ui/KPICard";
import { useDeleteInvoice } from "@/hooks/useDeleteInvoice";
import useGetBills from "@/hooks/UseGetBills";
import { formatCurrency } from "@/utils/formatCurrency";

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
} as const;

type PaidWithKey = keyof typeof paidTypes;

interface InvoiceRow {
  id: number;
  name: string;
  quantity: number;
  amount: number;
  paid_with: PaidWithKey;
  paid_by: string;
  created_at?: string;
  booking_id?: number;
}

export default function Bill() {
  const { data, isLoading } = useGetBills();
  const { isDeleting, deleteInvoice } = useDeleteInvoice();

  const totals = useMemo(() => {
    const bills = (data as InvoiceRow[]) ?? [];
    const sum = (filter: (b: InvoiceRow) => boolean) =>
      bills.filter(filter).reduce((acc, b) => acc + (b.amount ?? 0), 0);
    return {
      total: sum(() => true),
      cash: sum((b) => b.paid_with === "cash"),
      transfer: sum((b) => b.paid_with === "transfer"),
      card: sum((b) => b.paid_with === "card"),
    };
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <CategoryLayout title="Gastos">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <KPICard
            title="Total"
            value={`$${formatCurrency(totals.total)}`}
            icon={DollarSign}
            variant="primary"
          />
          <KPICard
            title="Efectivo"
            value={`$${formatCurrency(totals.cash)}`}
            icon={Banknote}
            variant="success"
          />
          <KPICard
            title="Transferencia"
            value={`$${formatCurrency(totals.transfer)}`}
            icon={ArrowRightLeft}
            variant="info"
          />
          <KPICard
            title="Tarjeta"
            value={`$${formatCurrency(totals.card)}`}
            icon={CreditCard}
            variant="warning"
          />
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableData>
                <AddButton navigateTo="/gastos/agregar" label="Nuevo gasto" />
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
                (data as InvoiceRow[])?.map((invoice: InvoiceRow, index: number) => (
                  <TableRow key={invoice.id}>
                    <TableData>{index + 1}</TableData>
                    <TableData>{invoice.name}</TableData>
                    <TableData>{invoice.quantity}</TableData>
                    <TableData>${invoice.amount}</TableData>
                    <TableData>
                      {invoice.booking_id ? invoice.booking_id : "-"}
                    </TableData>
                    <TableData>{invoice.paid_by}</TableData>
                    <TableData>{paidTypes[invoice.paid_with].es}</TableData>
                    <TableData>{invoice.created_at ? formatDateTime(invoice.created_at) : "-"}</TableData>
                    <TableData>
                      <TableButtons
                        id={invoice.id}
                        route="/gastos/editar"
                        isDeleting={isDeleting}
                        onDelete={deleteInvoice}
                        deleteLabel="este gasto"
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
