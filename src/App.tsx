import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Route, Routes } from "react-router-dom";
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
import { Toaster } from "react-hot-toast";

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
                <Route path="/reservas/reserva/agendar" element={<Booking />} />
                <Route
                  path="/reservas/reserva/:bookingId"
                  element={<Booking />}
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
