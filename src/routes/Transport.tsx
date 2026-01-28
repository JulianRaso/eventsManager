import { useMemo, useState } from "react";
import { Truck } from "lucide-react";
import AddButton from "../components/AddButton";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
import { formatDate } from "../components/formatDate";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableHeaderData,
  TableRow,
} from "../components/Table";
import TableButtons from "../components/TableButtons";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { useGetTransport } from "../hooks/useGetTransport";
import useDeleteTransport from "@/hooks/useDeleteTransport";
import usePagination from "../hooks/usePagination";

const statusTypes = {
  available: {
    es: "Disponible",
    en: "Available",
  },
  inUse: {
    es: "En uso",
    en: "In use",
  },
  maintenance: {
    es: "Mantenimiento",
    en: "Maintenance",
  },
  null: {
    es: "Sin estado",
    en: "No status",
  },
};

const filterByCategory = [
  {
    value: "available",
    label: "Disponible",
  },
  {
    value: "inUse",
    label: "En uso",
  },
  { value: "maintenance", label: "En Mantenimiento" },
];

// Función auxiliar para filtrar vehículos (genérica para conservar el tipo completo)
function filterVehicles<T extends { brand?: string; status: string | null }>(
  vehicles: T[],
  nameFilter: string,
  statusFilter: string
): T[] {
  return vehicles.filter((vehicle) => {
    // Filtro por nombre
    const matchesName =
      !nameFilter ||
      vehicle.brand?.toLowerCase().includes(nameFilter.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      !statusFilter ||
      vehicle.status === statusFilter ||
      (statusFilter === "" && vehicle.status === null);

    return matchesName && matchesStatus;
  });
}

export default function Transport() {
  const [value, setValue] = useState("");
  const [filterByName, setFilterByName] = useState("");
  const { data, isLoading } = useGetTransport();
  const { deleteTransport, isPending } = useDeleteTransport();

  // Aplicar filtros
  const filteredData = useMemo(() => {
    if (!data) return [];
    return filterVehicles(data, filterByName, value);
  }, [data, filterByName, value]);

  // Usar hook de paginación
  const {
    currentPage,
    setCurrentPage,
    pages,
    currentItems,
    goToNextPage,
    goToPrevPage,
  } = usePagination({ data: filteredData, limit: 10 });

  if (isLoading) return <Spinner />;

  // Si hay filtro activo, mostrar todos los resultados filtrados; si no, usar paginación
  const displayData = filterByName || value ? filteredData : currentItems;

  return (
    <CategoryLayout title="Transporte">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Filter
          filterByName={filterByName}
          filterByStatus={filterByCategory}
          setFilterByName={setFilterByName}
          value={value}
          setValue={setValue}
          className="sm:flex-1 sm:max-w-none"
        />
        <AddButton navigateTo="/transporte/agregar" label="Nuevo vehículo" />
      </div>

      {filteredData.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeaderData className="w-10">#</TableHeaderData>
              <TableHeaderData>Marca</TableHeaderData>
              <TableHeaderData>Modelo</TableHeaderData>
              <TableHeaderData>Año</TableHeaderData>
              <TableHeaderData>Patente</TableHeaderData>
              <TableHeaderData>Tipo</TableHeaderData>
              <TableHeaderData className="hidden lg:table-cell">Service</TableHeaderData>
              <TableHeaderData>Estado</TableHeaderData>
              <TableHeaderData className="hidden lg:table-cell">Modificado</TableHeaderData>
              <TableHeaderData className="text-center">Acciones</TableHeaderData>
            </TableHead>
            <TableBody>
              {displayData.map((vehicle, index) => (
                <TableRow key={vehicle.id}>
                  <TableData>{index + 1}</TableData>
                  <TableData>{vehicle.brand}</TableData>
                  <TableData>{vehicle.model}</TableData>
                  <TableData>{vehicle.year}</TableData>
                  <TableData>{vehicle.license_plate}</TableData>
                  <TableData>{vehicle.type}</TableData>
                  <TableData className="hidden lg:table-cell">
                    {vehicle.last_service
                      ? formatDate(vehicle.last_service)
                      : "No hay registro"}
                  </TableData>
                  <TableData>
                    {
                      statusTypes[
                        (vehicle.status != null ? vehicle.status : "null") as keyof typeof statusTypes
                      ].es
                    }
                  </TableData>
                  <TableData className="hidden lg:table-cell">{vehicle.updated_by}</TableData>
                  <TableData>
                    <TableButtons
                      id={vehicle.id}
                      route="/transporte/editar"
                      isDeleting={isPending}
                      onDelete={() => {
                        deleteTransport(vehicle.id);
                      }}
                    />
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <Truck className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {filterByName || value
              ? "No hay vehículos con esos filtros"
              : "Aún no hay vehículos registrados"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterByName || value
              ? "Prueba cambiando o limpiando los filtros."
              : "Agrega el primer vehículo para comenzar."}
          </p>
          {!filterByName && !value && (
            <div className="mt-4">
              <AddButton navigateTo="/transporte/agregar" label="Nuevo vehículo" />
            </div>
          )}
        </div>
      )}

      {filteredData.length > 0 && !filterByName && !value && (data?.length ?? 0) > 10 && (
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
