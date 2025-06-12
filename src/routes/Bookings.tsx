import { useState } from "react";
import AddButton from "../components/AddButton";
import BookingRow from "../components/Bookings/BookingRow";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
import Spinner from "../components/Spinner";
import { Table, TableBody, TableData, TableHead } from "../components/Table";
import {
  Pagination,
  PaginationContent,
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
  {
    value: "marriage",
    label: "Casamiento",
  },
  {
    value: "corporate",
    label: "Corporativo",
  },
  {
    value: "fifteen_birthday",
    label: "Cumpleaños XV",
  },
  {
    value: "birthday",
    label: "Cumpleaños",
  },
  {
    value: "other",
    label: "Otros",
  },
];

export default function Bookings() {
  const { data, isLoading } = useGetBookings();
  const [filterByName, setFilterByName] = useState("");
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((data?.length ?? 0) / 5);
  const limit = 5;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const lastPostIndex = currentPage * limit;
  const firstPostIndex = lastPostIndex - limit;
  const currentPosts = data
    ?.sort((a, b) =>
      a.event_date < b.event_date ? 1 : a.event_date > b.event_date ? -1 : 0
    )
    .slice(firstPostIndex, lastPostIndex);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Reservas">
      <Filter
        filterByName={filterByName}
        filterByStatus={filterByStatus}
        setFilterByName={setFilterByName}
        value={value}
        setValue={setValue}
      />
      <div className="overflow-auto">
        <Table>
          <TableHead>
            <TableData>
              <AddButton navigateTo="/reservas/reserva/agendar" />
            </TableData>
            <TableData>Cliente</TableData>
            <TableData>Contacto</TableData>
            <TableData>Organizacion</TableData>
            <TableData>Fecha</TableData>
            <TableData className="hidden lg:table-cell">Tipo</TableData>
            <TableData>Ubicacion</TableData>
            <TableData>Estado</TableData>
            <TableData>Estado pago</TableData>
            <TableData>Precio</TableData>
            <TableData>Acciones</TableData>
          </TableHead>
          <TableBody>
            {(filterByName ? data : currentPosts)
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
                  ) : booking.event_type === value ? (
                    <BookingRow key={index} booking={booking} index={index} />
                  ) : (
                    ""
                  )
                ) : (
                  <BookingRow key={index} booking={booking} index={index} />
                )
              )}
          </TableBody>
        </Table>
      </div>
      {/* {Check if the data is empty and show a message} */}
      {data?.length === 0 && (
        <div className="text-2xl text-center mt-4">Agenda una Reserva!!</div>
      )}
      {/* Check if the data is more than the limit and show pagination */}
      {(data?.length ?? 0) > limit && (
        <Pagination className="w-full flex items-center mt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                size={"lg"}
              />
            </PaginationItem>
            {pages.map((page, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  size={"sm"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                size={"lg"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </CategoryLayout>
  );
}
