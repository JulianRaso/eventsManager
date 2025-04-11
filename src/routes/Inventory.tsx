import { useState } from "react";
import Action from "../components/Action";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
import { formatDateTime } from "../components/formatDate";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../components/Table";
import useDeleteStock from "../hooks/useDeleteStock";
import useGetData from "../hooks/useGetData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

const filterByCategory = [
  {
    value: "sound",
    label: "Sonido",
  },
  {
    value: "lights",
    label: "Iluminacion",
  },
  {
    value: "structure",
    label: "Escenario",
  },
  {
    value: "cables",
    label: "Cables",
  },
  {
    value: "tools",
    label: "Herramientas",
  },
];

export default function Invetory() {
  const defaultCategory = "sound";
  const [filterByName, setFilterByName] = useState("");
  const [value, setValue] = useState("sound");
  const { data = [], isLoading } = useGetData({ category: value });
  const { isDelete, deleteStock } = useDeleteStock();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil(data?.length / limit);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const lastPostIndex = currentPage * limit;
  const firstPostIndex = lastPostIndex - limit;
  const currentPosts = data?.slice(firstPostIndex, lastPostIndex);

  if (value === "") {
    setValue(defaultCategory);
  }

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Inventario">
      <Filter
        navigateTo="/inventario/agregar"
        filterByName={filterByName}
        filterByStatus={filterByCategory}
        setFilterByName={setFilterByName}
        value={value}
        setValue={setValue}
      />
      <Table>
        <TableHead>
          <TableRow>{null}</TableRow>
          <TableRow>Nombre</TableRow>
          <TableRow>Cantidad</TableRow>
          <TableRow>Ubicacion</TableRow>
          <TableRow>Precio</TableRow>
          <TableRow>Modificado</TableRow>
          <TableRow>Ultima actualizacion</TableRow>
          <TableRow>Acciones</TableRow>
        </TableHead>
        {currentPosts
          ?.filter((item) => {
            return filterByName.toLowerCase() === ""
              ? item
              : item.name?.toLowerCase().includes(filterByName.toLowerCase());
          })
          .map((type, index) => (
            <TableBody key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{type.name}</TableData>
              <TableData>{type.quantity}</TableData>
              <TableData>{type.location}</TableData>
              <TableData>{type.price}</TableData>
              <TableData>{type.updated_by}</TableData>
              <TableData>{formatDateTime(type.last_update)}</TableData>
              <TableData>
                <Action
                  id={type.id}
                  isDeleting={isDelete}
                  onDelete={deleteStock}
                />
              </TableData>
            </TableBody>
          ))}
      </Table>
      {data?.length === 0 && (
        <div className="text-2xl text-center mt-4">
          Empeza a cargar a tu inventario!!
        </div>
      )}
      <div className="w-full flex items-center mt-2">
        <Pagination>
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
                  if (currentPage < Math.ceil(data?.length / limit))
                    setCurrentPage(currentPage + 1);
                }}
                size={"lg"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </CategoryLayout>
  );
}
