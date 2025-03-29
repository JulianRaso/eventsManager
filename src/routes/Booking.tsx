import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Booking() {
  const [client, setClient] = useState({
    name: "",
    lastName: "",
    phoneNumber: null,
    date: new Date().toISOString().split("T")[0],
    location: "",
    soundEquipment: [],
    iluminationEquipment: [],
    decoration: [],
    price: null,
    status: "",
    paymentStatus: "",
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border-1 w-8/12 md:w-4/12 p-8 rounded-2xl bg-bay-of-many-50 flex flex-col gap-8">
        <Outlet context={{ client, setClient }} />

        {/* Navigation & price */}
        <div className="w-full flex justify-between items-center mt-4">
          <NavLink
            to="/reservas"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Cancelar
          </NavLink>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            disabled={true}
          >
            <NavLink to="/reservas/reserva/agendar/evento">Siguiente</NavLink>
          </button>
        </div>
      </div>
    </div>
  );
}
