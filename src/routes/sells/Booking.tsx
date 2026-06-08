import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, Loader2, Package, Plus, Receipt, Trash2, Users } from "lucide-react";
import Spinner from "../../components/Spinner";
import EquipmentPickerDialog from "../../components/Booking/EquipmentPickerDialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAddBooking } from "../../hooks/useAddBooking";
import useUpdateBooking from "../../hooks/useUpdateBooking";
import useGetStockAvailability from "../../hooks/useGetStockAvailability";
import useGetPersonal from "../../hooks/useGetPersonal";
import useGetBookingEvent from "../../hooks/useGetBookingEvent";
import useGetBookingPersonal from "../../hooks/useGetBookingPersonal";
import { useAssignPersonal } from "../../hooks/useAssignPersonal";
import useGetBookingPayments from "../../hooks/useGetBookingPayments";
import useBookingPayments from "../../hooks/useBookingPayments";
import useGetBookingBills from "../../hooks/useGetBookingBills";
import useBookingBills from "../../hooks/useBookingBills";
import useManageBookingItems from "../../hooks/useManageBookingItems";
import { getCurrentBooking } from "../../services/booking";
import { checkClient } from "../../services/client";
import { fromDDMMYYYY } from "../../components/formatDate";
import type { eventData } from "../../types/Booking-typ";
import { formatCurrency } from "../../utils/formatCurrency";
import { cn } from "../../lib/utils";
import type { PersonaledProps } from "../../types";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

type LocalEquipItem = {
  equipment_id: number;
  name: string;
  price: number;
  quantity: number;
};

type LocalPersonalItem = {
  personal_id: number;
  display_name: string;
  role: string;
  days: number;
  rate: number;
};

type BookingEditView = "general" | "materials" | "costs";

const roleLabels: Record<string, string> = {
  tecnico: "Técnico",
  sonidista: "Sonidista",
  iluminador: "Iluminador",
  chofer: "Chofer",
  operario: "Operario",
  asistente: "Asistente",
  coordinador: "Coordinador",
  otro: "Otro",
};

export default function Booking() {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { errors },
  } = useForm<eventData>({
    defaultValues: {
      booking_status: "pending",
      payment_status: "pending",
      tax: 0,
      price: 0,
    },
  });

  const { isAdding, addBooking } = useAddBooking();
  const { isUpdating, updateBooking } = useUpdateBooking();

  const [dni, setDni] = useState(0);
  const [existClient, setExistClient] = useState(false);
  const [checkingClient, setCheckingClient] = useState(false);

  const bookingId = Number(useParams().bookingId);
  const isEditingSession = Boolean(bookingId);
  const [isLoadingBooking, setIsLoadingBooking] = useState(bookingId ? true : false);
  const [loadedRevenue, setLoadedRevenue] = useState(0);

  // Create-mode local state
  const [localEquipment, setLocalEquipment] = useState<LocalEquipItem[]>([]);
  const [localPersonal, setLocalPersonal] = useState<LocalPersonalItem[]>([]);
  const [showEquipDialog, setShowEquipDialog] = useState(false);
  const [showPersonalDialog, setShowPersonalDialog] = useState(false);
  const [personalDays, setPersonalDays] = useState<Record<number, string>>({});
  const [personalRate, setPersonalRate] = useState<Record<number, string>>({});

  const watchPrice = watch("price") ?? 0;
  const watchTax = watch("tax") ?? 0;
  const watchEventDate = watch("event_date");
  const watchStartTime = watch("start_time");
  const watchEndTime = watch("end_time");

  // Pickers (always initialized — hooks can't be conditional)
  const {
    availability,
    isLoading: isLoadingStock,
    hasIncompleteTimes,
    hasTimeContext,
  } = useGetStockAvailability({
    date: watchEventDate || undefined,
    startTime: watchStartTime,
    endTime: watchEndTime,
    excludeBookingId: isEditingSession ? bookingId : undefined,
    localItems: isEditingSession
      ? []
      : localEquipment.map((e) => ({
          equipment_id: e.equipment_id,
          quantity: e.quantity,
        })),
  });
  const { data: personalList = [] } = useGetPersonal();

  // Edit-mode: related data (always initialized; queries are enabled only with bookingId)
  const { items: bookingItems = [] } = useGetBookingEvent(bookingId);
  const { data: assignments = [] } = useGetBookingPersonal(bookingId);
  const { isAssigning, assignPersonal, isRemoving: isRemovingAssignment, removeAssignment } =
    useAssignPersonal(bookingId);
  const { payments = [] } = useGetBookingPayments(bookingId);
  const {
    registerPayment,
    isAdding: isAddingPayment,
    removePayment,
    isRemoving: isRemovingPayment,
  } = useBookingPayments(bookingId);
  const { bills = [] } = useGetBookingBills(bookingId);
  const {
    addBill,
    isAdding: isAddingBill,
    removeBill,
    isRemoving: isRemovingBill,
  } = useBookingBills(bookingId);
  const {
    addItem,
    isAdding: isAddingItem,
    removeItem,
    isRemoving: isRemovingItem,
  } = useManageBookingItems(bookingId);

  // Edit-mode view state
  const [activeView, setActiveView] = useState<BookingEditView>("general");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedPersonalId, setSelectedPersonalId] = useState("");
  const [assignDays, setAssignDays] = useState("1");
  const [assignRate, setAssignRate] = useState("");

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "transfer" | "card">("cash");
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payNotes, setPayNotes] = useState("");

  const [showGastoForm, setShowGastoForm] = useState(false);
  const [gastoName, setGastoName] = useState("");
  const [gastoAmount, setGastoAmount] = useState("");
  const [gastoPaidWith, setGastoPaidWith] = useState<
    "cash" | "card" | "transfer" | "bank check"
  >("cash");
  const [gastoPaidBy, setGastoPaidBy] = useState("");
  const [gastoPaidTo, setGastoPaidTo] = useState("");

  // Financial calculations
  const costoEquipo = localEquipment.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const costoPersonal = localPersonal.reduce((sum, p) => sum + p.days * p.rate, 0);
  const costoTotal = costoEquipo + costoPersonal;
  const ivaAmount = (Number(watchPrice) / 100) * Number(watchTax);
  const totalCliente = Number(watchPrice) + ivaAmount;
  const margen = Number(watchPrice) - costoTotal;

  // Edit-mode financials (based on persisted relations)
  const itemsSubtotal = bookingItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsCostTotal = itemsSubtotal + (itemsSubtotal / 100) * Number(watchTax);
  const personnelCost = assignments.reduce((sum, a) => sum + a.days * a.rate, 0);
  const billsTotal = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const editCostoTotal = itemsCostTotal + personnelCost + billsTotal;
  const editMargen = Number(watchPrice) - editCostoTotal;
  const editMargenPct = Number(watchPrice) > 0 ? (editMargen / Number(watchPrice)) * 100 : 0;

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = totalCliente - totalCollected;

  function handlePersonalSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const pid = Number(e.target.value);
    setSelectedPersonalId(e.target.value);
    const person = (personalList as PersonaledProps[]).find((p) => p.id === pid);
    if (person) setAssignRate(String(person.daily_rate));
  }

  function handleAssign() {
    if (!selectedPersonalId || !assignDays || !assignRate) return;
    assignPersonal(
      {
        booking_id: bookingId,
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
        booking_id: bookingId,
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

  // Cargar datos al editar
  useEffect(() => {
    if (!isEditingSession) return;
    getCurrentBooking(bookingId)
      .then((res = []) => {
        if (!res || res.length === 0) {
          toast.error("No se encontró la reserva");
          navigate("/reservas");
          return;
        }
        const b = res[0];
        setValue("event_date", b.event_date);
        if (b.start_time) setValue("start_time", b.start_time.slice(0, 5));
        if (b.end_time) setValue("end_time", b.end_time.slice(0, 5));
        setValue("place", b.place);
        setValue("organization", b.organization);
        setValue("booking_status", b.booking_status);
        setValue("payment_status", b.payment_status);
        setValue("event_type", b.event_type);
        setValue("tax", b.tax ?? 0);
        setValue("price", b.price ?? 0);
        setLoadedRevenue(b.revenue ?? 0);
        if (b.comments) setValue("comments", b.comments);

        checkClient(b.client_dni).then((res) => {
          if (res.data) {
            const { dni, name, lastName, phoneNumber, email } = res.data;
            setValue("dni", dni);
            setValue("name", name);
            setValue("lastName", lastName);
            setValue("phoneNumber", phoneNumber);
            if (email) setValue("email", email);
            setExistClient(true);
          }
          setIsLoadingBooking(false);
        });
      })
      .catch(() => {
        toast.error("Error al cargar la reserva");
        setIsLoadingBooking(false);
      });
  }, [isEditingSession, bookingId, setValue, navigate]);

  // Auto-completar cliente por DNI
  useEffect(() => {
    if (dni === 0 || isEditingSession) return;
    setCheckingClient(true);
    checkClient(dni)
      .then((res) => {
        if (!res.data) {
          setExistClient(false);
          resetField("name");
          resetField("lastName");
          resetField("phoneNumber");
          resetField("email");
          return;
        }
        const { name, lastName, phoneNumber, email } = res.data;
        setValue("name", name);
        setValue("lastName", lastName);
        setValue("phoneNumber", phoneNumber);
        if (email) setValue("email", email);
        setExistClient(true);
      })
      .catch(() => toast.error("Error al verificar el cliente"))
      .finally(() => setCheckingClient(false));
  }, [dni, setValue, resetField, isEditingSession]);

  if (isLoadingBooking) return <Spinner />;

  function handleCheckClient(value: string) {
    const n = Number(value);
    if (n > 999999 && n < 100000000) return setDni(n);
    if (value === "") {
      reset();
      setExistClient(false);
    }
  }

  function handleAddEquipment(item: {
    equipment_id: number;
    name: string;
    quantity: number;
    price: number;
  }) {
    if (isEditingSession) {
      addItem(item);
      return;
    }
    setLocalEquipment((prev) => {
      const existing = prev.find((e) => e.equipment_id === item.equipment_id);
      if (existing)
        return prev.map((e) =>
          e.equipment_id === item.equipment_id
            ? { ...e, quantity: e.quantity + item.quantity }
            : e
        );
      return [...prev, item];
    });
  }

  function addPersonalItem(p: (typeof personalList)[0]) {
    if (localPersonal.find((lp) => lp.personal_id === p.id)) return;
    const days = Number(personalDays[p.id] ?? 1);
    const rate = Number(personalRate[p.id] ?? p.daily_rate);
    setLocalPersonal((prev) => [
      ...prev,
      {
        personal_id: p.id,
        display_name: `${p.name} ${p.lastName}`,
        role: p.role,
        days,
        rate,
      },
    ]);
  }

  function onSubmit(data: eventData) {
    const eventDate =
      data.event_date.includes("/")
        ? (fromDDMMYYYY(data.event_date) ?? data.event_date)
        : data.event_date;

    const bookingData = {
      client_dni: data.dni,
      booking_status: data.booking_status,
      organization: data.organization,
      comments: data.comments ?? "",
      event_date: eventDate,
      start_time: data.start_time || null,
      end_time: data.end_time || null,
      event_type: data.event_type,
      payment_status: data.payment_status,
      place: data.place,
      tax: Number(data.tax),
      revenue: isEditingSession ? loadedRevenue : 0,
      price: Number(data.price),
    };

    if (isEditingSession) {
      updateBooking({ id: bookingId, ...bookingData });
    } else {
      addBooking({
        client: {
          dni: data.dni,
          name: data.name,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        },
        booking: bookingData,
        equipment: localEquipment,
        personnel: localPersonal.map(({ personal_id, days, rate }) => ({
          personal_id,
          days,
          rate,
        })),
      });
    }
    reset();
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEditingSession ? `Reserva #${bookingId}` : "Nueva reserva"}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {isEditingSession
              ? "Editá los datos estructurales del evento"
              : "Completá los datos para agendar el evento"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-0 w-full flex-col gap-6">
        {/* Vistas (solo edición) */}
        {isEditingSession && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Vistas de edición de la reserva"
          >
            {(
              [
                { id: "general", label: "General" },
                { id: "materials", label: "Materiales y mano de obra" },
                { id: "costs", label: "Costos" },
              ] as const
            ).map((v) => {
              const isActive = activeView === v.id;
              return (
                <Button
                  key={v.id}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  aria-pressed={isActive}
                  onClick={() => setActiveView(v.id)}
                >
                  {v.label}
                </Button>
              );
            })}
          </div>
        )}

        {/* Cliente + Evento */}
        {(!isEditingSession || activeView === "general") && (
          <div className="grid gap-6 md:grid-cols-2">
          {/* Cliente */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente
            </h2>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="DNI del cliente"
                  required
                  minLength={7}
                  maxLength={8}
                  {...register("dni")}
                  disabled={isEditingSession}
                  onBlur={(e) => handleCheckClient(e.currentTarget.value)}
                />
                {checkingClient && (
                  <Loader2 className="absolute right-2.5 top-2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <Input
                type="text"
                placeholder="Nombre"
                required
                {...register("name")}
                disabled={existClient}
              />
              <Input
                type="text"
                placeholder="Apellido"
                required
                {...register("lastName")}
                disabled={existClient}
              />
              <Input
                type="tel"
                placeholder="Teléfono"
                required
                {...register("phoneNumber")}
                disabled={existClient}
              />
              <Input
                type="email"
                placeholder="Email (opcional)"
                {...register("email")}
                disabled={existClient}
              />
              {existClient && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Cliente encontrado en el sistema
                </p>
              )}
            </div>
          </div>

          {/* Evento */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Evento
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Organización
                </label>
                <select
                  className={selectClass}
                  {...register("organization")}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Muzek">Muzek</option>
                  <option value="Show Rental">Show Rental</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Tipo de evento
                </label>
                <select
                  className={selectClass}
                  {...register("event_type")}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="corporate">Corporativo</option>
                  <option value="birthday">Cumpleaños</option>
                  <option value="fifteen_party">XV años</option>
                  <option value="marriage">Casamiento</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Fecha del evento
                </label>
                <Input
                  type="date"
                  required
                  {...register("event_date", {
                    validate: (v) => {
                      if (!v) return "La fecha es obligatoria";
                      if (!isEditingSession) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const chosen = new Date(v);
                        chosen.setHours(0, 0, 0, 0);
                        if (chosen < today)
                          return "La fecha no puede ser anterior a hoy";
                      }
                      return true;
                    },
                  })}
                  aria-invalid={!!errors.event_date}
                />
                {errors.event_date && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.event_date.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Hora inicio
                  </label>
                  <Input type="time" {...register("start_time")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Hora fin
                  </label>
                  <Input type="time" {...register("end_time")} />
                </div>
              </div>
              {watchEventDate && (!watchStartTime || !watchEndTime) && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Sin hora de inicio y fin, el equipamiento de otros eventos del
                  mismo día se considerará ocupado todo el día.
                </p>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Lugar
                </label>
                <Input
                  type="text"
                  placeholder="Dirección o salón"
                  required
                  {...register("place")}
                />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Edición: Materiales y mano de obra */}
        {isEditingSession && activeView === "materials" && (
          <>
            {/* Equipamiento asignado */}
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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

              {bookingItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Nombre
                        </th>
                        <th className="w-20 px-4 py-3 text-center font-medium text-muted-foreground">
                          Cantidad
                        </th>
                        <th className="w-28 px-4 py-3 text-right font-medium text-muted-foreground">
                          Precio unit.
                        </th>
                        <th className="w-28 px-4 py-3 text-right font-medium text-muted-foreground">
                          Total
                        </th>
                        <th className="w-12 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {bookingItems.map((item, i) => (
                        <tr
                          key={item.id ?? i}
                          className="border-b border-border last:border-0"
                        >
                          <td className="max-w-0 truncate px-4 py-3 text-foreground">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-center tabular-nums">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                            ${formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            ${formatCurrency(item.price * item.quantity)}
                          </td>
                          <td className="px-4 py-3 text-right">
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
              ) : (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No hay equipamiento asignado.
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

              {showAssignForm && (
                <div className="border-b border-border bg-muted/20 px-5 py-4">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Empleado
                      </label>
                      <select
                        className={selectClass}
                        value={selectedPersonalId}
                        onChange={handlePersonalSelect}
                      >
                        <option value="">Seleccionar...</option>
                        {(personalList as PersonaledProps[]).map((p) => (
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
                              disabled={isRemovingAssignment}
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
              ) : (
                !showAssignForm && (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No hay personal asignado.
                  </p>
                )
              )}
            </div>
          </>
        )}

        {/* Edición: Costos */}
        {isEditingSession && activeView === "costs" && (
          <>
            {/* Resumen financiero */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Costo equipo
                </p>
                <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
                  ${formatCurrency(itemsCostTotal)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Costo personal
                </p>
                <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
                  ${formatCurrency(personnelCost)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Gastos
                </p>
                <p className="mt-1 text-base font-semibold tabular-nums text-foreground">
                  ${formatCurrency(billsTotal)}
                </p>
              </div>
              <div
                className={cn(
                  "rounded-xl border p-4 shadow-sm",
                  editMargen >= 0
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
                    editMargen >= 0
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  )}
                >
                  ${formatCurrency(Math.abs(editMargen))}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    editMargen >= 0
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-red-600 dark:text-red-500"
                  )}
                >
                  {editMargen >= 0 ? "+" : "-"}
                  {Math.abs(editMargenPct).toFixed(1)}%
                </p>
              </div>
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
                        className={selectClass}
                        value={payMethod}
                        onChange={(e) =>
                          setPayMethod(e.target.value as typeof payMethod)
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
                        <tr key={p.id} className="border-b border-border last:border-0">
                          <td className="px-5 py-3 text-foreground">{p.payment_date}</td>
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !showPaymentForm && (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No hay pagos registrados.
                  </p>
                )
              )}

              <div className="flex justify-end border-t border-border bg-muted/20 px-5 py-4">
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between gap-10">
                    <span className="text-muted-foreground">Total al cliente</span>
                    <span className="tabular-nums">${formatCurrency(totalCliente)}</span>
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
            </div>

            {/* Gastos */}
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
                        className={selectClass}
                        value={gastoPaidWith}
                        onChange={(e) =>
                          setGastoPaidWith(e.target.value as typeof gastoPaidWith)
                        }
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
                </div>
              ) : (
                !showGastoForm && (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No hay gastos registrados.
                  </p>
                )
              )}
            </div>
          </>
        )}

        {/* Equipamiento (solo creación) */}
        {!isEditingSession && (
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Equipamiento
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEquipDialog(true)}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Agregar equipo
              </Button>
            </div>

            {localEquipment.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin equipos asignados — podés agregar luego desde el evento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Artículo</th>
                      <th className="w-16 pb-2 font-medium text-right">Cant.</th>
                      <th className="w-24 pb-2 font-medium text-right">Precio u.</th>
                      <th className="w-24 pb-2 font-medium text-right">Subtotal</th>
                      <th className="w-10 pb-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {localEquipment.map((item) => (
                      <tr key={item.equipment_id}>
                        <td className="max-w-0 truncate py-2">{item.name}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right tabular-nums">
                          ${formatCurrency(item.price)}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          ${formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="py-2 pl-2">
                          <button
                            type="button"
                            onClick={() =>
                              setLocalEquipment((prev) =>
                                prev.filter(
                                  (e) => e.equipment_id !== item.equipment_id
                                )
                              )
                            }
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Personal (solo creación) */}
        {!isEditingSession && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Personal
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPersonalDialog(true)}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Asignar personal
              </Button>
            </div>

            {localPersonal.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin personal asignado — podés agregar luego desde el evento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Personal</th>
                      <th className="pb-2 font-medium">Rol</th>
                      <th className="pb-2 font-medium text-right">Días</th>
                      <th className="pb-2 font-medium text-right">Tarifa/día</th>
                      <th className="pb-2 font-medium text-right">Subtotal</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {localPersonal.map((p) => (
                      <tr key={p.personal_id}>
                        <td className="py-2">{p.display_name}</td>
                        <td className="py-2 capitalize text-muted-foreground">
                          {p.role}
                        </td>
                        <td className="py-2 text-right">{p.days}</td>
                        <td className="py-2 text-right tabular-nums">
                          ${formatCurrency(p.rate)}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          ${formatCurrency(p.days * p.rate)}
                        </td>
                        <td className="py-2 pl-2">
                          <button
                            type="button"
                            onClick={() =>
                              setLocalPersonal((prev) =>
                                prev.filter(
                                  (lp) => lp.personal_id !== p.personal_id
                                )
                              )
                            }
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Estado y precio */}
        {(!isEditingSession || activeView === "general") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Estado y precio
          </h2>

          {/* Resumen de costos (solo creación con datos) */}
          {!isEditingSession && (costoTotal > 0 || localEquipment.length > 0 || localPersonal.length > 0) && (
            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Costo equipo</p>
                <p className="mt-1 font-semibold tabular-nums">
                  ${formatCurrency(costoEquipo)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Costo personal</p>
                <p className="mt-1 font-semibold tabular-nums">
                  ${formatCurrency(costoPersonal)}
                </p>
              </div>
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Precio sugerido</p>
                <p className="mt-1 font-semibold tabular-nums text-muted-foreground">
                  ${formatCurrency(costoTotal)}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Estado del evento
              </label>
              <select className={selectClass} {...register("booking_status")}>
                <option value="pending">Pendiente</option>
                <option value="confirm">Confirmado</option>
                {isEditingSession && (
                  <option value="cancel">Cancelado</option>
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Precio base ($)
              </label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                {...register("price")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Sin IVA — ajustable desde el evento
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                IVA %
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                {...register("tax")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Sobre el precio base
              </p>
            </div>
          </div>

          {/* Resumen de precio */}
          {(Number(watchPrice) > 0 || Number(watchTax) > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
              <div>
                <span className="text-muted-foreground">Precio base </span>
                <span className="font-medium tabular-nums">
                  ${formatCurrency(Number(watchPrice))}
                </span>
              </div>
              {Number(watchTax) > 0 && (
                <div>
                  <span className="text-muted-foreground">
                    IVA ({watchTax}%){" "}
                  </span>
                  <span className="font-medium tabular-nums">
                    ${formatCurrency(ivaAmount)}
                  </span>
                </div>
              )}
              {!isEditingSession && costoTotal > 0 && Number(watchPrice) > 0 && (
                <div>
                  <span className="text-muted-foreground">Margen </span>
                  <span
                    className={`font-medium tabular-nums ${margen >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    ${formatCurrency(margen)}
                  </span>
                </div>
              )}
              <div className="ml-auto">
                <span className="text-muted-foreground">Total al cliente </span>
                <span className="text-base font-bold tabular-nums text-foreground">
                  ${formatCurrency(totalCliente)}
                </span>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Comentarios */}
        {(!isEditingSession || activeView === "general") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Comentarios
          </h2>
          <textarea
            placeholder="Notas internas del evento..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring resize-none"
            maxLength={400}
            {...register("comments")}
          />
        </div>
        )}

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              isEditingSession
                ? navigate(`/evento/${bookingId}`)
                : navigate("/reservas")
            }
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isAdding || isUpdating}>
            {isAdding || isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditingSession ? "Guardando..." : "Creando..."}
              </>
            ) : isEditingSession ? (
              "Guardar cambios"
            ) : (
              "Crear reserva"
            )}
          </Button>
        </div>
      </form>

      <EquipmentPickerDialog
        open={showEquipDialog}
        onOpenChange={setShowEquipDialog}
        availability={availability}
        isLoading={isLoadingStock}
        hasIncompleteTimes={hasIncompleteTimes}
        hasTimeContext={hasTimeContext}
        eventDate={watchEventDate}
        startTime={watchStartTime}
        endTime={watchEndTime}
        onAdd={handleAddEquipment}
        isAdding={isAddingItem}
      />

      {/* Dialog: Asignar personal */}
      <Dialog open={showPersonalDialog} onOpenChange={setShowPersonalDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Asignar personal</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto rounded-md border border-border">
            {personalList.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No hay personal registrado.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Personal</th>
                    <th className="px-3 py-2 font-medium">Rol</th>
                    <th className="px-3 py-2 font-medium text-right">Días</th>
                    <th className="px-3 py-2 font-medium text-right">Tarifa/día</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {personalList.map((p) => {
                    const alreadyAdded = localPersonal.some(
                      (lp) => lp.personal_id === p.id
                    );
                    return (
                      <tr
                        key={p.id}
                        className={alreadyAdded ? "opacity-40" : "hover:bg-muted/30"}
                      >
                        <td className="px-3 py-2">
                          {p.name} {p.lastName}
                        </td>
                        <td className="px-3 py-2 capitalize text-muted-foreground">
                          {p.role}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            min={1}
                            placeholder="1"
                            className="h-7 w-14 text-right"
                            disabled={alreadyAdded}
                            value={personalDays[p.id] ?? ""}
                            onChange={(e) =>
                              setPersonalDays((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            min={0}
                            placeholder={String(p.daily_rate)}
                            className="h-7 w-24 text-right"
                            disabled={alreadyAdded}
                            value={personalRate[p.id] ?? ""}
                            onChange={(e) =>
                              setPersonalRate((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            disabled={alreadyAdded}
                            onClick={() => addPersonalItem(p)}
                          >
                            {alreadyAdded ? "Agregado" : "Asignar"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cerrar
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
