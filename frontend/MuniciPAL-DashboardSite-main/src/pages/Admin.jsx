import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Pencil, Plus, User, Trash2, Check } from "lucide-react";
import { adminAPI, ticketAPI } from "../../../src/services/api";

export default function Admin() {
  const [employees, setEmployees] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cell: "",
    empCode: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchTickets();
  }, []);

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 3000);
  };

  const fetchEmployees = async () => {
    try {
      const response = await adminAPI.getEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await ticketAPI.list({});
      if (response.success && response.data) {
        setTickets(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      showPopup("Please fill in required fields.");
      return;
    }

    try {
      if (isEditing !== null) {
        // Update employee
        await adminAPI.updateEmployee(isEditing, {
          full_name: form.fullName,
          email: form.email,
          phone_number: form.cell,
          emp_code: form.empCode,
          password: form.password || undefined, // Only update if provided
        });
        showPopup("Employee updated successfully.");
      } else {
        // Add new employee
        if (!form.password) {
          showPopup("Password is required for new employees.");
          return;
        }
        await adminAPI.addEmployee({
          full_name: form.fullName,
          email: form.email,
          phone_number: form.cell,
          emp_code: form.empCode,
          password: form.password,
        });
        showPopup("Employee added successfully.");
      }
      fetchEmployees();
      setIsEditing(null);
      setShowModal(false);
      setForm({ fullName: "", email: "", cell: "", empCode: "", password: "" });
    } catch (err) {
      console.error('Failed to save employee:', err);
      showPopup('Failed to save employee. Please try again.');
    }
  };

  const handleEdit = (emp) => {
    setForm({
      fullName: emp.first_name + " " + emp.surname,
      email: emp.email,
      cell: emp.phone_number || "",
      empCode: emp.emp_code || "",
      password: "",
    });
    setIsEditing(emp.id);
    setShowModal(true);
  };

  const handleDelete = (empId) => {
    setDeleteIndex(empId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedEmployeeId) {
      showPopup('Please select both a ticket and an employee');
      return;
    }

    try {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(selectedEmployeeId));
      const employeeName = selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.surname}` : 'Employee';
      
      await ticketAPI.assign(selectedTicket.ticket_id, selectedEmployeeId);
      setShowAssignModal(false);
      setSelectedTicket(null);
      setSelectedEmployeeId('');
      await fetchTickets();
      showPopup(`You have assigned ticket #${selectedTicket.ticket_id} to ${employeeName}`);
    } catch (err) {
      console.error('Failed to assign ticket:', err);
      showPopup('Failed to assign ticket. Please try again.');
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.first_name} ${emp.surname} ${emp.emp_code}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.subject} ${ticket.ticket_id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Administration</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-4 py-2 rounded ${activeTab === "employees" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
            >
              Employees
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-2 rounded ${activeTab === "tickets" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
            >
              Tickets
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-4 py-2 rounded w-full max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {activeTab === "employees" && (
          <>
            <div className="mb-4">
              <button
                onClick={() => {
                  setForm({ fullName: "", email: "", cell: "", empCode: "" });
                  setIsEditing(null);
                  setShowModal(true);
                }}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Employee
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow-md">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Phone</th>
                    <th className="border p-2">Emp Code</th>
                    <th className="border p-2">Job Title</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">Loading...</td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-gray-500 p-4">No employees found.</td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td className="border p-2">{emp.first_name} {emp.surname}</td>
                        <td className="border p-2">{emp.email}</td>
                        <td className="border p-2">{emp.phone_number || "—"}</td>
                        <td className="border p-2">{emp.emp_code || "—"}</td>
                        <td className="border p-2">{emp.emp_job_title || "—"}</td>
                        <td className="border p-2">{emp.is_active ? "Active" : "Inactive"}</td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "tickets" && (
          <>
            <div className="overflow-x-auto bg-white rounded shadow-md">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Ticket ID</th>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Assigned To</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 p-4">No tickets found.</td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.ticket_id}>
                        <td className="border p-2">{ticket.ticket_id}</td>
                        <td className="border p-2">{ticket.subject}</td>
                        <td className="border p-2">{ticket.issue_type || "—"}</td>
                        <td className="border p-2">{ticket.status}</td>
                        <td className="border p-2">{ticket.emp_id ? "Assigned" : "Unassigned"}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowAssignModal(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition"
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Assign Ticket</h2>
              
              {selectedTicket && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <p className="text-sm"><strong>Ticket ID:</strong> {selectedTicket.ticket_id}</p>
                  <p className="text-sm"><strong>Subject:</strong> {selectedTicket.subject}</p>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Select Employee</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.surname} ({emp.emp_code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTicket(null);
                    setSelectedEmployeeId('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-lg font-bold mb-4">
                {isEditing ? "Edit Employee" : "Add Employee"}
              </h2>
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
                  placeholder="Phone Number"
                  className="w-full border px-3 py-2 rounded"
                  value={form.cell}
                  onChange={handleChange}
                />
                <input
                  name="empCode"
                  placeholder="Employee Code"
                  className="w-full border px-3 py-2 rounded"
                  value={form.empCode}
                  onChange={handleChange}
                />
                <input
                  name="password"
                  type="password"
                  placeholder={isEditing ? "New Password (leave blank to keep current)" : "Password"}
                  className="w-full border px-3 py-2 rounded"
                  value={form.password}
                  onChange={handleChange}
                  required={!isEditing}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this employee?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {popupVisible && (
          <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
}
