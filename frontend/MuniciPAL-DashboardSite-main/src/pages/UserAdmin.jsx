import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Pencil, Trash2, User } from "lucide-react";
import { adminAPI } from "../../../src/services/api";

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    gender: "Other",
    home_language: "Other",
  });

  // Load users from database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCommunityUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  //Handles Delete User
  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      try {
        await adminAPI.deleteCommunityUser(users[deleteIndex].id);
        fetchUsers();
        setDeleteIndex(null);
        setShowDeleteModal(false);
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  }

  const handleToggleModerator = async (userId, isModerator) => {
    try {
      await adminAPI.updateCommunityUser(userId, { is_moderator: isModerator });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update moderator status:', err);
      alert('Failed to update moderator status. Please try again.');
    }
  };

  const handleToggleBan = async (userId, isBanned) => {
    try {
      await adminAPI.updateCommunityUser(userId, { is_banned: isBanned });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update ban status:', err);
      alert('Failed to update ban status. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!form.full_name || !form.email) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      if (isEditing !== null) {
        // For editing, update community user details
        await adminAPI.updateCommunityUser(users[isEditing].id, {
          full_name: form.full_name,
          email: form.email,
          gender: form.gender,
          home_language: form.home_language,
        });
      } else {
        // For adding, require password
        if (!form.password) {
          alert("Password is required for new users.");
          return;
        }
        await adminAPI.addCommunityUser(form);
      }
      fetchUsers();
      setIsEditing(null);
      setShowModal(false);
      setForm({
        full_name: "",
        email: "",
        password: "",
        gender: "Other",
        home_language: "Other",
      });
    } catch (err) {
      console.error('Failed to save user:', err);
      alert('Failed to save user. Please try again.');
    }
  };



  const filteredUsers = users.filter((u) =>
    `${u.full_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 h-12 pr-4">
          <h1 className="text-2xl font-bold">Community User Administration</h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search (Name, Email)"
              className="border px-4 py-2 rounded w-72"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Styled like Employee button */}
            <button
              onClick={() => {
                setForm({
                  full_name: "",
                  email: "",
                  password: "",
                  gender: "Other",
                  home_language: "Other",
                });
                setIsEditing(null);
                setShowModal(true);
              }}
              className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              <User className="w-5 h-5 mr-2" />
              <span>Add Community User</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded shadow-md">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Home Language</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Registration Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.full_name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.gender}</td>
                  <td className="border p-2">{user.home_language}</td>
                  <td className="border p-2">
                    <select
                      value={user.is_banned ? "Banned" : "Active"}
                      onChange={(e) => handleToggleBan(user.id, e.target.value === "Banned")}
                      className="border rounded px-2 py-1 mr-2"
                    >
                      <option>Active</option>
                      <option>Banned</option>
                    </select>
                    <select
                      value={user.is_moderator ? "Moderator" : "User"}
                      onChange={(e) => handleToggleModerator(user.id, e.target.value === "Moderator")}
                      className="border rounded px-2 py-1"
                    >
                      <option>User</option>
                      <option>Moderator</option>
                    </select>
                  </td>
                  <td className="border p-2">{new Date(user.registration_date).toLocaleDateString()}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => {
                        setForm({
                          full_name: user.full_name,
                          email: user.email,
                          gender: user.gender,
                          home_language: user.home_language,
                        });
                        setIsEditing(index);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Edit Community User"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Community User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-3">
                    No community users found.
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
                  {isEditing !== null ? "Edit Community User" : "Add Community User"}
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
                  name="full_name"
                  placeholder="Full Name"
                  className="w-full border px-3 py-2 rounded"
                  value={form.full_name}
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
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <select
                  name="home_language"
                  value={form.home_language}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                >
                  <option>English</option>
                  <option>Afrikaans</option>
                  <option>Zulu</option>
                  <option>Xhosa</option>
                  <option>Other</option>
                </select>
                {isEditing === null && (
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    {isEditing !== null ? "Update Community User" : "Add Community User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this community user?
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