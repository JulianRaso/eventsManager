export default function EventBooking() {
  return (
    <div className="flex flex-col gap-4">
      {/* Event Equipment */}
      <div className="">
        <div className="text-lg font-bold">Equipo</div>
        <div className="flex justify-between flex-wrap p-4">
          <div className="flex flex-col">
            <div>Sonido</div>
            <div className="border rounded-2xl p-1">Potencia 2x400w</div>
          </div>
          <div>
            <div>Iluminacion</div>
            <div className="border rounded-2xl p-1">Tacho RGB</div>
          </div>
          <div>
            <div>Ambientacion</div>
            <div className="border rounded-2xl p-1">Entelado 4mts</div>
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

      {/* Event states */}
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
      <div className="border-1 rounded-xl p-2 bg-gray-100 flex justify-center items-center">
        Precio ${0}
      </div>
    </div>
  );
}
