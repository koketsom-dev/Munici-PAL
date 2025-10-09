import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import TicketCard from "../Components/TicketCard";

//time submitted
function Tickets() {
  const [tickets] = useState([
    { id: 4, title: "Fix login bug", status: "Pending", location: "Edenvale" },
    { id: 2, title: "Update docs", status: "In Progress" },
    { id: 3, title: "Add dark mode", status: "Closed" },
    { id: 1, title: "Improve ticket page", status: "In Progress" },
    { id: 5, title: "Update docs", status: "In Progress" },
    { id: 6, title: "Add dark mode", status: "Closed" },
    { id: 7, title: "Improve ticket page", status: "In Progress" },
  ]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border rounded-lg bg-white shadow p-4"
            >
              <h2
                className={`text-sm font-semibold mb-2 ${
                  ticket.status === "Pending"
                    ? "text-yellow-600"
                    : ticket.status === "In Progress"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {ticket.status}
              </h2>

              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Tickets;
