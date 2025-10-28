import { useState } from "react";

export default function LeaveCalendarModal({ onClose }) {
  const [entries, setEntries] = useState([
    { type: "Day off", startDate: "", endDate: "", checkingIn: "Yes", standIn: "" },
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addNewEntry = () => {
    setEntries([...entries, { type: "", startDate: "", endDate: "", checkingIn: "Yes", standIn: "" }]);
  };

  const deleteEntry = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  const handleSave = () => {
    if (entries.some((e) => !e.type || !e.startDate || !e.endDate)) {
      alert("Please fill in all required fields before saving.");
      return;
    }
    localStorage.setItem("leaveEntries", JSON.stringify(entries));
    alert("Leave entries saved successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
      <div className="bg-white rounded-lg p-6 w-[850px] max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">🗓️ Upcoming Time Off</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">✕</button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-2 font-semibold text-sm border-b pb-2 mb-2">
          <div>Type</div>
          <div>First Day Off</div>
          <div>Back at Work</div>
          <div>Checking In?</div>
          <div>Stand-In Email</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {entries.map((entry, index) => (
          <div key={index} className="grid grid-cols-6 gap-2 items-center text-sm mb-2">
            <select
              value={entry.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
              className="border px-2 py-1 rounded"
              required
            >
              <option value="">Please select</option>
              <option>Day off</option>
              <option>Sick leave</option>
              <option>Unpaid leave</option>
              <option>Study leave</option>
            </select>

            <input
              type="date"
              value={entry.startDate}
              onChange={(e) => handleChange(index, "startDate", e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />

            <input
              type="date"
              value={entry.endDate}
              onChange={(e) => handleChange(index, "endDate", e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />

            <select
              value={entry.checkingIn}
              onChange={(e) => handleChange(index, "checkingIn", e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option>Yes</option>
              <option>No</option>
            </select>

            <input
              type="email"
              placeholder="standin@example.com"
              value={entry.standIn}
              onChange={(e) => handleChange(index, "standIn", e.target.value)}
              className="border px-2 py-1 rounded"
            />

            <div className="flex justify-center gap-2">
              <button
                onClick={() => deleteEntry(index)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                🗑️
              </button>
              <button
                onClick={addNewEntry}
                className="text-blue-600 hover:text-blue-800"
                title="Add new"
              >
                ➕
              </button>
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save All
          </button>
        </div>
      </div>
    </div>
  );
}
