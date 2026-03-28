import { useEffect, useMemo, useState } from "react";
import { Boxes } from "lucide-react";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import useGetStockAvailability from "../hooks/useGetStockAvailability";
import usePagination from "../hooks/usePagination";
import { cn } from "../lib/utils";
import { FilterOption } from "../types";

const filterByCategory: FilterOption[] = [
  { value: "sound", label: "Sonido" },
  { value: "lights", label: "Iluminación" },
  { value: "ambientation", label: "Ambientación" },
  { value: "structure", label: "Estructuras" },
  { value: "cables", label: "Cables" },
  { value: "screen", label: "Pantalla" },
  { value: "furniture", label: "Muebles" },
  { value: "tools", label: "Herramientas" },
  { value: "others", label: "Otros" },
];

const categoryLabels: Record<string, string> = {
  sound: "Sonido",
  lights: "Iluminación",
  ambientation: "Ambientación",
  structure: "Estructuras",
  cables: "Cables",
  screen: "Pantalla",
  furniture: "Muebles",
  tools: "Herramientas",
  others: "Otros",
};

interface StockItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  allocated: number;
  available: number;
}

export default function Disponibilidad() {
  const { availability, isLoading } = useGetStockAvailability();
  const [filterByName, setFilterByName] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  const filteredData = useMemo<StockItem[]>(() => {
    return (availability as StockItem[]).filter((item) => {
      const matchesName =
        !filterByName ||
        item.name?.toLowerCase().includes(filterByName.toLowerCase());
      const matchesCategory =
        !categoryValue || item.category === categoryValue;
      return matchesName && matchesCategory;
    });
  }, [availability, filterByName, categoryValue]);

  const {
    currentPage,
    setCurrentPage,
    pages,
    currentItems,
    goToNextPage,
    goToPrevPage,
  } = usePagination({ data: filteredData, limit: 10 });

  useEffect(() => {
    setCurrentPage(1);
  }, [filterByName, categoryValue, setCurrentPage]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Disponibilidad de Stock">
      <p className="text-sm text-muted-foreground">
        Stock disponible para eventos próximos. Los items marcados como{" "}
        <span className="font-medium text-amber-600">reservados</span> están
        asignados a reservas confirmadas o pendientes con fecha futura.
      </p>

      <Filter
        filterByName={filterByName}
        filterByStatus={filterByCategory}
        setFilterByName={setFilterByName}
        value={categoryValue}
        setValue={setCategoryValue}
      />

      {filteredData.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeaderData className="w-10">#</TableHeaderData>
              <TableHeaderData>Nombre</TableHeaderData>
              <TableHeaderData className="hidden md:table-cell">
                Categoría
              </TableHeaderData>
              <TableHeaderData className="text-center">
                Stock total
              </TableHeaderData>
              <TableHeaderData className="text-center">
                Reservado
              </TableHeaderData>
              <TableHeaderData className="text-center">
                Disponible
              </TableHeaderData>
            </TableHead>
            <TableBody>
              {currentItems.map((item, index) => {
                const isFull = item.available === 0 && item.quantity > 0;
                const isPartial =
                  item.allocated > 0 && item.available > 0;

                return (
                  <TableRow key={item.id}>
                    <TableData>{index + 1}</TableData>
                    <TableData className="font-medium">{item.name}</TableData>
                    <TableData className="hidden md:table-cell text-muted-foreground">
                      {categoryLabels[item.category] ?? item.category}
                    </TableData>
                    <TableData className="text-center tabular-nums">
                      {item.quantity}
                    </TableData>
                    <TableData className="text-center tabular-nums">
                      {item.allocated > 0 ? (
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {item.allocated}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableData>
                    <TableData className="text-center">
                      <span
                        className={cn(
                          "inline-flex min-w-[2.5rem] items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
                          isFull &&
                            "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
                          isPartial &&
                            "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                          !isFull &&
                            !isPartial &&
                            "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        )}
                      >
                        {item.available}
                      </span>
                    </TableData>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <Boxes className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {filterByName || categoryValue
              ? "No hay items con esos filtros"
              : "No hay stock registrado"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterByName || categoryValue
              ? "Prueba cambiando o limpiando los filtros."
              : "Agregá items desde el módulo de Inventario."}
          </p>
        </div>
      )}

      {filteredData.length > 10 && (
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
