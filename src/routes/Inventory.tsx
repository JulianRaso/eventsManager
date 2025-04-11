import { useState } from "react";
import Action from "../components/Action";
import CategoryLayout from "../components/CategoryLayout";
import FilterStock from "../components/FilterStock";
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
import useGetData from "../hooks/UseGetData";
import Filter from "../components/Filter";

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
    label: "Herramients",
  },
];

export default function Invetory() {
  const defaultCategory = "sound";
  const [filterByName, setFilterByName] = useState("");
  const [value, setValue] = useState("sound");
  const { data, isLoading } = useGetData({ category: value });
  const { isDelete, deleteStock } = useDeleteStock();

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
        {data
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
    </CategoryLayout>
  );
}
