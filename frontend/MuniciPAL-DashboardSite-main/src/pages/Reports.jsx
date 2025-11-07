import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Sidebar from "../Components/Sidebar";
import ReportHeader from "../Components/ReportHeader";
import ReportTable from "../Components/ReportTable"; // NEW table component



// Mock data. Replace with API data later.
const ALL_TICKETS = [
  { id: 1, title: "Fix login bug", status: "Pending", type: "Bug", createdAt: "2025-01-03", ResolvedAt: "2025-01-04", owner: "Sam" },
  { id: 2, title: "Update docs",   status: "In Progress", type: "Task", createdAt: "2025-02-10", ResolvedAt: "2025-02-14", owner: "Alex" },
  { id: 3, title: "Add dark mode", status: "Resolved", type: "Feature", createdAt: "2025-02-16", ResolvedAt: "2025-02-18", owner: "Mik" },
];

const STATUS = ["Pending", "In Progress", "Resolved"];
const TYPES  = ["Bug", "Task", "Feature"];

export default function Reports() {
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    type: "",
    from: "",
    to: "",
    owner: "",
  });

  const navigate = useNavigate();

  // Filter logic (runs on every change)
  const rows = useMemo(() => {
    const { q, status, type, from, to, owner } = filters;
    return ALL_TICKETS.filter((t) => {
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
  }, [filters]);

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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <ReportHeader openCount={openCount} />

        <main className="p-6 space-y-4">

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
              onClick={() => navigate("/graphs")}
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
