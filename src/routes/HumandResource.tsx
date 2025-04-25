import AddUser from "../components/addUser";
import CategoryLayout from "../components/CategoryLayout";
import { Table, TableBody, TableHead, TableRow } from "../components/Table";
import { Button } from "../components/ui/button";

export default function HumandResource() {
  return (
    <div className="">
      <CategoryLayout title="Personal">
        <div>
          <AddUser />
        </div>
        <Table>
          <TableHead>
            <TableRow>{null}</TableRow>
            <TableRow>Usuario</TableRow>
            <TableRow>Email</TableRow>
            <TableRow>Dashboard</TableRow>
            <TableRow>Reservas</TableRow>
            <TableRow>Personal</TableRow>
            <TableRow>Inventario</TableRow>
            <TableRow>Transporte</TableRow>
            <TableRow>Modificado por</TableRow>
            <TableRow>Cambios</TableRow>
          </TableHead>
          <TableBody>
            <TableRow>{1}</TableRow>
            <TableRow>Julian</TableRow>
            <TableRow>Test@example.com</TableRow>
            <TableRow>
              <Button>Leer</Button>
              <Button>Agregar</Button>
              <Button>Modificar</Button>
              <Button>Borrar</Button>
            </TableRow>
            <TableRow>
              <Button>Leer</Button>
              <Button>Modificar</Button>
              <Button>Borrar</Button>
            </TableRow>
            <TableRow>
              <Button>Leer</Button>
              <Button>Modificar</Button>
              <Button>Borrar</Button>
            </TableRow>
            <TableRow>
              <Button>Leer</Button>
              <Button>Modificar</Button>
              <Button>Borrar</Button>
            </TableRow>
            <TableRow>
              <Button>Leer</Button>
              <Button>Modificar</Button>
              <Button>Borrar</Button>
            </TableRow>
            <TableRow>Sistema</TableRow>
            <TableRow>
              <Button>Guardar</Button>
            </TableRow>
          </TableBody>
        </Table>
      </CategoryLayout>
    </div>
  );
}
