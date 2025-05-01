import AddUser from "../components/AddUser";
import CategoryLayout from "../components/CategoryLayout";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../components/Table";
import { Button } from "../components/ui/button";

export default function HumandResource() {
  const roles = ["Ver", "Agregar", "Modificar", "Eliminar"];

  return (
    <div className="">
      <CategoryLayout title="Personal">
        <Table>
          <TableHead>
            <TableData>
              <AddUser />
            </TableData>
            <TableData>Usuario</TableData>
            <TableData>Email</TableData>
            <TableData>Dashboard</TableData>
            <TableData>Reservas</TableData>
            <TableData>Personal</TableData>
            <TableData>Inventario</TableData>
            <TableData>Transporte</TableData>
            <TableData>Modificado</TableData>
            <TableData>Cambios</TableData>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableData>{1}</TableData>
              <TableData>Julian</TableData>
              <TableData>Test@example.com</TableData>
              <TableData>
                {roles.map((role) => (
                  <p>{role}</p>
                ))}
              </TableData>
              <TableData>
                {roles.map((role) => (
                  <p>{role}</p>
                ))}
              </TableData>
              <TableData>
                {roles.map((role) => (
                  <p>{role}</p>
                ))}
              </TableData>
              <TableData>
                {roles.map((role) => (
                  <p>{role}</p>
                ))}
              </TableData>
              <TableData>
                {roles.map((role) => (
                  <p>{role}</p>
                ))}
              </TableData>
              <TableData>Sistema</TableData>
              <TableData>
                <Button>Guardar</Button>
              </TableData>
            </TableRow>
          </TableBody>
        </Table>
      </CategoryLayout>
    </div>
  );
}
