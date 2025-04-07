import { useState } from "react";
import BookingRow from "../components/Bookings/BookingRow";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
import Spinner from "../components/Spinner";
import { Table, TableData, TableHead } from "../components/Table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import useGetBookings from "../hooks/useGetBookings";

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
  const [filterByName, setFilterByName] = useState("");
  const [value, setValue] = useState("");

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Reservas">
      <Filter
        navigateTo="/reservas/reserva/agendar"
        filterByName={filterByName}
        filterByStatus={filterByStatus}
        setFilterByName={setFilterByName}
        value={value}
        setValue={setValue}
      />
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
