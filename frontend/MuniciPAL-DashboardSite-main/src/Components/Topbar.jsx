import { useState, useRef, useEffect } from "react";
import { Landmark } from "lucide-react";

export default function Topbar({ username = "Mikhaar", onOpenContacts, onOpenCalendar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-blue-900 text-white flex justify-between items-center px-6 py-3 relative">
      {/* Left side: Welcome text */}
      <div className="flex items-center space-x-2">
        <Landmark className="w-5 h-5" />
        <h1 className="text-lg font-bold">Welcome, {username}</h1>
      </div>

      {/* Right side: M avatar with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-yellow-500 text-blue-900 font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-400"
        >
          M
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
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
    </header>
  );
}
