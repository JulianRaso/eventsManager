import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import NavigationButtons from "../components/NavigationButtons";
import Spinner from "../components/Spinner";
import { Input } from "../components/ui/Input";
import { useAddBooking } from "../hooks/useAddBooking";
import useUpdateBooking from "../hooks/useUpdateBooking";
import { getCurrentBooking } from "../services/booking";
import { checkClient } from "../services/client";

export default function Booking() {
  const { register, reset, handleSubmit, setValue } = useForm();
  const { isAdding, addBooking } = useAddBooking();
  const { isUpdating, updateBooking } = useUpdateBooking();
  const [dni, setDni] = useState("");
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
          if (res?.length != 0) {
            const {
              client_dni,
              event_date,
              event_type,
              place,
              booking_status,
              payment_status,
              comments,
            } = res[0];

            setValue("client_dni", client_dni);
            setValue("event_date", event_date);
            setValue("place", place);
            setValue("booking_status", booking_status);
            setValue("payment_status", payment_status);
            setValue("comments", comments);
            setValue("event_type", event_type);

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
        })
        .catch(() => {
          toast.error("Error al cargar la reserva");
        });
    }
    if (dni === "") return;
    checkClient(dni)
      .then((res) => {
        if (res.dni != "") {
          setValue("name", res.name);
          setValue("lastName", res.lastName);
          setValue("phoneNumber", res.phoneNumber);
          setValue("email", res.email);
          setExistClient(true);
        } else {
          setClient({
            dni: "",
            name: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          });
          setExistClient(false);
        }
      })
      .catch(() => {
        toast.error("Error al verificar el cliente");
      });
  }, [dni, setValue, isEditingSession, bookingId, client.dni]);

  if (isLoadingBooking) return <Spinner />;

  function handleCheckClient(dni: string) {
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
      comments: data.comments,
      event_date: data.event_date,
      event_type: data.event_type,
      payment_status: data.payment_status,
      place: data.place,
    };

    if (isEditingSession)
      updateBooking({
        id: Number(bookingId),
        client_dni: data.dni,
        booking_status: data.booking_status,
        comments: data.comments,
        event_date: data.event_date,
        event_type: data.event_type,
        payment_status: data.payment_status,
        place: data.place,
      });
    if (!isEditingSession)
      addBooking({ client: clientData, booking: bookingData });
    reset();
  }

  return (
    <AddLayout>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Datos cliente */}
          <div className="flex flex-col gap-6">
            <div className="text-lg font-semibold flex items-center gap-1">
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

            {/* Información del evento */}
            <div className="flex flex-col gap-6">
              <div className="text-lg font-semibold flex items-center gap-1">
                Evento <p className="text-red-500">*</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  Tipo de Evento
                  <select
                    className="border rounded-md h-9"
                    {...register("event_type")}
                    defaultValue={"corporate"}
                    required
                  >
                    <option value="corporate">Corporativo</option>
                    <option value="birthday">Cumpleaños</option>
                    <option value="fifteen_party">XV años</option>
                    <option value="marriage">Casamiento</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
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

          {/* Presupuesto */}
          <div className="flex flex-col gap-6 col-span-2">
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
              className="w-full border-2 rounded-lg p-3"
              maxLength={400}
              {...register("comments")}
            ></textarea>

            {/* Estado del evento y pago */}
            <div className="flex gap-6 border-t-2 pt-6">
              <div className="flex flex-col w-1/2">
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

              <div className="flex flex-col w-1/2">
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

            <div className="border-2 rounded-xl p-4 bg-gray-100 flex justify-center items-center text-xl font-semibold mt-4">
              Precio ${0}
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
