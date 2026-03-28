import { useState } from "react";
import { ArrowLeft, Calendar, CreditCard, FileText, MapPin, Package, Pencil, Phone, Plus, Receipt, Trash2, User, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import MiniSpinner from "../components/MiniSpinner";
import Filter from "../components/Filter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import useGetBookingEvent from "../hooks/useGetBookingEvent";
import useGetBookingPersonal from "../hooks/useGetBookingPersonal";
import { useAssignPersonal } from "../hooks/useAssignPersonal";
import useGetPersonal from "../hooks/useGetPersonal";
import useGetBookingPayments from "../hooks/useGetBookingPayments";
import useBookingPayments from "../hooks/useBookingPayments";
import useGetBookingBills from "../hooks/useGetBookingBills";
import useBookingBills from "../hooks/useBookingBills";
import useManageBookingItems from "../hooks/useManageBookingItems";
import usePatchBooking from "../hooks/usePatchBooking";
import useGetStockAvailability from "../hooks/useGetStockAvailability";
import { formatDate } from "../components/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { cn } from "../lib/utils";
import { PersonaledProps, BookingStatus } from "../types";

const filterByCategory = [
  { value: "sound", label: "Sonido" },
  { value: "lights", label: "Iluminación" },
  { value: "ambientation", label: "Ambientación" },
  { value: "structure", label: "Estructuras" },
  { value: "cables", label: "Cables" },
  { value: "screen", label: "Pantalla" },
  { value: "furniture", label: "Muebles" },
  { value: "tools", label: "Herramientas" },
  { value: "others", label: "Otros" },
];

const eventTypes: Record<string, string> = {
  other: "Otro",
  fifteen_party: "Quince Años",
  corporate: "Corporativo",
  marriage: "Casamiento",
  birthday: "Cumpleaños",
};

const bookingStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  confirm: {
    label: "Confirmado",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  pending: {
    label: "Pendiente",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  cancel: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

const paymentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
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
    label: "Pago pendiente",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

const roleLabels: Record<string, string> = {
  tecnico: "Técnico",
  sonidista: "Sonidista",
  iluminador: "Iluminador",
  chofer: "Chofer",
  coordinador: "Coordinador",
  otro: "Otro",
};

export default function EventoDetalle() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const id = Number(bookingId);
  const { booking, items, isLoading } = useGetBookingEvent(id);
  const { data: assignments } = useGetBookingPersonal(id);
  const { data: allPersonal } = useGetPersonal();
  const { isAssigning, assignPersonal, isRemoving, removeAssignment } =
    useAssignPersonal(id);
  const { payments } = useGetBookingPayments(id);
  const { registerPayment, isAdding: isAddingPayment, removePayment, isRemoving: isRemovingPayment } =
    useBookingPayments(id);
  const { addItem, isAdding: isAddingItem, removeItem, isRemoving: isRemovingItem } =
    useManageBookingItems(id);
  const { patch: patchBooking } = usePatchBooking(id);
  const { bills } = useGetBookingBills(id);
  const { addBill, isAdding: isAddingBill, removeBill, isRemoving: isRemovingBill } = useBookingBills(id);

  // Equipment dialog state
  const [showEquipDialog, setShowEquipDialog] = useState(false);
  const [equipCategory, setEquipCategory] = useState("all");
  const [equipFilter, setEquipFilter] = useState("");
  const [equipQty, setEquipQty] = useState<Record<number, string>>({});
  const { availability, isLoading: isLoadingStock } = useGetStockAvailability();

  // Booking status inline edit
  const [editingStatus, setEditingStatus] = useState(false);

  // Price inline edit
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState("");

  const [showGastoForm, setShowGastoForm] = useState(false);
  const [gastoName, setGastoName] = useState("");
  const [gastoAmount, setGastoAmount] = useState("");
  const [gastoPaidWith, setGastoPaidWith] = useState<"cash" | "card" | "transfer" | "bank check">("cash");
  const [gastoPaidBy, setGastoPaidBy] = useState("");
  const [gastoPaidTo, setGastoPaidTo] = useState("");

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "transfer" | "card">("cash");
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payNotes, setPayNotes] = useState("");
  const [selectedPersonalId, setSelectedPersonalId] = useState("");
  const [assignDays, setAssignDays] = useState("1");
  const [assignRate, setAssignRate] = useState("");

  function handlePersonalSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const pid = Number(e.target.value);
    setSelectedPersonalId(e.target.value);
    const person = (allPersonal as PersonaledProps[]).find((p) => p.id === pid);
    if (person) setAssignRate(String(person.daily_rate));
  }

  function handleAssign() {
    if (!selectedPersonalId || !assignDays || !assignRate) return;
    assignPersonal(
      {
        booking_id: id,
        personal_id: Number(selectedPersonalId),
        days: Number(assignDays),
        rate: Number(assignRate),
      },
      {
        onSuccess: () => {
          setShowAssignForm(false);
          setSelectedPersonalId("");
          setAssignDays("1");
          setAssignRate("");
        },
      }
    );
  }

  function handleRegisterPayment() {
    if (!payAmount || Number(payAmount) <= 0) return;
    registerPayment(
      {
        booking_id: id,
        amount: Number(payAmount),
        payment_method: payMethod,
        payment_date: payDate,
        notes: payNotes || undefined,
      },
      {
        onSuccess: () => {
          setShowPaymentForm(false);
          setPayAmount("");
          setPayMethod("cash");
          setPayDate(new Date().toISOString().slice(0, 10));
          setPayNotes("");
        },
      }
    );
  }

  const personnelCost = assignments.reduce(
    (sum, a) => sum + a.days * a.rate,
    0
  );

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = (booking?.price ?? 0) - totalCollected;

  if (isLoading) return <Spinner />;
  if (!booking) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Evento no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/reservas")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Reservas
        </Button>
      </div>
    );
  }

  const client = booking.client as {
    name: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
  } | null;

  const bookingStatus = bookingStatusConfig[booking.booking_status] ?? {
    label: booking.booking_status,
    className: "",
  };
  const paymentStatus = paymentStatusConfig[booking.payment_status] ?? {
    label: booking.payment_status,
    className: "",
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subtotalWithRevenue =
    subtotal + (subtotal / 100) * (booking.revenue ?? 0);
  const tax = (subtotalWithRevenue / 100) * (booking.tax ?? 0);
  const total = subtotalWithRevenue + tax;

  const gastosTotal = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const costoTotal = total + personnelCost + gastosTotal;
  const precioBase = booking.price ?? 0;
  const ivaAmount = (precioBase / 100) * (booking.tax ?? 0);
  const totalCliente = precioBase + ivaAmount;
  const margen = precioBase - costoTotal;
  const margenPct = precioBase > 0 ? (margen / precioBase) * 100 : 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="w-fit text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/reservas")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Reservas
      </Button>

      {/* Header card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {booking.organization}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-foreground">
              {eventTypes[booking.event_type] ?? booking.event_type}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {editingStatus ? (
              <select
                autoFocus
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
                defaultValue={booking.booking_status}
                onBlur={() => setEditingStatus(false)}
                onChange={(e) => {
                  patchBooking({ booking_status: e.target.value as BookingStatus });
                  setEditingStatus(false);
                }}
              >
                <option value="confirm">Confirmado</option>
                <option value="pending">Pendiente</option>
                <option value="cancel">Cancelado</option>
              </select>
            ) : (
              <button
                type="button"
                title="Cambiar estado"
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-70",
                  bookingStatus.className
                )}
                onClick={() => setEditingStatus(true)}
              >
                {bookingStatus.label}
              </button>
            )}
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                paymentStatus.className
              )}
            >
              {paymentStatus.label}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => navigate(`/presupuesto/${id}`)}
            >
              <FileText className="h-3.5 w-3.5" />
              Presupuesto
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(booking.event_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {booking.place}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Precio base</span>
            {editingPrice ? (
              <form
                className="flex items-center gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = Number(priceInput);
                  if (!isNaN(val) && val >= 0) patchBooking({ price: val });
                  setEditingPrice(false);
                }}
              >
                <Input
                  autoFocus
                  type="number"
                  min={0}
                  className="h-7 w-32 text-sm"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  onBlur={() => setEditingPrice(false)}
                />
                <Button type="submit" size="sm" className="h-7 px-2 text-xs">
                  OK
                </Button>
              </form>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:opacity-70"
                onClick={() => {
                  setPriceInput(String(booking.price ?? 0));
                  setEditingPrice(true);
                }}
              >
                ${formatCurrency(booking.price ?? 0)}
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-7">
        {/* Costo equipamiento */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Costo equipo
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
            ${formatCurrency(total)}
          </p>
          {booking.revenue > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {booking.revenue}% margen incluido
            </p>
          )}
        </div>

        {/* Costo personal */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Costo personal
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
            ${formatCurrency(personnelCost)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {assignments.length} empleado{assignments.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Costo gastos */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Gastos
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
            ${formatCurrency(gastosTotal)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {bills.length} gasto{bills.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Precio sugerencia */}
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Precio sugerido
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
            ${formatCurrency(costoTotal)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            equipo + personal + gastos
          </p>
        </div>

        {/* Precio base acordado */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Precio base
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
            ${formatCurrency(precioBase)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">sin IVA</p>
        </div>

        {/* IVA + Total cliente */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total al cliente
          </p>
          <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
            ${formatCurrency(totalCliente)}
          </p>
          {booking.tax > 0 ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              IVA {booking.tax}% · +${formatCurrency(ivaAmount)}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">sin IVA</p>
          )}
        </div>

        {/* Margen */}
        <div
          className={cn(
            "rounded-xl border p-4 shadow-sm",
            margen >= 0
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          )}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Margen
          </p>
          <p
            className={cn(
              "mt-1 text-base font-semibold tabular-nums",
              margen >= 0
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-red-700 dark:text-red-400"
            )}
          >
            ${formatCurrency(Math.abs(margen))}
          </p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              margen >= 0
                ? "text-emerald-600 dark:text-emerald-500"
                : "text-red-600 dark:text-red-500"
            )}
          >
            {margen >= 0 ? "+" : "-"}{Math.abs(margenPct).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Cliente */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-4 w-4" />
            Cliente
          </h2>
          {client ? (
            <div className="flex flex-col gap-1.5">
              <p className="font-medium text-foreground">
                {client.name} {client.lastName}
              </p>
              {client.phoneNumber && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {client.phoneNumber}
                </p>
              )}
              {client.email && (
                <p className="text-sm text-muted-foreground">{client.email}</p>
              )}
              <p className="text-xs text-muted-foreground">
                DNI {booking.client_dni}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin datos de cliente</p>
          )}
        </div>

        {/* Comentarios */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Comentarios
          </h2>
          <p className="text-sm text-foreground">
            {booking.comments?.trim() ? booking.comments : "Sin comentarios."}
          </p>
        </div>
      </div>

      {/* Equipamiento */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Package className="h-4 w-4" />
            Equipamiento asignado
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEquipDialog(true)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Agregar
          </Button>
        </div>

        <Dialog open={showEquipDialog} onOpenChange={setShowEquipDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Agregar equipo</DialogTitle>
            </DialogHeader>
            <Filter
              filterByName={equipFilter}
              filterByStatus={filterByCategory}
              setFilterByName={setEquipFilter}
              value={equipCategory === "all" ? "" : equipCategory}
              setValue={(v) => setEquipCategory(v || "all")}
            />
            <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
              {isLoadingStock ? (
                <div className="flex items-center justify-center py-12">
                  <MiniSpinner />
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-3 py-1.5 text-left font-medium text-muted-foreground">Equipo</th>
                      <th className="px-3 py-1.5 text-center font-medium text-muted-foreground">Dispon.</th>
                      <th className="px-3 py-1.5 text-center font-medium text-muted-foreground">Precio</th>
                      <th className="px-3 py-1.5 text-center font-medium text-muted-foreground">Cant.</th>
                      <th className="px-3 py-1.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {availability
                      .filter((s) => {
                        const matchCat = equipCategory === "all" || s.category === equipCategory;
                        const matchText = equipFilter === "" || s.name.toLowerCase().includes(equipFilter.toLowerCase());
                        return matchCat && matchText;
                      })
                      .map((s) => (
                        <tr key={s.id} className={`border-b border-border last:border-0 ${s.available === 0 ? "opacity-40" : ""}`}>
                          <td className="px-3 py-1.5">{s.name}</td>
                          <td className="px-3 py-1.5 text-center tabular-nums text-muted-foreground">
                            {s.available}
                          </td>
                          <td className="px-3 py-1.5 text-center tabular-nums text-muted-foreground">
                            ${formatCurrency(s.price)}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <Input
                              type="number"
                              min={1}
                              max={s.available}
                              className="h-6 w-14 text-center text-xs"
                              disabled={s.available === 0}
                              value={equipQty[s.id] ?? ""}
                              onChange={(e) =>
                                setEquipQty((prev) => ({ ...prev, [s.id]: e.target.value }))
                              }
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-6 px-2"
                              disabled={isAddingItem || s.available === 0 || !equipQty[s.id] || Number(equipQty[s.id]) <= 0 || Number(equipQty[s.id]) > s.available}
                              onClick={() => {
                                addItem(
                                  {
                                    equipment_id: s.id,
                                    name: s.name,
                                    quantity: Number(equipQty[s.id]),
                                    price: s.price,
                                  },
                                  {
                                    onSuccess: () =>
                                      setEquipQty((prev) => ({ ...prev, [s.id]: "" })),
                                  }
                                );
                              }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cerrar
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Nombre
                    </th>
                    <th className="px-5 py-3 text-center font-medium text-muted-foreground">
                      Cantidad
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Precio unit.
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr
                      key={item.id ?? i}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3 text-foreground">{item.name}</td>
                      <td className="px-5 py-3 text-center tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        ${formatCurrency(item.price)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums">
                        ${formatCurrency(item.price * item.quantity)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          disabled={isRemovingItem}
                          onClick={() => item.id && removeItem(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-4">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between gap-10">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold tabular-nums text-foreground">
                    ${formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No hay equipamiento asignado. Usá "Agregar" para incorporar ítems.
          </p>
        )}
      </div>

      {/* Personal asignado */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-4 w-4" />
            Personal asignado
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAssignForm((v) => !v)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Asignar
          </Button>
        </div>

        {/* Formulario inline de asignación */}
        {showAssignForm && (
          <div className="border-b border-border bg-muted/20 px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Empleado
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedPersonalId}
                  onChange={handlePersonalSelect}
                >
                  <option value="">Seleccionar...</option>
                  {(allPersonal as PersonaledProps[]).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.lastName} — {roleLabels[p.role] ?? p.role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Días
                </label>
                <Input
                  type="number"
                  min={1}
                  value={assignDays}
                  onChange={(e) => setAssignDays(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Tarifa/día ($)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={assignRate}
                  onChange={(e) => setAssignRate(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isAssigning || !selectedPersonalId}
                onClick={handleAssign}
              >
                {isAssigning ? "Guardando..." : "Confirmar"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAssignForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {assignments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Nombre
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                      Rol
                    </th>
                    <th className="px-5 py-3 text-center font-medium text-muted-foreground">
                      Días
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Tarifa/día
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3 font-medium text-foreground">
                        {a.personal
                          ? `${a.personal.name} ${a.personal.lastName}`
                          : `#${a.personal_id}`}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                        {a.personal
                          ? (roleLabels[a.personal.role] ?? a.personal.role)
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-center tabular-nums">
                        {a.days}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        ${formatCurrency(a.rate)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums">
                        ${formatCurrency(a.days * a.rate)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          disabled={isRemoving}
                          onClick={() => removeAssignment(a.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-4">
              <div className="flex items-center gap-10 text-sm">
                <span className="text-muted-foreground">Costo de personal</span>
                <span className="font-bold tabular-nums text-foreground">
                  ${formatCurrency(personnelCost)}
                </span>
              </div>
            </div>
          </>
        ) : (
          !showAssignForm && (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No hay personal asignado a este evento.
            </p>
          )
        )}
      </div>

      {/* Pagos */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Pagos recibidos
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPaymentForm((v) => !v)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Registrar pago
          </Button>
        </div>

        {/* Formulario inline de pago */}
        {showPaymentForm && (
          <div className="border-b border-border bg-muted/20 px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Monto ($)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Método
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={payMethod}
                  onChange={(e) =>
                    setPayMethod(e.target.value as "cash" | "transfer" | "card")
                  }
                >
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="card">Tarjeta</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Fecha
                </label>
                <Input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Notas
                </label>
                <Input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isAddingPayment || !payAmount}
                onClick={handleRegisterPayment}
              >
                {isAddingPayment ? "Guardando..." : "Confirmar"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {payments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Fecha
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Método
                    </th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                      Notas
                    </th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Monto
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3 text-foreground">
                        {formatDate(p.payment_date)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {p.payment_method === "cash"
                          ? "Efectivo"
                          : p.payment_method === "transfer"
                          ? "Transferencia"
                          : "Tarjeta"}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                        {p.notes ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                        ${formatCurrency(p.amount)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => navigate(`/recibo/${id}`)}
                        >
                          <FileText className="mr-1 h-3.5 w-3.5" />
                          Recibo
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          disabled={isRemovingPayment}
                          onClick={() => removePayment(p.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-4">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between gap-10">
                  <span className="text-muted-foreground">Precio del evento</span>
                  <span className="tabular-nums">
                    ${formatCurrency(booking.price ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between gap-10">
                  <span className="text-muted-foreground">Cobrado</span>
                  <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
                    ${formatCurrency(totalCollected)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-10 border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Saldo pendiente</span>
                  <span
                    className={cn(
                      "font-bold tabular-nums",
                      balance <= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    ${formatCurrency(Math.max(balance, 0))}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          !showPaymentForm && (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No hay pagos registrados para este evento.
            </p>
          )
        )}
      </div>

      {/* Gastos del evento */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Receipt className="h-4 w-4" />
            Gastos del evento
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowGastoForm((v) => !v)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Agregar gasto
          </Button>
        </div>

        {showGastoForm && (
          <div className="border-b border-border px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Descripción
                </label>
                <Input
                  placeholder="Ej: Combustible, Catering..."
                  value={gastoName}
                  onChange={(e) => setGastoName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Monto ($)
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={gastoAmount}
                  onChange={(e) => setGastoAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Método de pago
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                  value={gastoPaidWith}
                  onChange={(e) => setGastoPaidWith(e.target.value as typeof gastoPaidWith)}
                >
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="card">Tarjeta</option>
                  <option value="bank check">Cheque</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Pagado por
                </label>
                <Input
                  placeholder="Nombre"
                  value={gastoPaidBy}
                  onChange={(e) => setGastoPaidBy(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Pagado a (opcional)
                </label>
                <Input
                  placeholder="Proveedor o persona"
                  value={gastoPaidTo}
                  onChange={(e) => setGastoPaidTo(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowGastoForm(false);
                  setGastoName("");
                  setGastoAmount("");
                  setGastoPaidBy("");
                  setGastoPaidTo("");
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isAddingBill || !gastoName || !gastoAmount || !gastoPaidBy}
                onClick={() => {
                  addBill(
                    {
                      name: gastoName,
                      amount: Number(gastoAmount),
                      paid_with: gastoPaidWith,
                      paid_by: gastoPaidBy,
                      paid_to: gastoPaidTo || undefined,
                      quantity: 1,
                      updated_by: "",
                    },
                    {
                      onSuccess: () => {
                        setShowGastoForm(false);
                        setGastoName("");
                        setGastoAmount("");
                        setGastoPaidBy("");
                        setGastoPaidTo("");
                      },
                    }
                  );
                }}
              >
                {isAddingBill ? "Guardando..." : "Guardar gasto"}
              </Button>
            </div>
          </div>
        )}

        {bills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                    Descripción
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                    Pagado por
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                    Método
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                    Monto
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground">{b.name}</td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                      {b.paid_by}
                      {b.paid_to ? ` → ${b.paid_to}` : ""}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                      {b.paid_with === "cash"
                        ? "Efectivo"
                        : b.paid_with === "transfer"
                        ? "Transferencia"
                        : b.paid_with === "card"
                        ? "Tarjeta"
                        : "Cheque"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums text-foreground">
                      ${formatCurrency(b.amount)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        disabled={isRemovingBill}
                        onClick={() => removeBill(b.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-3">
              <div className="flex items-center gap-10 text-sm">
                <span className="text-muted-foreground">Total gastos del evento</span>
                <span className="font-bold tabular-nums">
                  ${formatCurrency(gastosTotal)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          !showGastoForm && (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No hay gastos registrados para este evento.
            </p>
          )
        )}
      </div>
    </div>
  );
}
