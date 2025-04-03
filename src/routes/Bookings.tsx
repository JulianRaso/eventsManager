import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { getBookings } from "../services/data";
import Row from "../components/ui/Row";

const filterByStatus = [
  {
    value: "confirm",
    label: "Confirmado",
  },
  {
    value: "pending",
    label: "Pendiente",
  },
  {
    value: "cancel",
    label: "Cancelado",
  },
  {
    value: "paid",
    label: "Abonado",
  },
  {
    value: "partially_paid",
    label: "Señado",
  },
];

function formatDate(date: string) {
  const dateArr = date.split("-");
  const formatedDate = dateArr.reverse().join("/");
  return formatedDate;
}

export default function Bookings() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
  const [filterByName, setFilterByName] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (isLoading) return <Spinner />;

  return (
    <div className="p-8 w-full">
      <div className="w-full flex  justify-between m-4">
        <NavLink to="/reservas/reserva/agendar">
          <Button variant="outline">
            <IoMdAdd />
          </Button>
        </NavLink>
        <div className="flex gap-1  items-center">
          <input
            type="text"
            placeholder="Nombre del cliente"
            className="border rounded-lg p-1.5 bg-gray-50"
            onChange={(event) => setFilterByName(event.currentTarget.value)}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? filterByStatus.find((status) => status.value === value)
                      ?.label
                  : "Seleccionar filtro..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Buscar filtro" className="h-9" />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {filterByStatus.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {status.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === status.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <table className="min-w-full border-collapse table-auto ">
        <thead className="bg-gray-100">
          <tr>
            <Row>ID</Row>
            <Row>Nombre</Row>
            <Row>Apellido</Row>
            <Row>Contacto</Row>
            <Row>Fecha</Row>
            <Row>Ubicacion</Row>
            <Row>Estado</Row>
            <Row>Estado pago</Row>
            <Row>Precio</Row>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {data
            ?.filter((item) => {
              return filterByName.toLowerCase() === ""
                ? item
                : item.client?.name
                    ?.toLowerCase()
                    .includes(filterByName.toLowerCase());
            })
            .map((item, index) => (
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
                  {formatDate(item.event_date)}
                </td>
                <td className="px-4 py-2 border-b text-md text-gray-800">
                  {item.place}
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
                <td className="px-4 py-2 border-b text-md text-gray-800">
                  {item.price}
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
