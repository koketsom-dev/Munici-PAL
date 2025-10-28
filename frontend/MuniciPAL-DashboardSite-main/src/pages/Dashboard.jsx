import { useMemo, useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import ContactsModal from "../Components/ContactsModal";
import LeaveCalendarModal from "../Components/LeaveCalendarModal";
import { Ticket } from "lucide-react";

const STATUSES = ["Pending", "In Progress", "Closed"];

export default function Dashboard() {
  const [tickets, setTickets] = useState([
    { id: 1, title: "Fix login bug", status: "Pending" },
    { id: 2, title: "Update docs", status: "In Progress" },
    { id: 3, title: "Add dark mode", status: "Closed" },
  ]);

  const [showContacts, setShowContacts] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  // ✅ Live updating open tickets
  useEffect(() => {
    const count = tickets.filter((t) => t.status !== "Closed").length;
    setOpenCount(count);
  }, [tickets]);

  // ✅ Update ticket status directly from dropdown
  const handleStatusChange = (id, newStatus) => {
    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    );
    setTickets(updated);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Topbar */}
        <Topbar
          username="Mikhaar"
          onOpenContacts={() => setShowContacts(true)}
          onOpenCalendar={() => setShowCalendar(true)}
        />

        {/* ✅ Styled Open Tickets Box */}
        <div className="flex justify-end mt-4 mr-6">
          <button className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition shadow">
            <Ticket className="w-5 h-5 mr-2" />
            <span className="font-semibold">Open Tickets: {openCount}</span>
          </button>
        </div>

        {/* Tickets Board */}
        <main className="flex-1 p-6 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <section key={status} className="bg-white border rounded-lg p-3">
                <h2 className="font-bold text-center mb-2">{status}</h2>

                {tickets
                  .filter((t) => t.status === status)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-3 rounded border mb-2 ${
                        ticket.status === "Pending"
                          ? "bg-red-100"
                          : ticket.status === "In Progress"
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{ticket.title}</h3>
                          <p className="text-xs text-gray-500">
                            Ticket ID: {ticket.id}
                          </p>
                        </div>

                        {/* ✅ Status dropdown per ticket */}
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white cursor-pointer"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                {/* Optional message if empty */}
                {tickets.filter((t) => t.status === status).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No tickets in {status.toLowerCase()}.
                  </p>
                )}
              </section>
            ))}
          </div>
        </main>

        {/* Modals */}
        {showContacts && (
          <ContactsModal onClose={() => setShowContacts(false)} />
        )}
        {showCalendar && (
          <LeaveCalendarModal onClose={() => setShowCalendar(false)} />
        )}
      </div>
    </div>
  );
}