import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Reports from "./pages/Reports"; // NEW
import DetailedTickets from "./pages/DetailedTickets";
import Admin from "./pages/Admin";
import UserAdmin from "./pages/UserAdmin";
import Graphs from "./pages/Graphs";
import { userAPI } from "../../src/services/api";

export default function App() {
  const currentUser = userAPI.getCurrentUser();
  const isAdmin = (currentUser?.access_level || "").toLowerCase() === "admin";

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/tickets/:id" element={<DetailedTickets />} />
      <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" replace />} />
      <Route path="/user-admin" element={isAdmin ? <UserAdmin /> : <Navigate to="/" replace />} />
      <Route path="/graphs" element={<Graphs />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}