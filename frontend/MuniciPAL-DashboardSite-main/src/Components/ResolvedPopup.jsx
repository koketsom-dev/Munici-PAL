import React, { useState, useEffect } from "react";

export default function ResolvedPopup({ ticket, onConfirm, onCancel, reasons = [] }) {
  const [resolutionReason, setResolutionReason] = useState("");
  const [filteredReasons, setFilteredReasons] = useState([]);

  // Filter reasons if needed based on ticket.category (optional)
useEffect(() => {
  if (ticket && reasons) {
    setFilteredReasons(reasons[ticket.category] || []);
  }
}, [ticket, reasons]);


  if (!ticket) return null;

  const handleConfirm = () => {
    if (!resolutionReason) {
      alert("Please select a resolution reason.");
      return;
    }
    onConfirm(resolutionReason);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-black mb-4">
          You are about to mark ticket {ticket.id} as Resolved.
        </h2>

        <p className="text-sm text-gray-600 mb-3">
          Ticket Category: <strong>{ticket.category}</strong>
        </p>

        <select
          value={resolutionReason}
          onChange={(e) => setResolutionReason(e.target.value)}
          className="border w-full p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Choose a reason --</option>
          {filteredReasons.map((reason, i) => (
            <option key={i} value={reason}>{reason}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
