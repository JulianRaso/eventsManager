import { Route, Routes } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import Layout from "./routes/Layout";
import Booking from "./routes/Booking";
import Profile from "./routes/Profile";
import AddBooking from "./components/AddBooking";
import PageNotFound from "./routes/PageNotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/reservas">
          <Route index element={<Booking />} />
          <Route path="/reservas/agendar" element={<AddBooking />} />
        </Route>

        <Route path="/personal" element={<Dashboard />} />
        <Route path="/sonido" element={<Dashboard />} />
        <Route path="/iluminacion" element={<Dashboard />} />
        <Route path="/ambientacion" element={<Dashboard />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
