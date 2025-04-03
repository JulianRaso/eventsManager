import { useQuery } from "@tanstack/react-query";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getBookings } from "../services/data";
import { Button } from "../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

export default function Bookings() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
  if (isLoading) return <Spinner />;

  return (
    <div className="p-8 w-full">
      <div className="w-full flex justify-end m-2">
        <NavLink to="/reservas/reserva/agendar">
          <Button variant="destructive">
            <IoMdAdd />
          </Button>
        </NavLink>
      </div>

      <div className="w-full flex justify-end mt-4 mr-4">Filtro</div>

      <table className="min-w-full border-collapse table-auto ">
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
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.id}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.client.name}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.client.lastName}
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.client.phoneNumber}
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
                  className={`w-fit rounded-xl p-1.5 ${
                    item.booking_status === "confirm"
                      ? "bg-green-300"
                      : item.booking_status === "pending"
                      ? "bg-amber-300"
                      : "bg-red-500"
                  }`}
                >
                  {item.booking_status === "pending"
                    ? "Pendiente"
                    : item.booking_status === "confirm"
                    ? "Confirmado"
                    : "Cancelado"}
                </p>
              </td>
              <td className="px-4 py-2 border-b text-md text-gray-800">
                {item.paid_status === "pending"
                  ? "Pendiente"
                  : item.paid_status === "partially_paid"
                  ? "Señado"
                  : "Abonado"}
              </td>
              <td className="border-b text-gray-800">Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 10 ? (
        <div className="w-full flex items-center mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
