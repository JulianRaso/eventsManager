import Action from "../components/Action";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import { Table, TableBody, TableHead } from "../components/Table";
import TableData from "../components/ui/TableData";
import TableRow from "../components/ui/TableRow";
import useDeleteStock from "../hooks/useDeleteStock";
import useGetData from "../hooks/UseGetData";

export default function Decoration() {
  const { data, isLoading } = useGetData({ category: "decoration" });
  const { isDelete, deleteStock } = useDeleteStock();

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Ambientacion">
      <Table>
        <TableHead>
          <TableRow>{null}</TableRow>
          <TableRow>Nombre</TableRow>
          <TableRow>Cantidad</TableRow>
          <TableRow>Ubicacion</TableRow>
          <TableRow>Precio</TableRow>
          <TableRow>Acciones</TableRow>
        </TableHead>
        {data?.map((decoration, index) => (
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
