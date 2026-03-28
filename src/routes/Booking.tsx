import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FileText, Loader2, Plus, Trash2 } from "lucide-react";
import Spinner from "../components/Spinner";
import Filter from "../components/Filter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAddBooking } from "../hooks/useAddBooking";
import useUpdateBooking from "../hooks/useUpdateBooking";
import useGetStockAvailability from "../hooks/useGetStockAvailability";
import useGetPersonal from "../hooks/useGetPersonal";
import { getCurrentBooking } from "../services/booking";
import { checkClient } from "../services/client";
import { fromDDMMYYYY } from "../components/formatDate";
import type { eventData } from "../types/Booking-typ";
import { formatCurrency } from "../utils/formatCurrency";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

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
      revenue: 0,
      price: 0,
    },
  });

  const { isAdding, addBooking } = useAddBooking();
  const { isUpdating, updateBooking } = useUpdateBooking();

  // Pickers (always initialized — hooks can't be conditional)
  const { availability } = useGetStockAvailability();
  const { data: personalList = [] } = useGetPersonal();

  const [dni, setDni] = useState(0);
  const [existClient, setExistClient] = useState(false);
  const [checkingClient, setCheckingClient] = useState(false);

  const bookingId = Number(useParams().bookingId);
  const isEditingSession = Boolean(bookingId);
  const [isLoadingBooking, setIsLoadingBooking] = useState(bookingId ? true : false);

  // Create-mode local state
  const [localEquipment, setLocalEquipment] = useState<LocalEquipItem[]>([]);
  const [localPersonal, setLocalPersonal] = useState<LocalPersonalItem[]>([]);
  const [showEquipDialog, setShowEquipDialog] = useState(false);
  const [showPersonalDialog, setShowPersonalDialog] = useState(false);
  const [equipCategory, setEquipCategory] = useState("all");
  const [equipFilter, setEquipFilter] = useState("");
  const [equipQty, setEquipQty] = useState<Record<number, string>>({});
  const [personalDays, setPersonalDays] = useState<Record<number, string>>({});
  const [personalRate, setPersonalRate] = useState<Record<number, string>>({});

  const watchPrice = watch("price") ?? 0;
  const watchTax = watch("tax") ?? 0;
  const watchRevenue = watch("revenue") ?? 0;

  // Financial calculations
  const costoEquipo = localEquipment.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 + Number(watchRevenue) / 100),
    0
  );
  const costoPersonal = localPersonal.reduce((sum, p) => sum + p.days * p.rate, 0);
  const costoTotal = costoEquipo + costoPersonal;
  const ivaAmount = (Number(watchPrice) / 100) * Number(watchTax);
  const totalCliente = Number(watchPrice) + ivaAmount;
  const margen = Number(watchPrice) - costoTotal;

  // Filtered stock for equipment dialog
  const filteredStock = availability.filter((item) => {
    const matchCat = equipCategory === "all" || item.category === equipCategory;
    const matchText = item.name.toLowerCase().includes(equipFilter.toLowerCase());
    return matchCat && matchText;
  });

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
        setValue("place", b.place);
        setValue("organization", b.organization);
        setValue("booking_status", b.booking_status);
        setValue("payment_status", b.payment_status);
        setValue("event_type", b.event_type);
        setValue("tax", b.tax ?? 0);
        setValue("revenue", b.revenue ?? 0);
        setValue("price", b.price ?? 0);
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

  function addEquipItem(item: (typeof availability)[0]) {
    const qty = Number(equipQty[item.id] ?? 1);
    if (qty <= 0) return;
    setLocalEquipment((prev) => {
      const existing = prev.find((e) => e.equipment_id === item.id);
      if (existing)
        return prev.map((e) =>
          e.equipment_id === item.id ? { ...e, quantity: e.quantity + qty } : e
        );
      return [
        ...prev,
        { equipment_id: item.id, name: item.name, price: item.price, quantity: qty },
      ];
    });
    setEquipQty((prev) => ({ ...prev, [item.id]: "" }));
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
      event_type: data.event_type,
      payment_status: data.payment_status,
      place: data.place,
      tax: Number(data.tax),
      revenue: Number(data.revenue),
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
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 md:p-6">
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
        {isEditingSession && (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/recibo/${bookingId}`)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver recibo
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Cliente + Evento */}
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

        {/* Equipamiento (solo creación) */}
        {!isEditingSession && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
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
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Artículo</th>
                      <th className="pb-2 font-medium text-right">Cant.</th>
                      <th className="pb-2 font-medium text-right">Precio u.</th>
                      <th className="pb-2 font-medium text-right">Subtotal</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {localEquipment.map((item) => (
                      <tr key={item.equipment_id}>
                        <td className="py-2">{item.name}</td>
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
                Margen de ganancia %
              </label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                {...register("revenue")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Aplicado al costo de equipamiento
              </p>
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

        {/* Comentarios */}
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

      {/* Dialog: Agregar equipamiento */}
      <Dialog open={showEquipDialog} onOpenChange={setShowEquipDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar equipamiento</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Filter
              filterByStatus={filterByCategory}
              value={equipCategory === "all" ? "" : equipCategory}
              setValue={(v) => setEquipCategory(v || "all")}
              filterByName={equipFilter}
              setFilterByName={setEquipFilter}
            />
            <div className="max-h-80 overflow-y-auto rounded-md border border-border">
              {filteredStock.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Sin resultados.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Artículo</th>
                      <th className="px-3 py-2 font-medium text-right">Disponible</th>
                      <th className="px-3 py-2 font-medium text-right">Precio</th>
                      <th className="px-3 py-2 font-medium text-right">Cantidad</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStock.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">
                          {item.available}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          ${formatCurrency(item.price)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            min={1}
                            max={item.available}
                            placeholder="1"
                            className="h-7 w-16 text-right"
                            value={equipQty[item.id] ?? ""}
                            onChange={(e) =>
                              setEquipQty((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
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
                            disabled={item.available === 0}
                            onClick={() => addEquipItem(item)}
                          >
                            Agregar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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
