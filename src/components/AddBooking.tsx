import { useState } from "react";
import { NavLink } from "react-router-dom";
import Input from "../ui/Input";

export default function AddBooking() {
  const [date, setDate] = useState();
  const [price, setPrice] = useState(0);
  // const [payment, setPayment] = useState(false);
  // const [status, setStatus] = useState("");
  // const submit = useSubmit()

  function handlePrice(value) {
    setPrice(price + value);
  }
  function handleData(event) {
    event?.preventDefault();
  }

  return (
    <form
      className="w-full h-full flex items-center justify-center"
      onSubmit={handleData}
    >
      <div className="border-1 w-8/12 md:w-5/12 p-8 rounded-2xl bg-bay-of-many-50 flex flex-col gap-8">
        {/* Client Data */}
        <div className="flex flex-col gap-4 ">
          <div className="text-lg font-bold">Datos cliente</div>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <Input name="name" value="Nombre del cliente" />
            <Input name="lastName" value="Apellido" />
            <Input name="phoneNumber" value="Telefono" />
          </div>
        </div>

        {/* Event Information */}
        <div className="flex flex-col gap-2 border-t-1">
          <div className="text-lg font-bold">Evento</div>
          <div className="flex justify-around items-center flex-wrap">
            <Input name="location" value="Ubicacion" />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.value)}
              className="border-1 rounded-xl p-2"
            />
          </div>
        </div>

        {/* //Event Equipment */}
        <div className="border-t-1">
          <div className="text-lg font-bold">Equipo</div>
          <div className="flex justify-between flex-wrap p-4">
            <div>
              <div>Iluminacion</div>
            </div>
            <div>
              <div>Sonido</div>
            </div>
          </div>
        </div>

        {/* Event comments */}
        <div className="text-lg font-bold">
          <div className="">Informacion Adicional</div>
          <textarea
            name="comments"
            placeholder="Informacion adicional del evento..."
            className="w-full border-1 rounded-lg p-2"
            maxLength={400}
          ></textarea>
        </div>

        {/* //Event states */}
        <div className="flex justify-around flex-wrap border-t-1">
          <div className="flex flex-col">
            Estado Evento
            <select className="mt-1 border-1 rounded-xl p-1">
              <option value="confirm" className="bg-green-400">
                Confirmado
              </option>
              <option value="pending" className="bg-amber-300">
                Pendiente
              </option>
              <option value="cancel" className="bg-red-400">
                Cancelado
              </option>
            </select>
          </div>

          {/* Event payment */}
          <div className="flex flex-col">
            Estado Pago
            <select className="mt-1 border-1 rounded-xl p-1">
              <option value="confirm" className="bg-green-400">
                Abonado
              </option>
              <option value="cancel" className="bg-amber-600">
                Seña
              </option>
              <option value="pending" className="bg-amber-300">
                Pendiente
              </option>
            </select>
          </div>
        </div>

        {/* Navigation & price */}
        <div className="w-full flex justify-between items-center mt-4">
          <NavLink
            to="/reservas"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Cancelar
          </NavLink>
          <div className="border-1 rounded-xl p-2 bg-gray-100 flex justify-center">
            Precio ${price}
          </div>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full ">
            Agendar
          </button>
        </div>
      </div>
    </form>
  );
}
