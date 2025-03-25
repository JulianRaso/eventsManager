import { NavLink } from "react-router-dom";
import Input from "../ui/Input";

export default function AddBooking() {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="border-1 w-5/12 p-8 rounded-2xl bg-bay-of-many-50">
        <div className="flex flex-col gap-2 w-fit mb-4">
          <div className="text-lg font-bold">Datos cliente</div>
          <Input value="Nombre del cliente" />
          <Input value="Apellido" />
          <Input value="Contacto" />
        </div>
        <div className="flex flex-col gap-2 w-fit">
          <div className="text-lg font-bold">Evento</div>
          <div>Fecha</div>
          <div>Equipo</div>
          <Input value="Ubicacion" />
          <Input type="number" value="Precio" min={0} />
        </div>

        <div>Estado Evento</div>
        <div>Estado Pago</div>
        <div className="w-full flex justify-between items-center mt-4">
          <NavLink
            to="/reservas"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Cancelar
          </NavLink>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full ">
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
}
