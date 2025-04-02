import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { getBookings } from "../services/data";

type Booking = {
  id: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  event_date: string;
  place: string;
  equipment: string;
  price: number;
  booking_status: string;
  paid_status: string;
};

const columnHelper = createColumnHelper<Booking>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("name", {
    header: () => <span>Nombre</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lastName", {
    header: () => <span>Apellido</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("phoneNumber", {
    header: () => "Contacto",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("event_date", {
    header: () => <span>Fecha</span>,
  }),
  columnHelper.accessor("place", {
    header: "Ubicación",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("equipment", {
    header: "Equipo",
  }),
  columnHelper.accessor("price", {
    header: "Precio",
  }),
  columnHelper.accessor("booking_status", {
    header: "Status",
  }),
  columnHelper.accessor("paid_status", {
    header: "Estado Pago",
  }),
];

export default function Bookings() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div>Data is Loading....</div>;
  }

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

      <table className="border-1 w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border-1 ${
                    header.index % 2 ? "bg-gray-200" : ""
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-1  hover:bg-bay-of-many-200">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={`border-1 text-center `}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
