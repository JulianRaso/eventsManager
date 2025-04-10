import { useState } from "react";
import CategoryLayout from "../components/CategoryLayout";
import FilterStock from "../components/FilterStock";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../components/Table";
import { useGetTransport } from "../hooks/useGetTransport";
import Action from "../components/Action";
import Spinner from "../components/Spinner";

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
};

interface vehicleProps {
  id: number;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  type: string;
  last_service: string;
  status: keyof typeof statusTypes;
}

export default function Transport() {
  const [filterByName, setFilterByName] = useState("");
  const { data, isLoading } = useGetTransport();

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Transporte">
      <FilterStock
        filterByName={filterByName}
        setFilterByName={setFilterByName}
        navigateTo=""
      />
      <Table>
        <TableHead>
          <TableRow>{null}</TableRow>
          <TableRow>Marca</TableRow>
          <TableRow>Modelo</TableRow>
          <TableRow>Año</TableRow>
          <TableRow>Patente</TableRow>
          <TableRow>Tipo</TableRow>
          <TableRow>Service</TableRow>
          <TableRow>Estado</TableRow>
          <TableRow>Acciones</TableRow>
        </TableHead>
        {data
          ?.filter((vehicle) => {
            return filterByName.toLowerCase() === ""
              ? vehicle
              : vehicle.brand
                  .toLowerCase()
                  .includes(filterByName.toLowerCase());
          })
          .map((vehicle: vehicleProps, index) => (
            <TableBody key={index}>
              <TableData>{index + 1}</TableData>
              <TableData>{vehicle.brand}</TableData>
              <TableData>{vehicle.model}</TableData>
              <TableData>{vehicle.year}</TableData>
              <TableData>{vehicle.license_plate}</TableData>
              <TableData>{vehicle.type}</TableData>
              <TableData>{vehicle.last_service}</TableData>
              <TableData>{statusTypes[vehicle.status].es}</TableData>
              <TableData>
                <Action
                  id={vehicle.id}
                  isDeleting={false}
                  onDelete={() => {}}
                />
              </TableData>
            </TableBody>
          ))}
      </Table>
    </CategoryLayout>
  );
}
