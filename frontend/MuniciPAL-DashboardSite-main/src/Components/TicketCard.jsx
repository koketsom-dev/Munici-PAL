function TicketCard({ ticket }) {
  const color =
    ticket.status === "Pending"
      ? "bg-red-100"
      : ticket.status === "In Progress"
      ? "bg-yellow-100"
      : "bg-green-100"

      //time submitted
  return (
    <div className={`p-3 mb-2 border rounded ${color}`}>
      <div className="flex justify-between">
        <p className="font-semibold">{ticket.title}</p>
        {ticket.id && <span className="text-gray-600">Ticket ID: {ticket.id}</span>}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Location: {ticket.location}</span>
      </div>
    </div>
  );
}

export default TicketCard;
