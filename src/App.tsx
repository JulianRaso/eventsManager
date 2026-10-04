import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Authentication from "./routes/Authentication";
import Dashboard from "./routes/Dashboard";
import Layout from "./routes/Layout";
import Login from "./routes/Login";
import PageNotFound from "./routes/PageNotFound";
import Profile from "./routes/Profile";
import ComingSoon from "./components/ComingSoon";

// Ventas
import Booking from "./routes/sells/Booking";
import Bookings from "./routes/sells/Bookings";
import ClientInvoice from "./routes/sells/ClientInvoice";
import Presupuesto from "./routes/sells/Presupuesto";
import Clientes from "./routes/sells/Clientes";
import ClienteForm from "./routes/sells/ClienteForm";
import CuentaCorrientes from "./routes/sells/CuentaCorrientes";
import ArticulosVendidos from "./routes/sells/ArticulosVendidos";
import EventoDetalle from "./routes/sells/EventoDetalle";
import HumandResource from "./routes/sells/HumandResource";
import PersonalReport from "./routes/sells/PersonalReport";
import PersonalReportDetail from "./routes/sells/PersonalReportDetail";
import PersonalForm from "./routes/sells/PersonalForm";
import PersonalRoles from "./routes/sells/PersonalRoles";

// Compras
import Proveedores from "./routes/buys/Proveedores";
import OrdenCompra from "./routes/buys/OrdenCompra";
import CompraDetalle from "./routes/buys/CompraDetalle";
import CuentaProveedores from "./routes/buys/CuentaProveedores";

// Stock
import Inventory from "./routes/stock/Inventory";
import Equipment from "./routes/stock/Equipment";
import Disponibilidad from "./routes/stock/Disponibilidad";
import ParametrizacionContable from "./routes/stock/ParametrizacionContable";

// Tesorería
import Ingresos from "./routes/treasury/Ingresos";
import Recaudacion from "./routes/treasury/Recaudacion";
import Caja from "./routes/treasury/Caja";
import Bill from "./routes/treasury/Bill";
import Invoice from "./routes/treasury/Invoice";

// Contabilidad
import CuentasContables from "./routes/accounting/CuentasContables";
import AsientoTeorico from "./routes/accounting/AsientoTeorico";

// Activo fijo
import Transport from "./routes/assets/Transport";
import Vehicle from "./routes/assets/Vehicle";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <Routes>
        <Route
          path="/"
          element={
            <Authentication>
              <Layout />
            </Authentication>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/reservas">
            <Route index element={<Bookings />} />
            <Route path="/reservas/reserva" element={<Booking />}>
              <Route
                path="/reservas/reserva/:bookingId"
                element={<Booking />}
              />

              <Route
                path="/reservas/reserva/:bookingId/client/:clientId"
                element={<Booking />}
              />
              <Route path="/reservas/reserva/agendar" element={<Booking />} />
            </Route>
          </Route>

          <Route path="/recibo/:invoiceID" element={<ClientInvoice />} />
          <Route path="/presupuesto/:bookingId" element={<Presupuesto />} />
          <Route path="/evento/:bookingId" element={<EventoDetalle />} />
          <Route path="/evento/:bookingId/editar" element={<EventoDetalle />} />
          <Route path="/disponibilidad" element={<Disponibilidad />} />

          {/* Ventas */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/agregar" element={<ClienteForm />} />
          <Route path="/clientes/editar/:clientId" element={<ClienteForm />} />
          <Route path="/cuenta-corrientes" element={<CuentaCorrientes />} />
          <Route path="/articulos-vendidos" element={<ArticulosVendidos />} />
          <Route path="/personal" element={<HumandResource />} />
          <Route path="/reporte-personal" element={<PersonalReport />} />
          <Route path="/reporte-personal/:personalId" element={<PersonalReportDetail />} />
          <Route path="/personal/roles" element={<PersonalRoles />} />
          <Route path="/personal/agregar" element={<PersonalForm />} />
          <Route path="/personal/editar/:personalId" element={<PersonalForm />} />

          {/* Compras */}
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/compras" element={<OrdenCompra />} />
          <Route path="/compras/:id" element={<CompraDetalle />} />
          <Route path="/cuenta-proveedores" element={<CuentaProveedores />} />

          {/* Stock */}
          <Route path="/parametrizacion-contable" element={<ParametrizacionContable />} />
          <Route path="/informe-uso" element={<ComingSoon title="Informe de uso" />} />

          {/* Contabilidad */}
          <Route path="/cuentas-contables" element={<CuentasContables />} />
          <Route path="/asiento-teorico" element={<AsientoTeorico />} />
          {/* <Route path="/resultado-economico" element={<ComingSoon title="Resultado Económico" />} /> */}

          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/recaudacion" element={<Recaudacion />} />
          <Route path="/caja" element={<Caja />} />

          <Route path="/gastos" element={<Bill />} />

          <Route path="/gastos">
            <Route index element={<Bill />} />
            <Route path="/gastos/agregar" element={<Invoice />} />
            <Route path="/gastos/editar/:billId" element={<Invoice />} />
          </Route>

          <Route path="/inventario">
            <Route index element={<Inventory />} />
            <Route path="/inventario/agregar" element={<Equipment />} />
            <Route path="/inventario/editar/:stockId" element={<Equipment />} />
          </Route>

          <Route path="/transporte">
            <Route index element={<Transport />} />
            <Route path="/transporte/agregar" element={<Vehicle />} />
            <Route path="/transporte/editar/:vehicleId" element={<Vehicle />} />
          </Route>

          <Route path="/configuracion" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "lightgray",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
