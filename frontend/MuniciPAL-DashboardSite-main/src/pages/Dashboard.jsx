import { useMemo, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import TicketCard from "../Components/TicketCard";

/**
 * Dashboard is now the main Tickets Board (Pending / In Progress / Closed).
 * Replace the mocked `initialTickets` with data from your API when ready.
 */
const initialTickets = [
  { id: 1, title: "Fix login bug", status: "Pending" },
  { id: 2, title: "Update docs", status: "In Progress" },
  { id: 3, title: "Add dark mode", status: "Closed" },
];

const STATUSES = ["Pending", "In Progress", "Closed"];

export default function Dashboard() {
  const [tickets] = useState(initialTickets);

  // "Open" = anything not Closed
  const openCount = useMemo(
    () => tickets.filter(t => t.status !== "Closed").length,
    [tickets]
  );

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Right column: Topbar + Board */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Global topbar with open ticket count */}
        <Topbar openCount={openCount} />

        {/* Board */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <section key={status} className="bg-white border rounded-lg p-3">
                <h2 className="font-bold text-center mb-2">{status}</h2>

                {tickets
                  .filter((t) => t.status === status)
                  .map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}

                {/* Empty state per column */}
                {tickets.filter((t) => t.status === status).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No tickets in {status.toLowerCase()}.
                  </p>
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
