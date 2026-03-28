import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarRange, CheckCircle2, Clock, LayoutList, XCircle } from "lucide-react";
import AddButton from "../components/AddButton";
import BookingsMobileList from "../components/Bookings/BookingsMobileList";
import BookingsCalendar from "../components/Bookings/BookingsCalendar";
import BookingRow from "../components/Bookings/BookingRow";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
import Spinner from "../components/Spinner";
import { KPICard } from "../components/ui/KPICard";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeaderData,
} from "../components/Table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import useGetBookings from "../hooks/useGetBookings";
import { useMediaQuery } from "../hooks/useMediaQuery";
import usePagination from "../hooks/usePagination";
import { FilterOption } from "../types";

const filterByStatus: FilterOption[] = [
  { value: "confirm", label: "Confirmado" },
  { value: "pending", label: "Pendiente" },
  { value: "cancel", label: "Cancelado" },
  { value: "paid", label: "Abonado" },
  { value: "partially_paid", label: "Señado" },
  { value: "marriage", label: "Casamiento" },
  { value: "corporate", label: "Corporativo" },
  { value: "fifteen_party", label: "Cumpleaños XV" },
  { value: "birthday", label: "Cumpleaños" },
  { value: "other", label: "Otros" },
];

// Función auxiliar para filtrar reservas
function filterBookings<
  T extends {
    client?: { name?: string } | null;
    booking_status: string;
    payment_status: string;
    event_type: string;
  }
>(bookings: T[], nameFilter: string, statusFilter: string): T[] {
  return bookings.filter((booking) => {
    // Filtro por nombre
    const matchesName =
      !nameFilter ||
      booking.client?.name?.toLowerCase().includes(nameFilter.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      !statusFilter ||
      booking.booking_status === statusFilter ||
      booking.payment_status === statusFilter ||
      booking.event_type === statusFilter;

    return matchesName && matchesStatus;
  });
}

export default function Bookings() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data, isLoading } = useGetBookings();
  const [filterByName, setFilterByName] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [view, setView] = useState<"table" | "calendar">("table");

  // Ordenar y filtrar datos
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) =>
      a.event_date < b.event_date ? 1 : a.event_date > b.event_date ? -1 : 0
    );
  }, [data]);

  // Aplicar filtros
  const filteredData = useMemo(() => {
    return filterBookings(sortedData, filterByName, statusValue);
  }, [sortedData, filterByName, statusValue]);

  // Paginación siempre sobre los datos filtrados
  const {
    currentPage,
    setCurrentPage,
    pages,
    currentItems,
    goToNextPage,
    goToPrevPage,
  } = usePagination({ data: filteredData, limit: 5 });

  // KPI totals (over all bookings, not filtered)
  const totals = useMemo(() => {
    if (!sortedData) return { total: 0, confirmed: 0, pending: 0, cancelled: 0 };
    return {
      total: sortedData.length,
      confirmed: sortedData.filter((b) => b.booking_status === "confirm").length,
      pending: sortedData.filter((b) => b.booking_status === "pending").length,
      cancelled: sortedData.filter((b) => b.booking_status === "cancel").length,
    };
  }, [sortedData]);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filterByName, statusValue, setCurrentPage]);

  if (isLoading) return <Spinner />;

  const displayData = currentItems;

  return (
    <CategoryLayout title="Reservas">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard
          title="Total"
          value={totals.total}
          icon={CalendarRange}
          variant="primary"
        />
        <KPICard
          title="Confirmadas"
          value={totals.confirmed}
          icon={CheckCircle2}
          variant="success"
        />
        <KPICard
          title="Pendientes"
          value={totals.pending}
          icon={Clock}
          variant="warning"
        />
        <KPICard
          title="Canceladas"
          value={totals.cancelled}
          icon={XCircle}
          variant="info"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Filter
          filterByName={filterByName}
          filterByStatus={filterByStatus}
          setFilterByName={setFilterByName}
          value={statusValue}
          setValue={setStatusValue}
          className="sm:flex-1 sm:max-w-none"
        />
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => setView("table")}
              className={`rounded-md p-1.5 transition-colors ${
                view === "table"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Vista tabla"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`rounded-md p-1.5 transition-colors ${
                view === "calendar"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Vista calendario"
            >
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>
          <AddButton navigateTo="/reservas/reserva/agendar" label="Nueva reserva" />
        </div>
      </div>

      {view === "calendar" ? (
        <BookingsCalendar bookings={filteredData} />
      ) : filteredData.length > 0 ? (
        isDesktop ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableHeaderData className="w-10">#</TableHeaderData>
                <TableHeaderData>Cliente</TableHeaderData>
                <TableHeaderData>Contacto</TableHeaderData>
                <TableHeaderData>Organización</TableHeaderData>
                <TableHeaderData>Fecha</TableHeaderData>
                <TableHeaderData className="hidden lg:table-cell">Tipo</TableHeaderData>
                <TableHeaderData>Ubicación</TableHeaderData>
                <TableHeaderData>Estado</TableHeaderData>
                <TableHeaderData>Estado pago</TableHeaderData>
                <TableHeaderData>Precio</TableHeaderData>
                <TableHeaderData className="text-center">Acciones</TableHeaderData>
              </TableHead>
              <TableBody>
                {displayData.map((booking, index) => (
                  <BookingRow key={booking.id} booking={booking} index={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <BookingsMobileList bookings={displayData} />
        )
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <CalendarRange className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {filterByName || statusValue
              ? "No hay reservas con esos filtros"
              : "Aún no hay reservas"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterByName || statusValue
              ? "Prueba cambiando o limpiando los filtros."
              : "Agenda la primera reserva para comenzar."}
          </p>
          {!filterByName && !statusValue && (
            <div className="mt-4">
              <AddButton navigateTo="/reservas/reserva/agendar" label="Nueva reserva" />
            </div>
          )}
        </div>
      )}

      {view === "table" && filteredData.length > 5 && (
        <Pagination className="mt-4 flex w-full items-center justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={goToPrevPage} size="default" />
            </PaginationItem>
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  size="default"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={goToNextPage} size="default" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </CategoryLayout>
  );
}
