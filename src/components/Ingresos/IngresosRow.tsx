import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TableData, TableRow } from "@/components/Table";
import { formatDate } from "@/components/formatDate";
import { cn } from "@/lib/utils";
import { EventType, PaymentStatus } from "@/types";

const eventTypes: Record<EventType, string> = {
  other: "Otro",
  fifteen_party: "Quince Años",
  corporate: "Corporativo",
  marriage: "Casamiento",
  birthday: "Cumpleaños",
};

const paymentBadge: Record<PaymentStatus, { label: string; className: string }> = {
  paid: {
    label: "Abonado",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  partially_paid: {
    label: "Señado",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  pending: {
    label: "Pendiente",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

interface IngresosRowProps {
  booking: {
    id: number;
    client: { name: string; lastName: string } | null;
    organization: string;
    event_date: string;
    event_type: EventType;
    payment_status: PaymentStatus;
    price: number;
  };
  index: number;
}

export default function IngresosRow({ booking, index }: IngresosRowProps) {
  const navigate = useNavigate();
  const { id, client, organization, event_date, event_type, payment_status, price } =
    booking;
  const badge = paymentBadge[payment_status];

  return (
    <TableRow>
      <TableData>{index + 1}</TableData>
      <TableData>
        {client ? `${client.name} ${client.lastName}` : "-"}
      </TableData>
      <TableData>{organization}</TableData>
      <TableData>{formatDate(event_date)}</TableData>
      <TableData className="hidden lg:table-cell">
        {eventTypes[event_type]}
      </TableData>
      <TableData>
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
            badge.className
          )}
        >
          {badge.label}
        </span>
      </TableData>
      <TableData className="font-medium tabular-nums">
        ${typeof price === "number" ? price.toLocaleString("es-AR") : price}
      </TableData>
      <TableData>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(`/recibo/${id}`)}
        >
          <FileText className="mr-1 h-3.5 w-3.5" />
          Recibo
        </Button>
      </TableData>
    </TableRow>
  );
}
