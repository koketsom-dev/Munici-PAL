import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Uses SVGR (?react) so the SVG renders as a React component
import MunicipalIcon from "../assets/municiPAL.svg?react";


const NAV = [
  { to: "/",        label: "Dashboard", icon: "🏠" },
  { to: "/tickets", label: "Tickets",   icon: "🎟️" },
  { to: "/reports", label: "Reports",   icon: "📊" }, 
  { to: "/settings",label: "Settings",  icon: "⚙️" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (to) => pathname === to;

  return (
    <aside
      className={`bg-slate-900 text-slate-100 h-screen pt-3 transition-all duration-300
      ${collapsed ? "w-16" : "w-64"} flex flex-col`}
    >
      {/* Brand + collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="mx-3 mb-6 mt-2 flex items-center gap-3"
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        title={collapsed ? "Expand" : "Collapse"}
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white">
          <MunicipalIcon className="w-7 h-7 text-blue-500" />
          {/* Fallback if not using SVGR:
          <img src={municipalLogo} alt="MuniciPAL" className="w-7 h-7" /> */}
        </div>
        {!collapsed && <span className="font-semibold text-base">MuniciPAL</span>}
      </button>

      {/* Nav items */}
      <nav className="px-2 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`group flex items-center rounded-md px-3 py-2 transition-colors
              ${isActive(item.to) ? "bg-slate-700 text-white" : "text-slate-200 hover:bg-slate-800"}`}
          >
            <span className="w-6 text-lg text-center">{item.icon}</span>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300
                ${collapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-2"}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="flex-1" />
    </aside>
  );
}
