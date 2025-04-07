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

export default function Lightning() {
  const { data, isLoading } = useGetData({ category: "lights" });
  const { isDelete, deleteStock } = useDeleteStock();
  const [filterByName, setFilterByName] = useState("");

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Iluminacion">
      <FilterStock
        navigateTo="/reservas/reserva/agendar"
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
          .map((light, index) => (
            <TableBody key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{light.name}</TableData>
              <TableData>{light.quantity}</TableData>
              <TableData>{light.location}</TableData>
              <TableData>{light.price}</TableData>
              <TableData>
                <Action
                  id={light.id}
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
