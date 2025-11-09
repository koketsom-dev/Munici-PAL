import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import TicketCard from "../Components/TicketCard";
import { ticketAPI } from "../../../src/services/api";

//time submitted
function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleTickets, setVisibleTickets] = useState([]);
  const [page, setPage] = useState(1);
  const ticketsPerPage = 24;

  const containerRef = useRef(null);
  const loadMoreRef = useRef(null);

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
          location: ticket.location || 'N/A',
          createdAt: ticket.createdAt || ticket.date_created || ticket.created_at,
          description: ticket.description
        }));
        setTickets(formattedTickets);
        setVisibleTickets(formattedTickets.slice(0, ticketsPerPage));
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

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
      <main className="flex-1 p-6 flex flex-col bg-white">
        <Header />

        <div
          ref={containerRef}
          className="pb-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
        >
          {loading && (
            <div className="col-span-full flex justify-center items-center h-64">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          )}
          {!loading && visibleTickets.length === 0 && (
            <div className="col-span-full flex justify-center items-center h-64">
              <p className="text-gray-500">No tickets found.</p>
            </div>
          )}
          {visibleTickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/dashboard/tickets/${ticket.id}`}
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
