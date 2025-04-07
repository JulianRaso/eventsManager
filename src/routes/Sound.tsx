import { useState } from "react";
import Action from "../components/Action";
import CategoryLayout from "../components/CategoryLayout";
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
import FilterStock from "../components/FilterStock";

export default function Sound() {
  const [filterByName, setFilterByName] = useState("");
  const { isDelete, deleteStock } = useDeleteStock();
  const {
    data = [{ name: "", quantity: 0, location: "", price: 0 }],
    isLoading,
  } = useGetData({ category: "sound" });

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Equipo de Sonido">
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
          .map((sound, index) => (
            <TableBody key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{sound.name}</TableData>
              <TableData>{sound.quantity}</TableData>
              <TableData>{sound.location}</TableData>
              <TableData>{sound.price}</TableData>
              <TableData>
                <Action
                  id={sound.id}
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
