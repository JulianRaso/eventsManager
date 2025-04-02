import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function Booking() {
  const location = useLocation();
  const currPath = location.pathname;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border-1 w-8/12 md:w-4/12 p-8 rounded-2xl bg-bay-of-many-50 flex flex-col gap-8">
        <Outlet />

        {/* Navigation*/}
        <div className="w-full flex justify-between items-center">
          <NavLink
            to={
              currPath === "/reservas/reserva/agendar"
                ? "/reservas"
                : "/reservas/reserva/agendar"
            }
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            {currPath === "/reservas/reserva/agendar" ? "Cancelar" : "Anterior"}
          </NavLink>

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            disabled={true}
          >
            <NavLink
              to={
                currPath === "/reservas/reserva/agendar"
                  ? "/reservas/reserva/agendar/evento"
                  : "/reservas"
              }
            >
              {currPath === "/reservas/reserva/agendar"
                ? "Siguiente"
                : "Agendar"}
            </NavLink>
          </button>
        </div>
      </div>
    </div>
  );
}
