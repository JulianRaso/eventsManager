import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react";
import CategoryLayout from "@/components/CategoryLayout";
import Filter from "@/components/Filter";
import IngresosCard from "@/components/Ingresos/IngresosCard";
import IngresosRow from "@/components/Ingresos/IngresosRow";
import Spinner from "@/components/Spinner";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableHeaderData,
} from "@/components/Table";
import { KPICard } from "@/components/ui/KPICard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useGetBookings from "@/hooks/useGetBookings";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePagination from "@/hooks/usePagination";
import { EventType, FilterOption, PaymentStatus } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

const filterByPayment: FilterOption[] = [
  { value: "paid", label: "Abonado" },
  { value: "partially_paid", label: "Señado" },
  { value: "pending", label: "Pendiente" },
];

interface IngresosBooking {
  id: number;
  client: { name: string; lastName: string; phoneNumber: string } | null;
  organization: string;
  event_date: string;
  event_type: EventType;
  payment_status: PaymentStatus;
  booking_status: string;
  price: number;
}

function filterIngresos(
  bookings: IngresosBooking[],
  nameFilter: string,
  statusFilter: string
): IngresosBooking[] {
  return bookings.filter((b) => {
    const matchesName =
      !nameFilter ||
      b.client?.name?.toLowerCase().includes(nameFilter.toLowerCase()) ||
      b.client?.lastName?.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesStatus = !statusFilter || b.payment_status === statusFilter;
    return matchesName && matchesStatus;
  });
}

export default function Ingresos() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data, isLoading } = useGetBookings();
  const [filterByName, setFilterByName] = useState("");
  const [statusValue, setStatusValue] = useState("");

  // Exclude cancelled bookings, sort by event_date desc
  const activeBookings = useMemo<IngresosBooking[]>(() => {
    if (!data) return [];
    return (data as IngresosBooking[])
      .filter((b) => b.booking_status !== "cancel")
      .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));
  }, [data]);

  // KPI totals (over all active bookings, not just filtered)
  const totals = useMemo(() => {
    const sum = (filter: (b: IngresosBooking) => boolean) =>
      activeBookings.filter(filter).reduce((acc, b) => acc + (b.price ?? 0), 0);
    return {
      total: sum(() => true),
      paid: sum((b) => b.payment_status === "paid"),
      partial: sum((b) => b.payment_status === "partially_paid"),
      pending: sum((b) => b.payment_status === "pending"),
    };
  }, [activeBookings]);

  const filteredData = useMemo(
    () => filterIngresos(activeBookings, filterByName, statusValue),
    [activeBookings, filterByName, statusValue]
  );

  const {
    currentPage,
    setCurrentPage,
    pages,
    currentItems,
    goToNextPage,
    goToPrevPage,
  } = usePagination({ data: filteredData, limit: 5 });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByName, statusValue, setCurrentPage]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Ingresos">
      {/* KPI summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard
          title="Total"
          value={`$${formatCurrency(totals.total)}`}
          icon={DollarSign}
          variant="primary"
        />
        <KPICard
          title="Abonado"
          value={`$${formatCurrency(totals.paid)}`}
          icon={CheckCircle2}
          variant="success"
        />
        <KPICard
          title="Señado"
          value={`$${formatCurrency(totals.partial)}`}
          icon={TrendingUp}
          variant="warning"
        />
        <KPICard
          title="Pendiente"
          value={`$${formatCurrency(totals.pending)}`}
          icon={Clock}
          variant="info"
        />
      </div>

      {/* Filters */}
      <Filter
        filterByName={filterByName}
        filterByStatus={filterByPayment}
        setFilterByName={setFilterByName}
        value={statusValue}
        setValue={setStatusValue}
      />

      {/* Table / Cards */}
      {filteredData.length > 0 ? (
        isDesktop ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableHeaderData className="w-10">#</TableHeaderData>
                <TableHeaderData>Cliente</TableHeaderData>
                <TableHeaderData>Organización</TableHeaderData>
                <TableHeaderData>Fecha</TableHeaderData>
                <TableHeaderData className="hidden lg:table-cell">
                  Tipo
                </TableHeaderData>
                <TableHeaderData>Pago</TableHeaderData>
                <TableHeaderData>Precio</TableHeaderData>
                <TableHeaderData className="text-center">
                  Acciones
                </TableHeaderData>
              </TableHead>
              <TableBody>
                {currentItems.map((booking, index) => (
                  <IngresosRow key={booking.id} booking={booking} index={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="flex flex-col gap-3">
            {currentItems.map((booking) => (
              <IngresosCard key={booking.id} booking={booking} />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <TrendingUp className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {filterByName || statusValue
              ? "No hay ingresos con esos filtros"
              : "Aún no hay ingresos"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterByName || statusValue
              ? "Prueba cambiando o limpiando los filtros."
              : "Los ingresos se generan al crear reservas."}
          </p>
        </div>
      )}

      {filteredData.length > 5 && (
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
