import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import NavigationButtons from "../components/NavigationButtons";
import Spinner from "../components/Spinner";
import { Input } from "../components/ui/Input";
import { useAddBooking } from "../hooks/useAddBooking";
import useUpdateBooking from "../hooks/useUpdateBooking";
import { getCurrentBooking } from "../services/booking";
import { checkClient } from "../services/client";

export default function Booking() {
  const navigate = useNavigate();
  const { register, reset, handleSubmit, setValue, resetField } = useForm();
  const { isAdding, addBooking } = useAddBooking();
  const { isUpdating, updateBooking } = useUpdateBooking();
  const [dni, setDni] = useState();
  const [existClient, setExistClient] = useState(false);
  const [client, setClient] = useState({
    dni: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  //Editing Session
  const bookingId = useParams().bookingId;
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
              if (res.dni != "") {
                const { dni, name, lastName, phoneNumber, email } = res;
                setValue("dni", dni);
                setValue("name", name);
                setValue("lastName", lastName);
                setValue("phoneNumber", phoneNumber);
                setValue("email", email);
                setExistClient(true);
                setIsLoadingBooking(false);
              }
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
    if (dni === "") return;
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
  });

  if (isLoadingBooking) return <Spinner />;

  function handleCheckClient(dni: number) {
    if (Number(dni) > 999999 && Number(dni) < 99999999) {
      return setDni(dni);
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
      });
    if (!isEditingSession)
      addBooking({ client: clientData, booking: bookingData });
    reset();
  }

  return (
    <AddLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Datos cliente */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold flex items-center">
                Datos cliente <p className="text-red-500">*</p>
              </p>

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
                  defaultValue={client.name}
                  {...register("name")}
                  disabled={existClient}
                />
                <Input
                  type="lastName"
                  placeholder="Apellido del Cliente"
                  required
                  defaultValue={client.lastName}
                  {...register("lastName")}
                  disabled={existClient}
                />
                <Input
                  type="phone"
                  placeholder="Teléfono del Cliente"
                  required
                  defaultValue={client.phoneNumber}
                  {...register("phoneNumber")}
                  disabled={existClient}
                />
                <Input
                  type="email"
                  placeholder="Email del Cliente"
                  defaultValue={client.email}
                  {...register("email")}
                  disabled={existClient}
                />
              </div>
            </div>

            {/* Información del evento */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold flex items-center">
                  Evento <p className="text-red-500">*</p>
                </p>

                <div className="flex flex-col gap-6">
                  <select
                    className="border rounded-md h-9"
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
                    className="border rounded-md h-9"
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
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Presupuesto & Pagos */}
          <div className="flex flex-col gap-6 col-span-2 ">
            {/* Equipo */}
            <div className="text-lg font-semibold">Equipo</div>
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="font-medium">Sonido</div>
                <div className="border rounded-2xl p-2">Potencia 2x400w</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">Iluminación</div>
                <div className="border rounded-2xl p-2">Tacho RGB</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">Ambientación</div>
                <div className="border rounded-2xl p-2">Entelado 4mts</div>
              </div>
            </div>

            {/* Comentarios adicionales */}
            <div className="text-lg font-semibold">Información Adicional</div>
            <textarea
              placeholder="Información adicional del evento..."
              className="w-full border-2 rounded-lg p-3 resize-none"
              maxLength={400}
              {...register("comments")}
            ></textarea>

            {/* Estado del evento, pagos e impuestos */}
            <div className="flex flex-col gap-6 border-t-2 pt-4">
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

              <div className="border-2 rounded-xl p-4 bg-gray-100 flex justify-around items-center md:text-xl font-semibold mt-4 flex-wrap gap-8">
                <p>Precio sin IVA ${0}</p>
                <p>Precio final ${0}</p>
              </div>
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
