import React from "react";

export default function ResolvedPopup({ ticket, onConfirm, onCancel }) {
    if (!ticket) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
                <h2 className="text-lg font-semibold text-black mb-4">
                    You are about to mark ticket {ticket.id} as Resolved.
                </h2>

                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}