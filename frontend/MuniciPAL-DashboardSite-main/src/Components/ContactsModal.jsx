import { useState, useEffect } from "react";

export default function ContactsModal({ onClose }) {
  const [tab, setTab] = useState("add");
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "" });
  const [contacts, setContacts] = useState([]);

  // Load saved contacts from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("contacts") || "[]");
    setContacts(saved);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    const newContact = { ...form, id: Date.now() };
    const updated = [...contacts, newContact];
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
    setForm({ name: "", surname: "", email: "", phone: "" });
    alert("Contact saved successfully!");
  };

  const handleDelete = (id) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Contacts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 ${tab === "add" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
            onClick={() => setTab("add")}
          >
            Add Contact
          </button>
          <button
            className={`flex-1 py-2 ${tab === "saved" ? "border-b-2 border-blue-600 font-semibold" : ""}`}
            onClick={() => setTab("saved")}
          >
            Saved Contacts
          </button>
        </div>

        {/* Add Contact Form */}
        {tab === "add" && (
          <form onSubmit={handleSave} className="space-y-3">
            <input
              name="name"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="surname"
              placeholder="Surname"
              className="w-full border px-3 py-2 rounded"
              value={form.surname}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              type="tel"
              className="w-full border px-3 py-2 rounded"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Save Contact
              </button>
            </div>
          </form>
        )}

        {/* Saved Contacts Table */}
        {tab === "saved" && (
          <div className="overflow-x-auto">
            {contacts.length === 0 ? (
              <p className="text-gray-600 text-sm">No contacts saved yet.</p>
            ) : (
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Surname</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.surname}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
