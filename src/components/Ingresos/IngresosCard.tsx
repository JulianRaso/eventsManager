import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

interface IngresosCardProps {
  booking: {
    id: number;
    client: { name: string; lastName: string } | null;
    organization: string;
    event_date: string;
    event_type: EventType;
    payment_status: PaymentStatus;
    price: number;
  };
}

export default function IngresosCard({ booking }: IngresosCardProps) {
  const navigate = useNavigate();
  const { id, client, organization, event_date, event_type, payment_status, price } =
    booking;
  const badge = paymentBadge[payment_status];

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 truncate font-medium text-foreground">
          {client ? `${client.name} ${client.lastName}` : "-"}
        </h3>
        <span className="shrink-0 font-medium tabular-nums text-foreground">
          ${typeof price === "number" ? price.toLocaleString("es-AR") : price}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        {formatDate(event_date)} · {eventTypes[event_type]}
      </p>
      <p className="text-sm text-muted-foreground">{organization}</p>
      <span
        className={cn(
          "inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
          badge.className
        )}
      >
        {badge.label}
      </span>
      <div className="pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/recibo/${id}`)}
        >
          <FileText className="mr-1 h-3.5 w-3.5" />
          Recibo
        </Button>
      </div>
    </article>
  );
}
