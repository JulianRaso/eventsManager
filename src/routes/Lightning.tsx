import Action from "../components/Action";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { Table, TableBody, TableHead } from "../components/Table";
import TableData from "../components/ui/TableData";
import TableRow from "../components/ui/TableRow";
import useDeleteStock from "../hooks/useDeleteStock";
import useGetData from "../hooks/UseGetData";

export default function Lightning() {
  const { data, isLoading } = useGetData({ category: "lights" });
  const { isDelete, deleteStock } = useDeleteStock();

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Iluminacion">
      <Table>
        <TableHead>
          <TableRow>{null}</TableRow>
          <TableRow>Nombre</TableRow>
          <TableRow>Cantidad</TableRow>
          <TableRow>Ubicacion</TableRow>
          <TableRow>Precio</TableRow>
          <TableRow>Acciones</TableRow>
        </TableHead>
        {data?.map((light, index) => (
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
