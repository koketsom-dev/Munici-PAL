import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import ReportHeader from "../Components/ReportHeader";
import ReportTable from "../Components/ReportTable";
import { ticketAPI } from "../../../src/services/api";

const STATUS = ["Pending", "In Progress", "Resolved"];
const TYPES  = ["Electricity", "Water", "Roads", "Refuse"];

export default function Reports() {
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    type: "",
    from: "",
    to: "",
    owner: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.list({});
      
      if (response.success && response.data) {
        const formattedTickets = response.data.map(ticket => ({
          id: ticket.id || ticket.ticket_id,
          title: ticket.title || ticket.subject || 'Untitled Ticket',
          status: ticket.status || 'Pending',
          type: ticket.issue_type || 'N/A',
          createdAt: ticket.createdAt || ticket.date_created || new Date().toISOString().split('T')[0],
          ResolvedAt: ticket.completedAt || ticket.date_completed || ticket.resolved_at || '',
          owner: ticket.assignedTo || 'Unassigned'
        }));
        setAllTickets(formattedTickets);
      } else {
        setAllTickets([]);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setAllTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    const { q, status, type, from, to, owner } = filters;
    return allTickets.filter((t) => {
      const matchesQ =
        !q ||
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        String(t.id) === q;
      const matchesStatus = !status || t.status === status;
      const matchesType = !type || t.type === type;
      const matchesOwner = !owner || t.owner.toLowerCase().includes(owner.toLowerCase());
      const created = new Date(t.createdAt);
      const afterFrom = !from || created >= new Date(from);
      const beforeTo  = !to   || created <= new Date(to);
      return matchesQ && matchesStatus && matchesType && matchesOwner && afterFrom && beforeTo;
    });
  }, [filters, allTickets]);

  // Export CSV
  function exportCSV() {
    const headers = ["ID", "Title", "Status", "Type", "Owner", "Created"];
    const lines = rows.map((r) =>
      [r.id, r.title, r.status, r.type, r.owner, r.createdAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `municIPAL-report-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const openCount = rows.filter(r => r.status !== "Resolved").length;

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gray-50">
          <ReportHeader openCount={0} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <p className="text-gray-500">Loading reports...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <ReportHeader openCount={openCount} />

        <main className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Filters */}
          <div className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="Search title or #id"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
            <select
              className="border rounded px-2 py-1"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              title="From"
            />
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              title="To"
            />
          </div>

          {/* Secondary filters & actions */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="Owner (e.g. Sam)"
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={exportCSV}
            >
              Export CSV
            </button>
            <button
              className="px-3 py-1 rounded border"
              onClick={() => setFilters({ q: "", status: "", type: "", from: "", to: "", owner: "" })}
            >
              Reset
            </button>
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => navigate("/dashboard/graphs")}
            >
              Graphs
            </button>
          </div>

          {/* Results table */}
          <div className="bg-white border rounded-lg">
            <ReportTable rows={rows} />
          </div>
        </main>
      </div>
    </div>
  );
}
