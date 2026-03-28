import { useMemo } from "react";
import { Users, Wrench, DollarSign, Headphones } from "lucide-react";
import AddButton from "../components/AddButton";
import CategoryLayout from "../components/CategoryLayout";
import Spinner from "../components/Spinner";
import {
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableHeaderData,
  TableRow,
} from "../components/Table";
import TableButtons from "../components/TableButtons";
import { KPICard } from "../components/ui/KPICard";
import useGetPersonal from "../hooks/useGetPersonal";
import useDeletePersonal from "../hooks/useDeletePersonal";
import { formatCurrency } from "../utils/formatCurrency";
import { PersonaledProps } from "../types";

const roleLabels: Record<string, string> = {
  tecnico: "Técnico",
  sonidista: "Sonidista",
  iluminador: "Iluminador",
  chofer: "Chofer",
  coordinador: "Coordinador",
  otro: "Otro",
};

export default function HumandResource() {
  const { data, isLoading } = useGetPersonal();
  const { isDeleting, removePersonal } = useDeletePersonal();

  const totals = useMemo(() => {
    const staff = (data as PersonaledProps[]) ?? [];
    const avg =
      staff.length > 0
        ? staff.reduce((sum, p) => sum + (p.daily_rate ?? 0), 0) / staff.length
        : 0;
    return {
      total: staff.length,
      tecnicos: staff.filter((p) => p.role === "tecnico").length,
      sonidistas: staff.filter((p) => p.role === "sonidista").length,
      avgRate: avg,
    };
  }, [data]);

  if (isLoading) return <Spinner />;

  return (
    <CategoryLayout title="Personal">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KPICard
          title="Total"
          value={totals.total}
          icon={Users}
          variant="primary"
        />
        <KPICard
          title="Técnicos"
          value={totals.tecnicos}
          icon={Wrench}
          variant="info"
        />
        <KPICard
          title="Sonidistas"
          value={totals.sonidistas}
          icon={Headphones}
          variant="success"
        />
        <KPICard
          title="Tarifa promedio"
          value={`$${formatCurrency(totals.avgRate)}`}
          icon={DollarSign}
          variant="warning"
        />
      </div>

      <div className="flex justify-end">
        <AddButton navigateTo="/personal/agregar" label="Nuevo empleado" />
      </div>

      {(data as PersonaledProps[]).length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeaderData className="w-10">#</TableHeaderData>
              <TableHeaderData>Nombre</TableHeaderData>
              <TableHeaderData>Rol</TableHeaderData>
              <TableHeaderData className="hidden md:table-cell">
                Teléfono
              </TableHeaderData>
              <TableHeaderData className="hidden md:table-cell">
                DNI
              </TableHeaderData>
              <TableHeaderData>Tarifa/día</TableHeaderData>
              <TableHeaderData className="text-center">Acciones</TableHeaderData>
            </TableHead>
            <TableBody>
              {(data as PersonaledProps[]).map((person, index) => (
                <TableRow key={person.id}>
                  <TableData>{index + 1}</TableData>
                  <TableData className="font-medium">
                    {person.name} {person.lastName}
                  </TableData>
                  <TableData>
                    <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {roleLabels[person.role] ?? person.role}
                    </span>
                  </TableData>
                  <TableData className="hidden md:table-cell text-muted-foreground">
                    {person.phoneNumber ?? "—"}
                  </TableData>
                  <TableData className="hidden md:table-cell text-muted-foreground">
                    {person.dni ?? "—"}
                  </TableData>
                  <TableData className="font-medium tabular-nums">
                    ${formatCurrency(person.daily_rate)}
                  </TableData>
                  <TableData>
                    <TableButtons
                      id={person.id}
                      route="/personal/editar"
                      isDeleting={isDeleting}
                      onDelete={removePersonal}
                      deleteLabel="este empleado"
                    />
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
            No hay empleados registrados
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Agregá el primer empleado para comenzar.
          </p>
          <div className="mt-4">
            <AddButton navigateTo="/personal/agregar" label="Nuevo empleado" />
          </div>
        </div>
      )}
    </CategoryLayout>
  );
}
