import { useState } from "react";
import AddButton from "../components/AddButton";
import CategoryLayout from "../components/CategoryLayout";
import Filter from "../components/Filter";
import { formatDate } from "../components/formatDate";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../components/Table";
import TableButtons from "../components/TableButtons";
import { useGetTransport } from "../hooks/useGetTransport";

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

export default function Transport() {
  const [value, setValue] = useState("");
  const [filterByName, setFilterByName] = useState("");
  const { data, isLoading } = useGetTransport();

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Transporte">
      <Filter
        filterByName={filterByName}
        filterByStatus={filterByCategory}
        setFilterByName={setFilterByName}
        value={value}
        setValue={setValue}
      />
      <Table>
        <TableHead>
          <TableData>
            <AddButton navigateTo="/transporte/agregar" />
          </TableData>
          <TableData>Marca</TableData>
          <TableData>Modelo</TableData>
          <TableData>Año</TableData>
          <TableData>Patente</TableData>
          <TableData>Tipo</TableData>
          <TableData>Service</TableData>
          <TableData>Estado</TableData>
          <TableData>Modificado</TableData>
          <TableData>Acciones</TableData>
        </TableHead>
        <TableBody>
          {data
            ?.filter((vehicle) => {
              return filterByName.toLowerCase() === ""
                ? vehicle
                : vehicle.brand
                    ?.toLowerCase()
                    .includes(filterByName.toLowerCase());
            })
            .map((vehicle, index) => (
              <TableRow key={index}>
                <TableData>{index + 1}</TableData>
                <TableData>{vehicle.brand}</TableData>
                <TableData>{vehicle.model}</TableData>
                <TableData>{vehicle.year}</TableData>
                <TableData>{vehicle.license_plate}</TableData>
                <TableData>{vehicle.type}</TableData>
                <TableData>
                  {vehicle.last_service
                    ? formatDate(vehicle.last_service)
                    : "No hay registro"}
                </TableData>
                <TableData>
                  {
                    statusTypes[
                      vehicle.status != null ? vehicle.status : "null"
                    ].es
                  }
                </TableData>
                <TableData>{vehicle.updated_by}</TableData>
                <TableData>
                  <TableButtons
                    id={vehicle.id}
                    route="/transporte/editar"
                    isDeleting={false}
                    onDelete={() => {}}
                  />
                </TableData>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </CategoryLayout>
  );
}
