import CategoryLayout from "../components/CategoryLayout";
import BookingsStatus from "../components/charts/BookingsStatus";
import GainsChart from "../components/charts/GainsChart";
import MonthlySalesChart from "../components/charts/MonthlySalesChart";
import { MostEquipments } from "../components/charts/MostEquipments";
import SalesCompany from "../components/charts/SalesCompanys";

export default function Dashboard() {
  return (
    <CategoryLayout title="Dashboard">
      <SalesCompany />
      <div className="flex flex-wrap justify-around">
        <BookingsStatus />
        <MonthlySalesChart />
        <MostEquipments />
        <GainsChart />
      </div>
    </CategoryLayout>
  );
}
