import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import data from "../_data/data.json";
import { NavLink } from "react-router-dom";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  date: string;
  place: string;
  worker: string;
  equipment: string;
  price: number;
  status: string;
  paid: string;
};

const defaultData: Person[] = data;

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("firstName", {
    header: () => <span>Nombre</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Apellido</span>,
  }),
  columnHelper.accessor("phoneNumber", {
    header: () => "Contacto",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("date", {
    header: () => <span>Fecha</span>,
  }),
  columnHelper.accessor("place", {
    header: "Ubicación",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("worker", {
    header: "Personal",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("equipment", {
    header: "Equipo",
  }),
  columnHelper.accessor("price", {
    header: "Precio",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("paid", {
    header: "Estado Pago",
  }),
];

export default function Booking() {
  const [data, setData] = useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleSubmit() {
    setData([
      ...data,
      {
        id: 4,
        firstName: "Test",
        lastName: "Subject",
        phoneNumber: "00000001",
        date: "21-03-2025",
        place: "Andes",
        worker: "Test",
        equipment: "",
        price: 1000,
        status: "pending",
        paid: "seña",
      },
    ]);
  }

  return (
    <div className="p-8 w-full ">
      <div className="w-full flex justify-end mb-2">
        <NavLink
          to="/reservas/agendar"
          className="border-1 rounded-xl p-2 bg-blue-300 hover:bg-blue-400"
        >
          <IoMdAdd />
        </NavLink>
      </div>

      <table className="border-1 w-full ">
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
