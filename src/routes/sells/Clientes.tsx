import { useMemo, useState } from "react";
import { Users, UserCheck, Mail, Pencil, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddButton from "../../components/AddButton";
import CategoryLayout from "../../components/CategoryLayout";
import Spinner from "../../components/Spinner";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableHeaderData,
  TableRow,
} from "../../components/Table";
import { KPICard } from "../../components/ui/KPICard";
import { Input } from "../../components/ui/Input";
import useGetClients from "../../hooks/useGetClients";
import { cn } from "../../lib/utils";

export default function Clientes() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetClients();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        (c.dni != null && String(c.dni).includes(q)) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.COD_CLIENTE ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const withEmail = useMemo(
    () => data.filter((c) => c.email).length,
    [data]
  );
  const enabledCount = useMemo(
    () => data.filter((c) => c.Habilitado).length,
    [data]
  );

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Clientes">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard title="Total" value={data.length} icon={Users} variant="primary" />
        <KPICard title="Habilitados" value={enabledCount} icon={UserCheck} variant="success" />
        <KPICard title="Deshabilitados" value={data.length - enabledCount} icon={Ban} variant="warning" />
        <KPICard title="Con email" value={withEmail} icon={Mail} variant="info" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Buscar por código, nombre, apellido, DNI o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <AddButton navigateTo="/clientes/agregar" label="Nuevo cliente" />
      </div>

      {filtered.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeaderData className="w-10">#</TableHeaderData>
              <TableHeaderData>Código</TableHeaderData>
              <TableHeaderData>Nombre</TableHeaderData>
              <TableHeaderData>DNI</TableHeaderData>
              <TableHeaderData>Teléfono</TableHeaderData>
              <TableHeaderData className="hidden md:table-cell">Email</TableHeaderData>
              <TableHeaderData className="text-center">Estado</TableHeaderData>
              <TableHeaderData className="text-center">Acciones</TableHeaderData>
            </TableHead>
            <TableBody>
              {filtered.map((client, i) => (
                <TableRow key={client.ID_CLIENTE}>
                  <TableData>{i + 1}</TableData>
                  <TableData className="font-mono text-sm uppercase">
                    {client.COD_CLIENTE || "—"}
                  </TableData>
                  <TableData className="font-medium">
                    {client.name} {client.lastName}
                  </TableData>
                  <TableData className="tabular-nums">{client.dni ?? "—"}</TableData>
                  <TableData>{client.phoneNumber || "—"}</TableData>
                  <TableData className="hidden md:table-cell text-muted-foreground">
                    {client.email || "—"}
                  </TableData>
                  <TableData className="text-center">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        client.Habilitado
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {client.Habilitado ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </TableData>
                  <TableData className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/clientes/editar/${client.ID_CLIENTE}`)}
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      Editar
                    </Button>
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <Users className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">
            {search ? "No hay clientes con esa búsqueda" : "Aún no hay clientes"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Probá con otro término." : "Agregá el primer cliente para comenzar."}
          </p>
          {!search && (
            <div className="mt-4">
              <AddButton navigateTo="/clientes/agregar" label="Nuevo cliente" />
            </div>
          )}
        </div>
      )}
    </CategoryLayout>
  );
}
