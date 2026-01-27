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
import useGetMostUsedEquipment from "../hooks/useGetMostUsedEquipment";

export default function Dashboard() {
  const { data: eventsData } = useGetMonthlyEventsStatus();
  const { data: incomesData } = useGetIncomesPerMonth();
  const { data: equipmentData } = useGetMostUsedEquipment();

  // Calcular total de eventos del mes
  const totalEvents =
    eventsData?.reduce(
      (acc: number, item: { total: number }) => acc + item.total,
      0
    ) || 0;

  // Calcular eventos confirmados para la tasa
  const confirmedEvents =
    eventsData?.find(
      (item: { booking_status: string }) => item.booking_status === "confirm"
    )?.total || 0;
  const confirmationRate =
    totalEvents > 0 ? Math.round((confirmedEvents / totalEvents) * 100) : 0;

  // Obtener ingresos del mes actual
  const currentMonthIncome = incomesData?.[incomesData.length - 1]?.income || 0;

  // Obtener total de equipos alquilados
  const totalEquipmentRented =
    equipmentData?.reduce(
      (acc: number, item: { total: number }) => acc + item.total,
      0
    ) || 0;

  return (
    <div className="flex min-h-full w-full flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
      {/* Header */}
      <section className="mb-8 lg:mb-10">
        <DashboardHeader />
      </section>

      {/* KPI Cards */}
      <section className="mb-8 lg:mb-10" aria-labelledby="resumen-heading">
        <h2
          id="resumen-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground lg:mb-5"
        >
          Resumen
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <KPICard
            title="Total Eventos"
            value={totalEvents}
            icon={CalendarCheck}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
            description="Este mes"
          />
          <KPICard
            title="Ingresos del Mes"
            value={`$${currentMonthIncome.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Equipos Alquilados"
            value={totalEquipmentRented}
            icon={Package}
            variant="info"
            description="Total del período"
          />
          <KPICard
            title="Tasa de Confirmación"
            value={`${confirmationRate}%`}
            icon={TrendingUp}
            variant="warning"
            trend={{
              value: 5,
              isPositive: confirmationRate >= 50,
            }}
          />
        </div>
      </section>

      {/* Main Chart */}
      <section className="mb-8 lg:mb-10">
        <SalesCompany />
      </section>

      {/* Secondary Charts */}
      <section className="flex-1" aria-labelledby="metricas-heading">
        <h2
          id="metricas-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground lg:mb-5"
        >
          Métricas
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <BookingsStatus />
          <GainsChart />
          <MostEquipments />
        </div>
      </section>
    </div>
  );
}
