import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Reports from "./pages/Reports"; // NEW
import DetailedTickets from "./pages/DetailedTickets";
import Admin from "./pages/Admin";
import UserAdmin from "./pages/UserAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/reports" element={<Reports />} /> {/* NEW */}
      <Route path="/tickets/:id" element={<DetailedTickets />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/user-admin" element={<UserAdmin />} />
    </Routes>
  );
}