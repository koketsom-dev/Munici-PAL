import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Pencil, User, Trash2, Check } from "lucide-react";

export default function Admin() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cell: "",
    empCode: "",
    ticketTypes: [],
    status: "Active",
    role: "Employee",
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("employees") || "[]");
    setEmployees(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      const onlyLetters = value.replace(/[0-9]/g, "");
      setForm({ ...form, [name]: onlyLetters });
      return;
    }

    if (name === "cell") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");
      setForm({ ...form, [name]: onlyNumbers });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleTicketType = (type) => {
    setForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.includes(type)
        ? prev.ticketTypes.filter((t) => t !== type)
        : [...prev.ticketTypes, type],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.cell || !form.empCode) {
      alert("Please fill in all required fields.");
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.fullName)) {
      alert("Full name must contain only letters and spaces.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address (must include @).");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.cell)) {
      alert("Cell number must contain exactly 10 digits.");
      return;
    }

    if (isEditing !== null) {
      const updated = employees.map((emp, i) => (i === isEditing ? form : emp));
      setEmployees(updated);
      setIsEditing(null);
    } else {
      setEmployees([...employees, form]);
    }

    setForm({
      fullName: "",
      email: "",
      cell: "",
      empCode: "",
      ticketTypes: [],
      status: "Active",
      role: "Employee",
    });
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setForm(employees[index]);
    setIsEditing(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = employees.filter((_, i) => i !== deleteIndex);
      setEmployees(updated);
      setDeleteIndex(null);
      setShowDeleteModal(false);
    }
  };

  const ticketOptions = ["Water", "Electricity", "Roads", "Refuse"];

  const filteredEmployees = employees.filter((emp) =>
    `${emp.fullName} ${emp.empCode}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 h-12 pr-4">
          <h1 className="text-2xl font-bold">Employee Administration</h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search (Name, Surname, Emp Code)"
              className="border px-4 py-2 rounded w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={() => {
                setForm({
                  fullName: "",
                  email: "",
                  cell: "",
                  empCode: "",
                  ticketTypes: [],
                  status: "Active",
                  role: "Employee",
                });
                setIsEditing(null);
                setShowModal(true);
              }}
              className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              <User className="w-5 h-5 mr-2" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow-md">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Full Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Cell</th>
                <th className="border p-2">Emp Code</th>
                <th className="border p-2">Ticket Types</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={index}>
                  <td className="border p-2">{emp.fullName}</td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2">{emp.cell}</td>
                  <td className="border p-2">{emp.empCode}</td>
                  <td className="border p-2">
                    {emp.ticketTypes.length > 0 ? emp.ticketTypes.join(", ") : "—"}
                  </td>
                  <td className="border p-2">
                    <select
                      value={emp.status}
                      onChange={(e) => {
                        const updated = [...employees];
                        updated[index].status = e.target.value;
                        setEmployees(updated);
                        setUnsavedChanges((prev) => ({ ...prev, [index]: true }));
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option>Active</option>
                      <option>Banned</option>
                    </select>
                    <select
                      value={emp.role || "Employee"}
                      onChange={(e) => {
                        const updated = [...employees];
                        updated[index].role = e.target.value;
                        setEmployees(updated);
                        setUnsavedChanges((prev) => ({ ...prev, [index]: true }));
                      }}
                      className="border rounded px-2 py-1 ml-2"
                    >
                      <option>Employee</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>{" "}
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-blue-800"
                    >
                      <Trash2 size={16} />
                    </button>{" "}
                    {unsavedChanges[index] && (
                      <button
                        onClick={() => {
                          localStorage.setItem("employees", JSON.stringify(employees));
                          setUnsavedChanges((prev) => {
                            const newState = { ...prev };
                            delete newState[index];
                            return newState;
                          });
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Save changes"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-3">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-6 w-[600px] shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">
                  {isEditing !== null ? "Edit Employee" : "Add Employee"}
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
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full border px-3 py-2 rounded"
                  value={form.fullName}
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
                  name="cell"
                  placeholder="Cell Number (10 digits)"
                  className="w-full border px-3 py-2 rounded"
                  value={form.cell}
                  onChange={handleChange}
                  required
                  maxLength="10"
                />
                <input
                  name="empCode"
                  placeholder="Employee Code"
                  className="w-full border px-3 py-2 rounded"
                  value={form.empCode}
                  onChange={handleChange}
                  required
                />

                <div className="flex gap-3 flex-wrap">
                  {ticketOptions.map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={form.ticketTypes.includes(type)}
                        onChange={() => handleTicketType(type)}
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option>Active</option>
                  <option>Banned</option>
                </select>

                <select
                  name="role"
                  value={form.role || "Employee"}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option>Employee</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    {isEditing !== null ? "Update Employee" : "Add Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}