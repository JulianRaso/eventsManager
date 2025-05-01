import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Authentication from "./routes/Authentication";
import Booking from "./routes/Booking";
import Bookings from "./routes/Bookings";
import Dashboard from "./routes/Dashboard";
import Equipment from "./routes/Equipment";
import HumandResource from "./routes/HumandResource";
import Invetory from "./routes/Inventory";
import Layout from "./routes/Layout";
import Login from "./routes/Login";
import PageNotFound from "./routes/PageNotFound";
import Profile from "./routes/Profile";
import Transport from "./routes/Transport";
import Vehicle from "./routes/Vehicle";

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
      <ReactQueryDevtools initialIsOpen={false} />
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

          <Route path="/personal" element={<HumandResource />} />

          <Route path="/inventario">
            <Route index element={<Invetory />} />
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
