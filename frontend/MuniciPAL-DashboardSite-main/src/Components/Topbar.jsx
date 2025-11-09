import { useState, useRef, useEffect } from "react";
import { Bell, Landmark } from "lucide-react";

export default function Topbar({ 
  username = "Mikhaar",
  onOpenContacts,
  onOpenCalendar,
  onOpenEmployeeDetails,
  notifications = [],
  setNotifications,
 }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const dropdownRef = useRef();
  const bellRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasNotifications = notifications.length > 0;

  return (
    <header className="bg-blue-900 text-white flex justify-between items-center px-6 py-3 relative">
      {/* Left side: Welcome text */}
      <div className="flex items-center space-x-2">
        <Landmark className="w-5 h-5" />
        <h1 className="text-lg font-bold">Welcome, {username}</h1>
      </div>

      {/* Right side: M avatar with dropdown */}
      <div className="flex items-center space-x-5">
        <div className="relative flex items-center" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative hover:text-yellow-400 flex items-center justify-center w-8 h-8"
          >
            <Bell className="w-5 h-5" />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              </span>
            )}
          </button>
          {bellOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white text-black rounded-md shadow-lg z-30 overflow-hidden">
              <div className="px-4 py-2 border-b bg-gray-50 font-semibold text-gray-700">
                Notifications
              </div>
              {notifications.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((note) => (
                    <li
                      key={note.id}
                      className="px-4 py-2 hover:bg-gray-100 border-b"
                    >
                      <p className="text-sm">{note.message}</p>
                      <p className="text-xs text-gray-500">{note.time}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-gray-500">No new notifications</div>
              )}
              <button
                onClick={() => setNotifications([])}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/*User Icon*/}
        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-yellow-500 text-blue-900 font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-400"
          >
            {username?.[0]?.toUpperCase() || "M"}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full w-48 bg-white text-black rounded-md shadow-lg z-20">
              <ul className="py-2">
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenContacts();
                    }}
                  >
                    Contacts
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenCalendar();
                    }}
                  >
                    Leave Calendar
                  </button>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenEmployeeDetails();
                    }}
                  >
                    Employee Details
                  </button>
                </li>
                <li className="border-t mt-1">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => alert("Logging out...")}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
