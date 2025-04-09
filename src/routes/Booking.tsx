import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import { useAddBooking } from "../hooks/useAddBooking";
import useCheckClient from "../hooks/useCheckClient";
import { checkClient } from "../services/client";

export default function Booking() {
  const [dni, setDni] = useState("");
  const { register, reset, handleSubmit, setValue, getValues } = useForm();
  const navigate = useNavigate();
  const { isAdding, addBooking } = useAddBooking();
  const [client, setClient] = useState({
    dni: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [existClient, setExistClient] = useState(false);

  useEffect(() => {
    checkClient(dni)
      .then((res) => {
        if (res.dni === Number(dni)) {
          setClient(res);
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
      .catch((error) => {
        console.error("Error checking client:", error);
        toast.error("Error al verificar el cliente");
      });
  }, [dni]);

  function handleCheckClient(dni: string) {
    if (Number(dni) > 999999 && Number(dni) < 99999999) {
      return setDni(dni);
    } else {
      toast.error("El DNI debe tener entre 7 y 8 dígitos");
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

    console.log(data);

    const bookingData = {
      client_id: data.dni,
      booking_status: data.booking_status,
      comments: data.comments,
      event_date: data.event_date,
      event_type: data.event_type,
      payment_status: data.payment_status,
      location: data.location,
    };

    // addBooking(clientData, bookingData);
    // reset();
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border-2 w-11/12 md:w-8/12 lg:w-6/12 p-8 rounded-2xl bg-white shadow-lg">
        <form
          className="flex flex-col gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                      defaultValue={"birthday"}
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
                    type="location"
                    placeholder="Ubicación del Evento"
                    required
                    {...register("location")}
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
          <div className="flex justify-between items-center mt-6">
            <Button onClick={() => navigate("/reservas")}>Cancelar</Button>
            <Button disabled={isAdding}>Agendar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
