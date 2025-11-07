import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import TicketCard from "../Components/TicketCard";

//time submitted
function Tickets() {
  const [tickets] = useState([
    { id: 4, title: "Fix login bug", status: "Pending", location: "Edenvale" },
    { id: 2, title: "Update docs", status: "In Progress" },
    { id: 3, title: "Add dark mode", status: "Resolved" },
    { id: 1, title: "Improve ticket page", status: "In Progress" },
    { id: 5, title: "Update docs", status: "In Progress" },
    { id: 6, title: "Add dark mode", status: "Resolved" },
    { id: 7, title: "Improve ticket page", status: "In Progress" },
  ]);

  const [visibleTickets, setVisibleTickets] = useState([]);
  const [page, setPage] = useState(1);
  const ticketsPerPage = 24;

  const containerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setVisibleTickets(tickets.slice(0, ticketsPerPage));
  }, [tickets]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreTickets();
        }
      },
      {
        root: containerRef.current,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [visibleTickets]);

  const loadMoreTickets = () => {
    const nextTickets = tickets.slice(0, (page + 1) * ticketsPerPage);
    if (nextTickets.length > visibleTickets.length) {
      setVisibleTickets(nextTickets);
      setPage(page + 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-500";
      case "In Progress":
        return "text-yellow-500";
      case "Resolved":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 flex flex-col">
        <Header />

        <div
          ref={containerRef}
          className="pb-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
        >

          {visibleTickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="border rounded-lg bg-white shadow p-4"
            >
              <h2 className={`text-sm font-semibold mb-2 ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </h2>

              <TicketCard ticket={ticket} />
            </Link>
          ))}
          <div ref={loadMoreRef} />
        </div>
      </main>
    </div>
  );
}

export default Tickets;
