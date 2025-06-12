import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import Filter from "../components/Filter";
import MiniSpinner from "../components/MiniSpinner";
import NavigationButtons from "../components/NavigationButtons";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../components/Table";
import { Button } from "../components/ui/button";
import { DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/Input";
import { useAddBooking } from "../hooks/useAddBooking";
import useAddItems from "../hooks/useAddItems";
import useDeleteItems from "../hooks/useDeleteItems";
import useGetData from "../hooks/useGetData";
import useGetItems from "../hooks/useGetItems";
import useUpdateBooking from "../hooks/useUpdateBooking";
import { getCurrentBooking } from "../services/booking";
import { getItems } from "../services/bookingItems";
import { checkClient } from "../services/client";

function formatCurrency(currency: string) {
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

export default function Booking() {
  const navigate = useNavigate();
  const { register, reset, handleSubmit, setValue, resetField, getValues } =
    useForm();
  const defaultCategory = "sound";
  const [filterByName, setFilterByName] = useState("");
  const { isAdding, addBooking } = useAddBooking();
  const { isUpdating, updateBooking } = useUpdateBooking();
  const { isPending, addEquipment } = useAddItems();
  const [category, setCategory] = useState(defaultCategory);
  const { data, isLoading } = useGetData(category);
  const { isDeleting, deleteItem } = useDeleteItems();
  const [dni, setDni] = useState(0);
  const [existClient, setExistClient] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  if (category === "") {
    setCategory(defaultCategory);
  }

  //Editing Session
  const bookingId = useParams().bookingId;
  const isEditingSession = Boolean(bookingId);
  const { getBookedEquipment } = useGetItems(Number(bookingId));
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

            setValue("client_dni", client_dni);
            setValue("event_date", event_date);
            setValue("place", place);
            setValue("organization", organization);
            setValue("booking_status", booking_status);
            setValue("payment_status", payment_status);
            setValue("comments", comments);
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
                setValue("email", email);
                setExistClient(true);
                setIsLoadingBooking(false);
              }
            });
            getItems(Number(bookingId))
              .then((res) => {
                if (res) {
                  setEquipment(res);
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
          setValue("email", email);
          setExistClient(true);
        })
        .catch(() => {
          toast.error("Error al verificar el cliente");
        });
    }
  }, [
    isEditingSession,
    dni,
    setValue,
    navigate,
    bookingId,
    resetField,
    getBookedEquipment,
  ]);

  if (isLoadingBooking) return <Spinner />;

  function handleCheckClient(dni: string) {
    if (Number(dni) > 999999 && Number(dni) < 99999999) {
      return setDni(Number(dni));
    }
    if (dni === "") {
      reset();
    }
  }

  function onSubmit(data) {
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
      event_date: data.event_date,
      event_type: data.event_type,
      payment_status: data.payment_status,
      place: data.place,
      tax: data.tax,
      revenue: data.revenue,
      price: (
        ((price + (price / 100) * getValues("revenue")) / 100) *
        (100 + getValues("tax"))
      ).toFixed(2),
    };

    if (isEditingSession)
      updateBooking({
        id: Number(bookingId),
        client_dni: data.dni,
        booking_status: data.booking_status,
        organization: data.organization,
        comments: data.comments,
        event_date: data.event_date,
        event_type: data.event_type,
        payment_status: data.payment_status,
        place: data.place,
        tax: data.tax,
        revenue: data.revenue,
        price: (
          ((price + (price / 100) * getValues("revenue")) / 100) *
          (100 + getValues("tax"))
        ).toFixed(2),
      });
    if (equipment.length > 0) addEquipment(equipment);

    if (!isEditingSession)
      addBooking({ client: clientData, booking: bookingData });
    reset();
  }

  return (
    <AddLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="grid grid-cols-1 grid-row-4 md:grid-cols-3 md:grid-rows-2 gap-1.5">
          {/* Datos cliente */}
          <div className="flex flex-col gap-2 col-span-1">
            <div className="text-lg font-semibold flex items-center">
              Datos cliente <p className="text-red-500">*</p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                type="dni"
                placeholder="Dni del Cliente"
                required
                minLength={7}
                maxLength={8}
                {...register("dni")}
                disabled={isEditingSession}
                onBlur={(e) => handleCheckClient(e.currentTarget.value)}
              />
              <Input
                type="name"
                placeholder="Nombre del Cliente"
                required
                defaultValue={""}
                {...register("name")}
                disabled={existClient}
              />
              <Input
                type="lastName"
                placeholder="Apellido del Cliente"
                required
                defaultValue={""}
                {...register("lastName")}
                disabled={existClient}
              />
              <Input
                type="phone"
                placeholder="Teléfono del Cliente"
                required
                defaultValue={""}
                {...register("phoneNumber")}
                disabled={existClient}
              />
              <Input
                type="email"
                placeholder="Email del Cliente"
                defaultValue={""}
                {...register("email")}
                disabled={existClient}
              />
            </div>
          </div>

          {/* Información del evento */}
          <div className="flex flex-col gap-2 col-span-1 row-start-2">
            <div className="text-lg font-semibold flex items-center">
              Evento <p className="text-red-500">*</p>
            </div>

            <div className="flex flex-col gap-5">
              <select
                className="border rounded-md h-9 p-1"
                {...register("organization")}
                required
              >
                <option disabled selected>
                  Seleccione una organizacion
                </option>
                <option value="Muzek">Muzek</option>
                <option value="Show Rental">Show Rental</option>
              </select>
              <select
                className="border rounded-md h-9 p-1"
                {...register("event_type")}
                required
              >
                <option disabled selected>
                  Seleccione el tipo de evento
                </option>
                <option value="corporate">Corporativo</option>
                <option value="birthday">Cumpleaños</option>
                <option value="fifteen_party">XV años</option>
                <option value="marriage">Casamiento</option>
                <option value="other">Otro</option>
              </select>
              <Input
                type="place"
                placeholder="Ubicación del Evento"
                required
                {...register("place")}
              />
              <Input
                type="date"
                required
                {...register("event_date")}
                min={
                  isEditingSession ? "" : new Date().toISOString().split("T")[0]
                }
              />
            </div>
          </div>

          {/* Presupuesto & Pagos */}
          <div className="flex flex-col items-strech h-full justify-between row-start-3 md:col-span-2 md:col-start-2 md:row-start-1">
            <div className="flex flex-col gap-1">
              {/* Equipo */}
              <div className="text-lg font-semibold flex justify-between">
                <p>Equipo</p>
                <Dialog>
                  <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
                    +
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Equipo</DialogTitle>
                      <DialogDescription>
                        Seleccione el equipo y la cantidad deseada para generar
                        el presupuesto del evento.
                      </DialogDescription>
                    </DialogHeader>
                    <Filter
                      filterByName={filterByName}
                      filterByStatus={filterByCategory}
                      setFilterByName={setFilterByName}
                      value={category}
                      setValue={setCategory}
                    />
                    <div className="overflow-y-auto h-80 text-sm">
                      {isLoading ? (
                        <MiniSpinner />
                      ) : (
                        <Table>
                          <TableHead>
                            <TableData>Equipo</TableData>
                            <TableData>Disponible</TableData>
                            <TableData>Costo</TableData>
                            <TableData>Solicitado</TableData>
                            <TableData>Agregar</TableData>
                          </TableHead>
                          <TableBody className="">
                            {data
                              ?.filter((item) => {
                                return filterByName.toLowerCase() === ""
                                  ? item
                                  : item.name
                                      ?.toLowerCase()
                                      .includes(filterByName.toLowerCase());
                              })
                              .map((stock, index) => (
                                <TableRow key={index}>
                                  <TableData>{stock.name}</TableData>
                                  <TableData>{stock.quantity}</TableData>
                                  <TableData>{stock.price}</TableData>
                                  <TableData>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={stock.quantity}
                                      disabled={equipment.find(
                                        (e) =>
                                          e.name === stock.name &&
                                          e.quantity === stock.quantity
                                      )}
                                      onChange={(e) =>
                                        setQuantity(Number(e.target.value))
                                      }
                                    />
                                  </TableData>
                                  <TableData>
                                    <Button
                                      variant="outline"
                                      onClick={(e) => (
                                        e.preventDefault(),
                                        quantity === 0
                                          ? toast.error(
                                              "Debe ingresar una cantidad"
                                            )
                                          : quantity > stock.quantity
                                          ? toast.error(
                                              "Cantidad no disponible"
                                            )
                                          : quantity < 0
                                          ? toast.error(
                                              "Cantidad no disponible"
                                            )
                                          : setEquipment([
                                              ...equipment,
                                              {
                                                booking_id: bookingId,
                                                equipment_id: stock.id,
                                                name: stock.name,
                                                quantity: quantity,
                                                price: stock.price,
                                              },
                                            ]),
                                        setPrice(
                                          (previous) =>
                                            previous +
                                            stock.quantity * (stock.price || 0)
                                        )
                                      )}
                                      disabled={
                                        equipment.find(
                                          (e) =>
                                            e.name === stock.name &&
                                            e.quantity === stock.quantity
                                        ) || true
                                      }
                                    >
                                      +
                                    </Button>
                                  </TableData>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cerrar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="w-full h-30 overflow-y-auto">
                <Table>
                  <TableHead>
                    <TableData>Nombre</TableData>
                    <TableData>Cantidad</TableData>
                    <TableData>Precio</TableData>
                    <TableData>{null}</TableData>
                  </TableHead>
                  <TableBody>
                    {equipment.map((data, index) => (
                      <TableRow key={index}>
                        <TableData className="text-xs">{data?.name}</TableData>
                        <TableData>{data?.quantity}</TableData>
                        <TableData>{data?.price}</TableData>
                        <TableData>
                          <Button
                            variant="outline"
                            disabled={isDeleting}
                            onClick={(e) => (
                              e.preventDefault(),
                              setEquipment((element) =>
                                element.filter(
                                  (item) => item.name != data?.name
                                )
                              ),
                              deleteItem(
                                getBookedEquipment?.filter(
                                  (item) => item.name === data?.name
                                )[0]?.id
                              ),
                              setPrice(
                                (curr) => curr - data?.price * data?.quantity
                              )
                            )}
                          >
                            X
                          </Button>
                        </TableData>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Comentarios adicionales */}
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Información Adicional</p>
              <textarea
                placeholder="Información adicional del evento..."
                className="w-full border-2 rounded-lg p-3 resize-none"
                maxLength={400}
                {...register("comments")}
              ></textarea>
            </div>
          </div>

          {/* Estado del evento, pagos e impuestos */}
          <div className="flex flex-col gap-6 col-span-2 md:col-start-2 md:row-start-2">
            <div className="flex justify-around items-center flex-wrap">
              <div className="flex flex-col">
                Estado Evento
                <select
                  className="mt-1 border-2 rounded-xl p-2"
                  {...register("booking_status")}
                >
                  <option value="confirm">Confirmado</option>
                  <option value="pending">Pendiente</option>
                  {isEditingSession && (
                    <option value="cancel">Cancelado</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                Estado Pago
                <select
                  className="mt-1 border-2 rounded-xl p-2"
                  {...register("payment_status")}
                >
                  <option value="paid">Abonado</option>
                  <option value="partially_paid">Seña</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-around flex-wrap">
              <div className="flex flex-col items-center">
                <p>IVA</p>
                <Input
                  type="number"
                  {...register("tax")}
                  min={0}
                  defaultValue={0}
                  placeholder="Ingrese el IVA"
                />
              </div>
              <div className="flex flex-col items-center">
                <p>Ganancia %</p>
                <Input
                  type="number"
                  placeholder="Porcentage de ganancia"
                  {...register("revenue")}
                  min={0}
                  defaultValue={0}
                />
              </div>
            </div>

            <div className="border-2 rounded-xl p-2 bg-gray-100 flex justify-around items-center text-sm md:text-lg font-semibold mt-4 flex-wrap gap-2">
              <p>
                Precio sin IVA $
                {formatCurrency(
                  price === 0
                    ? 0
                    : (price + (price / 100) * getValues("revenue")).toFixed(2)
                )}
              </p>
              <p>
                Precio final $
                {formatCurrency(
                  price === 0
                    ? 0
                    : (
                        ((price + (price / 100) * getValues("revenue")) / 100) *
                        (100 + getValues("tax"))
                      ).toFixed(2)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <NavigationButtons
          isAdding={isAdding || isUpdating}
          navigateTo="/reservas"
          addTitle={isEditingSession ? "Actualizar" : "Agregar"}
        />
      </form>
    </AddLayout>
  );
}
