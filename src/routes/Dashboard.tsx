import {
  CalendarCheck,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import BookingsStatus from "../components/charts/BookingsStatus";
import GainsChart from "../components/charts/GainsChart";
import { MostEquipments } from "../components/charts/MostEquipments";
import SalesCompany from "../components/charts/SalesCompanys";
import { KPICard } from "../components/ui/KPICard";
import useGetMonthlyEventsStatus from "../hooks/useGetMonthlyEventsStatus";
import useGetIncomesPerMonth from "../hooks/useGetIncomesPerMonth";
import useGetCurrentMonthNet from "../hooks/useGetCurrentMonthNet";
import useClientBalances from "../hooks/useClientBalances";

export default function Dashboard() {
  const { data: eventsData } = useGetMonthlyEventsStatus();
  const { data: incomesData } = useGetIncomesPerMonth();
  const { data: netData } = useGetCurrentMonthNet();
  const { clients } = useClientBalances();

  // Calcular total de eventos del mes
  const totalEvents =
    eventsData?.reduce(
      (acc: number, item: { total: number }) => acc + item.total,
      0
    ) || 0;

  // Obtener ingresos del mes actual
  const currentMonthIncome = incomesData?.[incomesData.length - 1]?.income || 0;
  const currentMonthCosts = netData?.costs ?? 0;
  const totalAccountsReceivable =
    clients?.reduce((s, c) => s + (c.saldo ?? 0), 0) ?? 0;

  return (
    <div className="flex min-h-full w-full flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7 xl:px-10">
      {/* Header */}
      <section className="mb-6 lg:mb-7">
        <DashboardHeader />
      </section>

      {/* KPI Cards */}
      <section className="mb-6 lg:mb-7" aria-labelledby="resumen-heading">
        <h2
          id="resumen-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:mb-3"
        >
          Resumen
        </h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          <KPICard
            title="Total Eventos"
            value={totalEvents}
            icon={CalendarCheck}
            variant="primary"
            description="Este mes"
          />
          <KPICard
            title="Ingresos del Mes"
            value={`$${currentMonthIncome.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
          />
          <KPICard
            title="Costos del Mes"
            value={`$${currentMonthCosts.toLocaleString()}`}
            icon={Package}
            variant="info"
            description="Costos asociados a eventos"
          />
          <KPICard
            title="Cuenta Corriente"
            value={`$${totalAccountsReceivable.toLocaleString()}`}
            icon={TrendingUp}
            variant="warning"
          />
        </div>
      </section>

      {/* Main Chart */}
      <section className="mb-6 lg:mb-7">
        <SalesCompany />
      </section>

      {/* Secondary Charts */}
      <section className="flex-1" aria-labelledby="metricas-heading">
        <h2
          id="metricas-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground lg:mb-4"
        >
          Métricas
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          <BookingsStatus />
          <GainsChart />
          <MostEquipments />
        </div>
      </section>
    </div>
  );
}
