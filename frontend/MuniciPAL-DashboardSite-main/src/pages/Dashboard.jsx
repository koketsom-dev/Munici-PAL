import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import ContactsModal from "../Components/ContactsModal";
import LeaveCalendarModal from "../Components/LeaveCalendarModal";
import UserDetailsModal from "../Components/UserDetailsModal";
import { Ticket } from "lucide-react";
import ResolvedPopup from "../Components/ResolvedPopup";
import AssignmentPopup from "../Components/AssignmentPopup";
import { ticketAPI, adminAPI, userAPI, authAPI, notificationAPI } from "../../../src/services/api";

const STATUSES = ["Pending", "In Progress", "Resolved"];
const Board = ["Pending", "In Progress"];

const normalizeStatus = (status) => {
  if (!status) {
    return "Pending";
  }
  const formatted = String(status).trim().toLowerCase().replace(/[_-]+/g, " ");
  if (formatted === "resolved") {
    return "Resolved";
  }
  if (formatted === "in progress") {
    return "In Progress";
  }
  if (formatted === "pending") {
    return "Pending";
  }
  return "Pending";
};

export default function Dashboard() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCount, setOpenCount] = useState(0);
  const [showContacts, setShowContacts] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showResolvedPopup, setShowResolvedPopup] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicketForAssignment, setSelectedTicketForAssignment] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [resolvedTicketIds, setResolvedTicketIds] = useState(new Set());
  const [assignmentPopup, setAssignmentPopup] = useState({ message: '', type: '' });

  const handleClearNotifications = useCallback(async () => {
    const ids = notifications
      .map((item) => item.id)
      .filter((id) => id !== null && id !== undefined);
    if (ids.length > 0) {
      try {
        await notificationAPI.markRead(ids);
      } catch (err) {
        console.error('Failed to mark notifications as read:', err);
      }
    }
    setNotifications([]);
  }, [notifications, setNotifications]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await notificationAPI.list();
      if (response.success && Array.isArray(response.data)) {
        const formatted = response.data.map((item) => ({
          id: item.id ?? item.notification_id ?? `${item.ticket_id ?? "notification"}-${item.created_at ?? item.time ?? Date.now()}`,
          message: item.message ?? item.notification ?? item.description ?? `Ticket ${item.ticket_id ?? ""} assigned to you`.trim(),
          time: item.created_at ? new Date(item.created_at).toLocaleString() : item.time ?? ""
        }));
        setNotifications(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [setNotifications]);

  const handleLogout = async () => {
    await authAPI.logout();
    sessionStorage.setItem('sessionMessage', 'You have been logged out successfully.');
    setLoggedInUser(null);
    setEmployeeData(null);
    window.location.href = '/';
  };

  // Fetch user data and tickets on mount
  useEffect(() => {
    const user = userAPI.getCurrentUser();
    if (user) {
      setLoggedInUser(user.first_name || user.full_name || 'Employee');
      setEmployeeData({
        empID: user.id || user.emp_code || 'N/A',
        name: user.first_name || user.full_name || 'Employee',
        surname: user.surname || '',
        email: user.email || '',
        phone: user.phone_number || '',
        jobTitle: user.emp_job_title || user.job_title || 'Employee',
      });
    }
    fetchTickets();
    fetchEmployees();
  }, []);

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      await fetchNotifications();
    };
    loadNotifications();
    const intervalId = setInterval(() => {
      if (active) {
        loadNotifications();
      }
    }, 30000);
    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.list({});
      
      if (response.success && response.data) {
        const currentUser = userAPI.getCurrentUser();
        const isAdminUser = (currentUser?.access_level || "").toLowerCase() === "admin";
        const shouldFilterByEmployee = currentUser?.user_type === 'employee' && !isAdminUser;
        const employeeId = shouldFilterByEmployee ? Number(currentUser.id) : null;

        const formattedTickets = response.data.map(ticket => {
          const assignedToId = ticket.assigned_to_id ?? ticket.emp_id ?? null;

          return {
            id: ticket.id || ticket.ticket_id,
            ticket_id: ticket.id || ticket.ticket_id,
            title: ticket.title || ticket.subject || 'Untitled Ticket',
            status: normalizeStatus(ticket.status),
            location: ticket.location || 'N/A',
            createdAt: ticket.createdAt || ticket.date_created || ticket.created_at ? new Date(ticket.createdAt || ticket.date_created || ticket.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            ResolvedAt: ticket.completedAt || ticket.date_completed || ticket.resolved_at || null,
            description: ticket.description || '',
            assignedTo: ticket.assignedTo || ticket.assigned_to || 'Unassigned',
            assignedToId: assignedToId !== null ? Number(assignedToId) : null,
            hasNewUpdate: false,
            hasNewMessage: false,
          };
        });

        const filteredTickets = employeeId !== null
          ? formattedTickets.filter(ticket => ticket.assignedToId === employeeId)
          : formattedTickets;

        setTickets(filteredTickets);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await adminAPI.getEmployees();
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicketForAssignment || !selectedEmployeeId) {
      setAssignmentPopup({ message: 'Please select both a ticket and an employee', type: 'error' });
      return;
    }

    try {
      await ticketAPI.assign(selectedTicketForAssignment.id, selectedEmployeeId);
      setShowAssignModal(false);
      setSelectedTicketForAssignment(null);
      setSelectedEmployeeId('');
      await fetchTickets();
      await fetchNotifications();
      setAssignmentPopup({ message: 'Ticket assigned successfully', type: 'success' });
    } catch (err) {
      console.error('Failed to assign ticket:', err);
      setAssignmentPopup({ message: 'Failed to assign ticket. Please try again.', type: 'error' });
    }
  };

  //  Update open tickets count
  useEffect(() => {
    const openTickets = tickets.filter(
      (t) => t.status !== "Resolved"
    );
    setOpenCount(openTickets.length);
  }, [tickets]);

  // Clear notification on click
  const handleTicketClick = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, hasNewUpdate: false, hasNewMessage: false }
          : t
      )
    );
  };

  //  Change ticket status
  const handleStatusChange = async (ticketId, newStatus) => {
    if (newStatus === "Resolved") {
      const ticket = tickets.find((t) => t.id === ticketId);
      setShowResolvedPopup(ticket);
    } else {
      try {
        await ticketAPI.update(ticketId, { status: newStatus });
        // Refresh tickets after update
        await fetchTickets();
      } catch (err) {
        console.error('Failed to update ticket status:', err);
        alert('Failed to update ticket status. Please try again.');
      }
    }
  };
  
  const confirmResolved = async () => {
    if (!showResolvedPopup) return;

    const ticketId = showResolvedPopup.id;

    try {
      await ticketAPI.update(ticketId, { 
        status: "Resolved"
      });
      
      setTickets((prev) => 
        prev.map((t) => t.id === ticketId ? { ...t, status: "Resolved" } : t)
      );
      
      setResolvedTicketIds((prev) => new Set([...prev, ticketId]));
      setShowResolvedPopup(null);
      
      setTimeout(() => {
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
        setResolvedTicketIds((prev) => {
          const updated = new Set(prev);
          updated.delete(ticketId);
          return updated;
        });
      }, 10000);
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
      alert('Failed to resolve ticket. Please try again.');
    }
  };

  const allTickets = tickets;

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Topbar */}
        <Topbar
          username={loggedInUser || 'Employee'}
          notifications={notifications}
          setNotifications={setNotifications}
          onClearNotifications={handleClearNotifications}
          onOpenContacts={() => setShowContacts(true)}
          onOpenCalendar={() => setShowCalendar(true)}
          onOpenEmployeeDetails={() => setShowUserDetails(true)}
          onLogout={handleLogout}
        />

        {/* Open Tickets summary box */}
        <div className="flex justify-end mt-4 mr-6">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            <Ticket className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">
              Open Tickets: {openCount}
            </span>
          </button>
        </div>

        {/* Tickets Board */}
        <main className="flex-1 p-6 mt-2 overflow-x-auto">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading tickets...</p>
            </div>
          )}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {Board.map((status) => (
                <section key={status}>
                  <h2 className="font-semibold text-center mb-2">{status}</h2>

                  {allTickets
                    .filter((t) => t.status === status)
                    .map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`relative block rounded-lg border p-4 shadow bg-white !bg-white hover:shadow-lg transition ${ticket.status === "Pending"
                          ? "border-yellow-300"
                          : ticket.status === "In Progress"
                            ? "border-blue-300"
                            : "border-gray-300"
                        }`}
                    >
                      {/* 🔔 Notification Dots */}
                      {ticket.hasNewUpdate && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                      )}
                      {ticket.hasNewMessage && (
                        <span className="absolute top-2 right-6 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                      )}

                      {/* Clickable area */}
                      <Link
                        to={`/dashboard/tickets/${ticket.id}`}
                        onClick={() => handleTicketClick(ticket.id)}
                        className="block"
                      >
                        <h3
                          className={`font-bold text-sm mb-1 ${ticket.status === "Pending"
                              ? "text-red-500"
                              : ticket.status === "In Progress"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                        >
                          {ticket.status}
                        </h3>
                        <div
                          className={`p-3 rounded ${ticket.status === "Pending"
                              ? "bg-red-100"
                              : ticket.status === "In Progress"
                                ? "bg-yellow-100"
                                : "bg-green-100"
                            }`}
                        >
                          <p className="font-semibold text-sm">{ticket.title}</p>
                          <p className="text-xs text-gray-600">
                            Ticket ID: {ticket.id}
                          </p>
                          <p className="text-xs text-gray-600">
                            Location: {ticket.location}
                          </p>
                        </div>
                      </Link>

                      {/* 🟢 Dropdown for status change */}
                      <div className="mt-2 flex gap-2">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                          className="flex-1 border text-sm p-2 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            setSelectedTicketForAssignment(ticket);
                            setShowAssignModal(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Empty message */}
                {allTickets.filter((t) => t.status === status).length ===
                  0 && (
                    <p className="text-center text-gray-400 text-sm py-4">
                      No {status.toLowerCase()} tickets.
                    </p>
                  )}
              </section>
            ))}
            </div>
          )}
        </main>

        {/* Modals */}
        {showContacts && (
          <ContactsModal onClose={() => setShowContacts(false)} />
        )}
        {showCalendar && (
          <LeaveCalendarModal onClose={() => setShowCalendar(false)} />
        )}
        {showUserDetails && (
          <UserDetailsModal employee = {employeeData} onClose={() => setShowUserDetails(false)} />
        )}
        {showResolvedPopup && (
          <ResolvedPopup 
            ticket={showResolvedPopup}
            onConfirm={confirmResolved}
            onCancel={() => setShowResolvedPopup(null)}
          />
        )}

        <AssignmentPopup 
          message={assignmentPopup.message}
          type={assignmentPopup.type}
          onClose={() => setAssignmentPopup({ message: '', type: '' })}
        />
        
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Assign Ticket</h2>
              
              {selectedTicketForAssignment && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <p className="text-sm"><strong>Ticket ID:</strong> {selectedTicketForAssignment.id}</p>
                  <p className="text-sm"><strong>Title:</strong> {selectedTicketForAssignment.title}</p>
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
                    setSelectedTicketForAssignment(null);
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
      </div>
    </div>
  );
}
