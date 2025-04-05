import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Routes } from "react-router-dom";
import ClientBooking from "./components/Booking/ClientBooking";
import EventBooking from "./components/Booking/EventBooking";
import Booking from "./routes/Booking";
import Bookings from "./routes/Bookings";
import Dashboard from "./routes/Dashboard";
import Decoration from "./routes/Decoration";
import HumandResource from "./routes/HumandResource";
import Layout from "./routes/Layout";
import Lightning from "./routes/Lightning";
import PageNotFound from "./routes/PageNotFound";
import Profile from "./routes/Profile";
import Sound from "./routes/Sound";
import Authentication from "./routes/Authentication";
import { useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2000,
    },
  },
});

function App() {
  const [auth, setAuth] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Authentication auth={auth} setAuth={setAuth}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/reservas">
              <Route index element={<Bookings />} />
              <Route path="/reservas/reserva" element={<Booking />}>
                <Route
                  path="/reservas/reserva/agendar"
                  element={<ClientBooking />}
                />
                <Route
                  path="/reservas/reserva/agendar/evento"
                  element={<EventBooking />}
                />
              </Route>
            </Route>

            <Route path="/personal" element={<HumandResource />} />

            <Route path="/sonido" element={<Sound />} />

            <Route path="/iluminacion" element={<Lightning />} />

            <Route path="/ambientacion" element={<Decoration />} />

            <Route path="/perfil" element={<Profile />} />
            <Route path="/*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Authentication>
    </QueryClientProvider>
  );
}

export default App;
