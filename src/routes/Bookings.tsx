import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { NavLink } from "react-router-dom";
import BookingRow from "../components/Bookings/BookingRow";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { Table, TableData, TableHead } from "../components/Table";
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
import useGetBookings from "../hooks/useGetBookings";
import { cn } from "../lib/utils";

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

export default function Bookings() {
  const { data = [], isLoading } = useGetBookings();
  const [open, setOpen] = useState(false);
  const [filterByName, setFilterByName] = useState("");
  const [value, setValue] = useState("");

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Reservas">
      <div className="w-full flex justify-between m-4">
        <NavLink to="/reservas/reserva/agendar">
          <Button variant="outline">
            <IoMdAdd />
          </Button>
        </NavLink>
        <div className="flex gap-1 items-center">
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={filterByName}
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
          <Button
            variant="outline"
            onClick={() => (setValue(""), setFilterByName(""))}
          >
            X
          </Button>
        </div>
      </div>
      <Table>
        <TableHead>
          <TableData>{null}</TableData>
          <TableData>Nombre</TableData>
          <TableData>Apellido</TableData>
          <TableData>Contacto</TableData>
          <TableData>Fecha</TableData>
          <TableData>Ubicacion</TableData>
          <TableData>Estado</TableData>
          <TableData>Estado pago</TableData>
          <TableData>Precio</TableData>
          <TableData>Acciones</TableData>
        </TableHead>
        {data
          ?.filter((item) => {
            return filterByName.toLowerCase() === ""
              ? item
              : item.client?.name
                  ?.toLowerCase()
                  .includes(filterByName.toLowerCase());
          })
          .map((booking, index) =>
            value ? (
              booking.booking_status === value ? (
                <BookingRow key={index} booking={booking} index={index} />
              ) : booking.payment_status === value ? (
                <BookingRow key={index} booking={booking} index={index} />
              ) : (
                ""
              )
            ) : (
              <BookingRow key={index} booking={booking} index={index} />
            )
          )}
      </Table>
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
    </CategoryLayout>
  );
}
