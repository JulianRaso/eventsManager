import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Authentication from "./routes/Authentication";
import Bill from "./routes/Bill";
import Booking from "./routes/Booking";
import Bookings from "./routes/Bookings";
import Dashboard from "./routes/Dashboard";
import Equipment from "./routes/Equipment";
import HumandResource from "./routes/HumandResource";
import PersonalForm from "./routes/PersonalForm";
import Inventory from "./routes/Inventory";
import Layout from "./routes/Layout";
import Login from "./routes/Login";
import PageNotFound from "./routes/PageNotFound";
import Profile from "./routes/Profile";
import Transport from "./routes/Transport";
import Vehicle from "./routes/Vehicle";
import Invoice from "./routes/Invoice";
import ClientInvoice from "./routes/ClientInvoice";
import Presupuesto from "./routes/Presupuesto";
import ComingSoon from "./components/ComingSoon";
import Clientes from "./routes/Clientes";
import ClienteForm from "./routes/ClienteForm";
import CuentaCorrientes from "./routes/CuentaCorrientes";
import ArticulosVendidos from "./routes/ArticulosVendidos";
import ParametrizacionContable from "./routes/ParametrizacionContable";
import CuentasContables from "./routes/CuentasContables";
import AsientoTeorico from "./routes/AsientoTeorico";
import Proveedores from "./routes/Proveedores";
import OrdenCompra from "./routes/OrdenCompra";
import CompraDetalle from "./routes/CompraDetalle";
import CuentaProveedores from "./routes/CuentaProveedores";
import Ingresos from "./routes/Ingresos";
import Recaudacion from "./routes/Recaudacion";
import Caja from "./routes/Caja";
import EventoDetalle from "./routes/EventoDetalle";
import Disponibilidad from "./routes/Disponibilidad";

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
          <Route path="/disponibilidad" element={<Disponibilidad />} />

          {/* Ventas */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/agregar" element={<ClienteForm />} />
          <Route path="/clientes/editar/:dni" element={<ClienteForm />} />
          <Route path="/cuenta-corrientes" element={<CuentaCorrientes />} />
          <Route path="/articulos-vendidos" element={<ArticulosVendidos />} />
          <Route path="/personal" element={<HumandResource />} />
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
          <Route path="/resultado-economico" element={<ComingSoon title="Resultado Económico" />} />

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
