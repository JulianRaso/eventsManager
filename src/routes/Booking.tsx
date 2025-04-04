import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import { createBooking } from "../services/data";

export default function Booking() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    event_date: "",
    place: "",
    comments: "",
    booking_status: "pending",
    payment_status: "pending",
  });

  const [clientData, setClientData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (
      clientData.name === "" ||
      clientData.lastName === "" ||
      clientData.phoneNumber === "" ||
      bookingData.event_date === "" ||
      bookingData.place === ""
    ) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    createBooking(clientData, bookingData);
    alert("Reserva creada con éxito");
    navigate("/reservas");
  }

  function handleCancel() {
    const confirmCancel = window.confirm(
      "¿Está seguro de que desea cancelar la reserva?"
    );
    if (confirmCancel) {
      navigate("/reservas");
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="border-2 w-11/12 md:w-8/12 lg:w-6/12 p-8 rounded-2xl bg-white shadow-lg">
        <form className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Datos cliente */}
            <div className="flex flex-col gap-6">
              <div className="text-lg font-semibold flex items-center gap-1">
                Datos cliente <p className="text-red-500">*</p>
              </div>
              <div className="flex flex-col gap-4">
                <Input
                  type="name"
                  placeholder="Nombre del Cliente"
                  value={clientData.name}
                  required
                  onChange={(e) =>
                    setClientData({
                      ...clientData,
                      name: e.currentTarget.value,
                    })
                  }
                />
                <Input
                  type="lastName"
                  placeholder="Apellido del Cliente"
                  required
                  onChange={(e) =>
                    setClientData({
                      ...clientData,
                      lastName: e.currentTarget.value,
                    })
                  }
                />
                <Input
                  type="phone"
                  placeholder="Teléfono del Cliente"
                  required
                  onChange={(e) =>
                    setClientData({
                      ...clientData,
                      phoneNumber: e.currentTarget.value,
                    })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email del Cliente"
                  onChange={(e) =>
                    setClientData({
                      ...clientData,
                      email: e.currentTarget.value,
                    })
                  }
                />
              </div>

              {/* Información del evento */}
              <div className="flex flex-col gap-6">
                <div className="text-lg font-semibold flex items-center gap-1">
                  Evento <p className="text-red-500">*</p>
                </div>
                <div className="flex flex-col gap-6">
                  <Input
                    type="location"
                    placeholder="Ubicación del Evento"
                    required
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        place: e.currentTarget.value,
                      })
                    }
                  />
                  <Input
                    type="date"
                    required
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        event_date: e.currentTarget.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Equipo y comentarios */}
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
                name="comments"
                placeholder="Información adicional del evento..."
                className="w-full border-2 rounded-lg p-3"
                maxLength={400}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    comments: e.currentTarget.value,
                  })
                }
              ></textarea>

              {/* Estado del evento y pago */}
              <div className="flex gap-6 border-t-2 pt-6">
                <div className="flex flex-col w-1/2">
                  Estado Evento
                  <select
                    className="mt-1 border-2 rounded-xl p-2"
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        booking_status: e.currentTarget.value,
                      })
                    }
                    value={bookingData.booking_status}
                  >
                    <option value="confirm">Confirmado</option>
                    <option value="pending">Pendiente</option>
                    <option value="cancel">Cancelado</option>
                  </select>
                </div>

                <div className="flex flex-col w-1/2">
                  Estado Pago
                  <select
                    className="mt-1 border-2 rounded-xl p-2"
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        payment_status: e.currentTarget.value,
                      })
                    }
                    value={bookingData.payment_status}
                  >
                    <option value="confirm">Abonado</option>
                    <option value="cancel">Seña</option>
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
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSubmit}>Agendar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
