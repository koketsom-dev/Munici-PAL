import React from "react";

export default function AssignmentPopup({ message, type, onClose }) {
  if (!message) return null;
  
  const isSuccess = type === "success";
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg text-center w-96 border-l-4 ${isSuccess ? "border-green-500" : "border-red-500"}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </h2>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded text-white transition ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
