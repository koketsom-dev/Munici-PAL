import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Pencil, Plus, User } from "lucide-react";

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [alteredUsers, setAlteredUsers] = useState({});
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    status: "Active",
    role: "User",
    userId: "",
  });

  // Load users from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(saved);
  }, []);

  // Save users to localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.name || !form.surname || !form.email || !form.userId) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (isEditing !== null) {
      const updated = users.map((u, i) => (i === isEditing ? form : u));
      setUsers(updated);
      setIsEditing(null);
    } else {
      setUsers([...users, form]);
    }

    // Reset form
    setForm({
      name: "",
      surname: "",
      email: "",
      status: "Active",
      role: "User",
      userId: "",
    });
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setForm(users[index]);
    setIsEditing(index);
    setShowModal(true);
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.surname} ${u.userId}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 h-12 pr-4">
          <h1 className="text-2xl font-bold">User Administration</h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search (Name, Surname, User ID)"
              className="border px-4 py-2 rounded w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Styled like Employee button */}
            <button
              onClick={() => {
                setForm({
                  name: "",
                  surname: "",
                  email: "",
                  status: "Active",
                  userId: "",
                });
                setIsEditing(null);
                setShowModal(true);
              }}
              className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              <User className="w-5 h-5 mr-2" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded shadow-md">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Surname</th>
                <th className="border p-2">Email Address</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">User ID</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.surname}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">
                    <select
                      value={user.status}
                      onChange={(e) => {
                        const updated = [...users];
                        updated[index].status = e.target.value;
                        setUsers(updated);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option>Active</option>
                      <option>Banned</option>
                    </select>
                    {" "}
                    <select
                      value={user.status}
                      onChange={(e) => {
                        const updated = [...users];
                        updated[index].status = e.target.value;
                        setUsers(updated);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option>Active</option>
                      <option>Banned</option>
                    </select>
                  </td>
                  <td className="border p-2">{user.userId}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-3">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {isEditing !== null ? "Edit User" : "Add User"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
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
                  type="email"
                  placeholder="Email Address"
                  className="w-full border px-3 py-2 rounded"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  name="userId"
                  placeholder="User ID"
                  className="w-full border px-3 py-2 rounded"
                  value={form.userId}
                  onChange={handleChange}
                  required
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option>Active</option>
                  <option>Banned</option>
                </select>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    {isEditing !== null ? "Update User" : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}