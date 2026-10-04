import { useMemo, useState, useEffect } from "react";
import { Package } from "lucide-react";
import AddButton from "../../components/AddButton";
import CategoryLayout from "../../components/CategoryLayout";
import Filter from "../../components/Filter";
import { formatDateTime } from "../../components/formatDate";
import Spinner from "../../components/Spinner";
import {
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableHeaderData,
  TableRow,
} from "../../components/Table";
import TableButtons from "../../components/TableButtons";
import PageSizeSelector from "../../components/PageSizeSelector";
import PaginationControls from "../../components/PaginationControls";
import useDeleteStock from "../../hooks/useDeleteStock";
import useGetData from "../../hooks/useGetData";
import usePagination, { type PageSize } from "../../hooks/usePagination";
import { CategoryType, FilterOption } from "../../types";

const filterByCategory: FilterOption[] = [
  { value: "sound", label: "Sonido" },
  { value: "lights", label: "Iluminacion" },
  { value: "ambientation", label: "Ambientacion" },
  { value: "structure", label: "Estructuras" },
  { value: "cables", label: "Cables" },
  { value: "screen", label: "Pantalla" },
  { value: "furniture", label: "Muebles" },
  { value: "tools", label: "Herramientas" },
  { value: "others", label: "Otros" },
];

export default function Inventory() {
  const defaultCategory = "sound";
  const [filterByName, setFilterByName] = useState("");
  const [categoryValue, setCategoryValue] = useState(defaultCategory);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const { data = [], isLoading } = useGetData(categoryValue as CategoryType);
  const { isDelete, deleteStock } = useDeleteStock(categoryValue);

  // Asegurar que siempre haya una categoría seleccionada
  useEffect(() => {
    if (!categoryValue) {
      setCategoryValue(defaultCategory);
    }
  }, [categoryValue]);

  // Filtrar por nombre
  const filteredData = useMemo(() => {
    if (!filterByName) return data;
    return data.filter((item) =>
      item.name?.toLowerCase().includes(filterByName.toLowerCase())
    );
  }, [data, filterByName]);

  // Usar hook de paginación
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    goToNextPage,
    goToPrevPage,
    isPaginated,
  } = usePagination({ data: filteredData, limit: pageSize });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByName, categoryValue, pageSize, setCurrentPage]);

  if (isLoading) return <Spinner />;

  const displayData = currentItems;

  return (
    <CategoryLayout title="Inventario">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Filter
          filterByName={filterByName}
          filterByStatus={filterByCategory}
          setFilterByName={setFilterByName}
          value={categoryValue}
          setValue={setCategoryValue}
          filterLabel="Filtrar por categoría..."
          className="sm:flex-1 sm:max-w-none"
        />
        <div className="flex items-center gap-2">
          <PageSizeSelector value={pageSize} onChange={setPageSize} />
          <AddButton navigateTo="/inventario/agregar" label="Nuevo elemento" />
        </div>
      </div>

      {filteredData.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeaderData className="w-10">#</TableHeaderData>
              <TableHeaderData>Nombre</TableHeaderData>
              <TableHeaderData>Cantidad</TableHeaderData>
              <TableHeaderData>Ubicación</TableHeaderData>
              <TableHeaderData>Precio</TableHeaderData>
              <TableHeaderData className="hidden lg:table-cell">Modificado</TableHeaderData>
              <TableHeaderData className="hidden lg:table-cell">Última actualización</TableHeaderData>
              <TableHeaderData className="text-center">Acciones</TableHeaderData>
            </TableHead>
            <TableBody>
              {displayData.map((type, index) => (
                <TableRow key={type.id}>
                  <TableData>{index + 1}</TableData>
                  <TableData>{type.name}</TableData>
                  <TableData>{type.quantity}</TableData>
                  <TableData>{type.location}</TableData>
                  <TableData>{type.price}</TableData>
                  <TableData className="hidden lg:table-cell">{type.updated_by}</TableData>
                  <TableData className="hidden lg:table-cell">{formatDateTime(type.last_update)}</TableData>
                  <TableData>
                    <TableButtons
                      id={type.id}
                      route="/inventario/editar"
                      isDeleting={isDelete}
                      onDelete={deleteStock}
                      deleteLabel="este elemento"
                    />
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {filterByName
              ? "No hay elementos con ese nombre"
              : "Aún no hay elementos en esta categoría"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterByName
              ? "Prueba cambiando o limpiando el filtro."
              : "Agrega el primer elemento para comenzar."}
          </p>
          {!filterByName && (
            <div className="mt-4">
              <AddButton navigateTo="/inventario/agregar" label="Nuevo elemento" />
            </div>
          )}
        </div>
      )}

      {isPaginated && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPrevious={goToPrevPage}
          onNext={goToNextPage}
        />
      )}
    </CategoryLayout>
  );
}
