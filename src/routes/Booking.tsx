import EquipmentItem from "@/components/Booking/EquipmentItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { FileText, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import MiniSpinner from "../components/MiniSpinner";
import NavigationButtons from "../components/NavigationButtons";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeaderData,
  TableRow,
} from "../components/Table";
import { Button } from "../components/ui/button";
import { DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";
import { useAddBooking } from "../hooks/useAddBooking";
import useAddItems from "../hooks/useAddItems";
import useDeleteItems from "../hooks/useDeleteItems";
import useGetData from "../hooks/useGetData";
import useUpdateBooking from "../hooks/useUpdateBooking";
import { getCurrentBooking } from "../services/booking";
import { getItems } from "../services/bookingItems";
import { checkClient } from "../services/client";
import { fromDDMMYYYY, toDDMMYYYY } from "../components/formatDate";

function formatCurrency(currency: number) {
  const number = typeof currency === "string" ? parseFloat(currency) : currency;

  if (isNaN(number)) {
    return 0;
  }

  return number.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const filterByCategory = [
  {
    value: "sound",
    label: "Sonido",
  },
  {
    value: "lights",
    label: "Iluminacion",
  },
  { value: "ambientation", label: "Ambientacion" },
  {
    value: "structure",
    label: "Estructuras",
  },
  {
    value: "cables",
    label: "Cables",
  },
  {
    value: "screen",
    label: "Pantalla",
  },
  {
    value: "furniture",
    label: "Muebles",
  },
  {
    value: "tools",
    label: "Herramientas",
  },
  {
    value: "others",
    label: "Otros",
  },
];

type eventData = {
  dni: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  organization: "Muzek" | "Show Rental";
  event_type: "birthday" | "marriage" | "corporate" | "fifteen_party" | "other";
  place: string;
  event_date: string;
  booking_status: "pending" | "cancel" | "confirm";
  payment_status: "pending" | "partially_paid" | "paid";
  comments: string;
  tax: number;
  revenue: number;
};

type CategoryType =
  | "lights"
  | "ambientation"
  | "sound"
  | "structure"
  | "tools"
  | "cables"
  | "others"
  | "furniture"
  | "screen";

type EquipmentItem = {
  id?: number;
  booking_id: number;
  equipment_id: number;
  name: string;
  quantity: number;
  price: number;
};

export default function Booking() {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    resetField,
    getValues,
    watch,
    formState: { errors },
  } = useForm<eventData>();
  const defaultCategory = "sound";
  const [filterByName, setFilterByName] = useState("");
  const { isAdding, addBooking } = useAddBooking();
  const { isUpdating, updateBooking } = useUpdateBooking();
  const { addEquipment } = useAddItems();
  const [category, setCategory] = useState(defaultCategory);
  const { data, isLoading } = useGetData(category as CategoryType);
  const { isDeleting, deleteItem } = useDeleteItems();
  const [dni, setDni] = useState(0);
  const [existClient, setExistClient] = useState(false);

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [toDelete, setToDelete] = useState<number[]>([]);
  const [price, setPrice] = useState(0);
  const [billingTable, setBillingTable] = useState(true);

  if (category === "") {
    setCategory(defaultCategory);
  }

  const selectClass =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  //Editing Session
  const bookingId = Number(useParams().bookingId);
  const isEditingSession = Boolean(bookingId);
  const [isLoadingBooking, setIsLoadingBooking] = useState(
    bookingId ? true : false
  );

  useEffect(() => {
    if (isEditingSession) {
      getCurrentBooking(Number(bookingId))
        .then((res = []) => {
          if (res && res.length !== 0) {
            const {
              client_dni,
              event_date,
              event_type,
              organization,
              place,
              booking_status,
              payment_status,
              comments,
              tax,
              revenue,
            } = res[0];

            setValue("dni", client_dni);
            setValue("event_date", toDDMMYYYY(event_date));
            setValue("place", place);
            setValue("organization", organization);
            setValue("booking_status", booking_status);
            setValue("payment_status", payment_status);
            if (comments) setValue("comments", comments);
            setValue("event_type", event_type);
            setValue("tax", tax);
            setValue("revenue", revenue);

            checkClient(client_dni).then((res) => {
              if (res.data) {
                const { dni, name, lastName, phoneNumber, email } = res.data;
                setValue("dni", dni);
                setValue("name", name);
                setValue("lastName", lastName);
                setValue("phoneNumber", phoneNumber);
                if (email) setValue("email", email);
                setExistClient(true);
                setIsLoadingBooking(false);
              }
            });
            getItems(Number(bookingId))
              .then((res) => {
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
                        acc +
                        (item.price != null ? item.price : 0) * item.quantity
                      );
                    }, 0)
                  );
                }
              })
              .catch(() => {
                toast.error("Error al cargar el equipo");
              });
          }
          if (res?.length === 0) {
            toast.error("No se ha encontrado la reserva que busca");
            navigate("/reservas");
          }
        })
        .catch(() => {
          toast.error("Error al cargar la reserva");
        });
    }
    if (dni !== 0) {
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
        .catch(() => {
          toast.error("Error al verificar el cliente");
        });
    }
  }, [isEditingSession, dni, setValue, navigate, bookingId, resetField]);

  if (isLoadingBooking) return <Spinner />;

  function handleCheckClient(dni: string) {
    if (Number(dni) > 999999 && Number(dni) < 99999999) {
      return setDni(Number(dni));
    }
    if (dni === "") {
      reset();
    }
  }

  function onSubmit(data: eventData) {
    const eventDateIso = fromDDMMYYYY(data.event_date) ?? data.event_date;
    const clientData = {
      dni: data.dni,
      name: data.name,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
    };

    const bookingData = {
      client_dni: data.dni,
      booking_status: data.booking_status,
      organization: data.organization,
      comments: data.comments,
      event_date: eventDateIso,
      event_type: data.event_type,
      payment_status: data.payment_status,
      place: data.place,
      tax: data.tax,
      revenue: data.revenue,
      price: Number(
        (
          ((price + (price / 100) * getValues("revenue")) / 100) *
          (100 + getValues("tax"))
        ).toFixed(2)
      ),
    };

    if (isEditingSession) {
      // Actualizar reserva existente
      updateBooking({
        id: Number(bookingId),
        client_dni: data.dni,
        booking_status: data.booking_status,
        organization: data.organization,
        comments: data.comments,
        event_date: eventDateIso,
        event_type: data.event_type,
        payment_status: data.payment_status,
        place: data.place,
        tax: data.tax,
        revenue: data.revenue,
        price: Number(
          (
            ((price + (price / 100) * getValues("revenue")) / 100) *
            (100 + getValues("tax"))
          ).toFixed(2)
        ),
      });

      // Solo agregar equipos en modo edición (ya tienen booking_id válido)
      if (equipment.length > 0) addEquipment(equipment);

      if (toDelete.length > 0) {
        deleteItem(toDelete);
        setToDelete([]);
      }
    } else {
      // Nueva reserva: pasar equipos al servicio para que los guarde con el ID correcto
      const equipmentWithoutBookingId = equipment.map(
        ({ booking_id, ...rest }) => rest
      );
      addBooking({
        client: clientData,
        booking: bookingData,
        equipment: equipmentWithoutBookingId,
      });
    }
    reset();
  }

  return (
    <div className="flex min-h-full w-full flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
      <div className="rounded-xl border border-border bg-card px-6 py-6 shadow-lg sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">
            {isEditingSession ? `Reserva #${bookingId}` : "Agendar reserva"}
          </h1>
          {isEditingSession && (
            <Button
              variant="outline"
              onClick={() => navigate("/recibo/" + bookingId)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver recibo
            </Button>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 lg:gap-8"
        >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Datos cliente */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">
              Datos del cliente <span className="text-destructive">*</span>
            </h2>
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
            <Input
              type="text"
              placeholder="Nombre"
              required
              defaultValue=""
              {...register("name")}
              disabled={existClient}
            />
            <Input
              type="text"
              placeholder="Apellido"
              required
              defaultValue=""
              {...register("lastName")}
              disabled={existClient}
            />
            <Input
              type="tel"
              placeholder="Teléfono"
              required
              defaultValue=""
              {...register("phoneNumber")}
              disabled={existClient}
            />
            <Input
              type="email"
              placeholder="Email"
              defaultValue=""
              {...register("email")}
              disabled={existClient}
            />
          </div>

          {/* Evento */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">
              Evento <span className="text-destructive">*</span>
            </h2>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">
                Organización
              </label>
              <select
                className={selectClass}
                {...register("organization")}
                required
              >
                <option value="">Seleccione organización</option>
                <option value="Muzek">Muzek</option>
                <option value="Show Rental">Show Rental</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">
                Tipo de evento
              </label>
              <select
                className={selectClass}
                {...register("event_type")}
                required
              >
                <option value="">Seleccione tipo</option>
                <option value="corporate">Corporativo</option>
                <option value="birthday">Cumpleaños</option>
                <option value="fifteen_party">XV años</option>
                <option value="marriage">Casamiento</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <Input
              type="text"
              placeholder="Ubicación"
              required
              {...register("place")}
            />
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">
                Fecha del evento
              </label>
              <Input
                type="text"
                placeholder="DD/MM/AAAA"
                {...register("event_date", {
                  validate: (v) => {
                    if (!v?.trim()) return "La fecha es obligatoria";
                    const iso = fromDDMMYYYY(v);
                    if (!iso) return "Use formato DD/MM/AAAA";
                    if (!isEditingSession) {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const chosen = new Date(iso);
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
          </div>

          {/* Estado y pagos */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">
              Estado y pagos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">
                  Estado evento
                </label>
                <select
                  className={selectClass}
                  {...register("booking_status")}
                >
                  <option value="confirm">Confirmado</option>
                  <option value="pending">Pendiente</option>
                  {isEditingSession && (
                    <option value="cancel">Cancelado</option>
                  )}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">
                  Estado pago
                </label>
                <select
                  className={selectClass}
                  {...register("payment_status")}
                >
                  <option value="paid">Abonado</option>
                  <option value="partially_paid">Seña</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">
                  IVA %
                </label>
                <Input
                  type="number"
                  {...register("tax")}
                  min={0}
                  defaultValue={0}
                  placeholder="0"
                  value={watch("tax") < 0 ? 0 : watch("tax")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted-foreground">
                  Ganancia %
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("revenue")}
                  value={watch("revenue") < 0 ? 0 : watch("revenue")}
                  min={0}
                  defaultValue={0}
                />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
              <p className="text-sm text-muted-foreground">
                Sin IVA $
                {formatCurrency(
                  price === 0
                    ? 0
                    : Number(
                        price + (price / 100) * Number(watch("revenue") ?? 0)
                      )
                )}
              </p>
              <p className="text-base font-semibold tabular-nums">
                Total $
                {formatCurrency(
                  price === 0
                    ? 0
                    : ((price + (price / 100) * Number(watch("revenue"))) /
                        100) *
                        watch("tax") +
                        (price + (price / 100) * Number(watch("revenue")))
                )}
              </p>
            </div>
          </div>

          {/* Equipo y presupuesto */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                Equipo y presupuesto
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-input p-0.5">
                  <button
                    type="button"
                    onClick={() => setBillingTable(true)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      billingTable
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Equipo
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingTable(false)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      !billingTable
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Gasto
                  </button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" size="sm">
                      <Plus className="mr-1.5 h-4 w-4" />
                      Agregar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Agregar equipo</DialogTitle>
                      <DialogDescription>
                        Seleccione el equipo y la cantidad deseada para el
                        presupuesto del evento.
                      </DialogDescription>
                    </DialogHeader>
                    <Filter
                      filterByName={filterByName}
                      filterByStatus={filterByCategory}
                      setFilterByName={setFilterByName}
                      value={category}
                      setValue={setCategory}
                    />
                    <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <MiniSpinner />
                        </div>
                      ) : (
                        <Table>
                          <TableHead>
                            <TableHeaderData>Equipo</TableHeaderData>
                            <TableHeaderData>Disponible</TableHeaderData>
                            <TableHeaderData>Costo</TableHeaderData>
                            <TableHeaderData>Solicitado</TableHeaderData>
                            <TableHeaderData>Agregar</TableHeaderData>
                          </TableHead>
                          <TableBody>
                            {data
                              ?.filter((item) => {
                                return filterByName.toLowerCase() === ""
                                  ? item
                                  : item.name
                                      ?.toLowerCase()
                                      .includes(filterByName.toLowerCase());
                              })
                              .map((stock, index) => (
                                <EquipmentItem
                                  key={index}
                                  stock={stock}
                                  bookingId={bookingId}
                                  equipment={equipment}
                                  setEquipment={setEquipment}
                                  setPrice={setPrice}
                                />
                              ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cerrar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border">
              <Table>
                <TableHead>
                  <TableHeaderData>Nombre</TableHeaderData>
                  <TableHeaderData>Cantidad</TableHeaderData>
                  <TableHeaderData>Precio</TableHeaderData>
                  <TableHeaderData className="w-24"> </TableHeaderData>
                </TableHead>
                <TableBody>
                  {equipment.map(
                    (
                      data: {
                        name: string;
                        quantity: number;
                        price: number;
                        id?: number;
                      },
                      index
                    ) => (
                      <TableRow key={index}>
                        <TableData className="text-xs">{data?.name}</TableData>
                        <TableData>{data?.quantity}</TableData>
                        <TableData>{data?.price}</TableData>
                        <TableData>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={isDeleting}
                            onClick={(e) => (
                              e.preventDefault(),
                              setEquipment((element) =>
                                element.filter(
                                  (item: { name: string; price: number }) =>
                                    item.name != data?.name ||
                                    item.price !== data?.price
                                )
                              ),
                              setToDelete((prev) => [
                                ...prev,
                                data?.id as number,
                              ]),
                              setPrice(
                                (curr) => curr - data?.price * data?.quantity
                              )
                            )}
                          >
                            Quitar
                          </Button>
                        </TableData>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">
                Información adicional
              </label>
              <textarea
                placeholder="Comentarios del evento..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                maxLength={400}
                {...register("comments")}
              />
            </div>
          </div>
        </div>

        <NavigationButtons
          isAdding={isAdding || isUpdating}
          navigateTo="/reservas"
          addTitle={isEditingSession ? "Actualizar" : "Agregar"}
        />
      </form>
      </div>
    </div>
  );
}
