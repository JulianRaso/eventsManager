import { useQuery } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getBookings } from "../services/data";

export default function Bookings() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="p-8 w-full ">
      <div className="w-full flex justify-end mb-2">
        <NavLink
          to="/reservas/reserva/agendar"
          className="border-1 rounded-xl p-2 bg-blue-300 hover:bg-blue-400"
        >
          <IoMdAdd />
        </NavLink>
      </div>

      <table className="min-w-full border-collapse table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              ID
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Nombre
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Apellido
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Contacto
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Fecha
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Ubicación
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Equipo
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Precio
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Estado
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">
              Estado Pago
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.id}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.name}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.lastName}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.phoneNumber}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.event_date}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.place}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.equipment}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.price}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                <p
                  className={
                    item.booking_status === "Confirmado"
                      ? "bg-green-300 w-fit rounded-2xl p-0.5"
                      : ""
                  }
                >
                  {item.booking_status}
                </p>
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.paid_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
