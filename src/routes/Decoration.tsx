import { useState } from "react";
import Action from "../components/Action";
import CategoryLayout from "../components/CategoryLayout";
import FilterStock from "../components/FilterStock";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableData,
  TableRow,
} from "../components/Table";
import useDeleteStock from "../hooks/useDeleteStock";
import useGetData from "../hooks/UseGetData";

export default function Decoration() {
  const { data, isLoading } = useGetData({ category: "decoration" });
  const { isDelete, deleteStock } = useDeleteStock();
  const [filterByName, setFilterByName] = useState("");

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Ambientacion">
      <FilterStock
        navigateTo=""
        filterByName={filterByName}
        setFilterByName={setFilterByName}
      />
      <Table>
        <TableHead>
          <TableRow>{null}</TableRow>
          <TableRow>Nombre</TableRow>
          <TableRow>Cantidad</TableRow>
          <TableRow>Ubicacion</TableRow>
          <TableRow>Precio</TableRow>
          <TableRow>Acciones</TableRow>
        </TableHead>
        {data
          ?.filter((item) => {
            return filterByName.toLowerCase() === ""
              ? item
              : item.name?.toLowerCase().includes(filterByName.toLowerCase());
          })
          .map((decoration, index) => (
            <TableBody key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{decoration.name}</TableData>
              <TableData>{decoration.quantity}</TableData>
              <TableData>{decoration.location}</TableData>
              <TableData>{decoration.price}</TableData>
              <TableData>
                <Action
                  id={decoration.id}
                  isDeleting={isDelete}
                  onDelete={deleteStock}
                />
              </TableData>
            </TableBody>
          ))}
      </Table>
    </CategoryLayout>
  );
}
