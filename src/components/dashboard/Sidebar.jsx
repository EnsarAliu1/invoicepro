import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  FilePlus,
  CreditCard,
  LogOut,
  ChevronRight,
  FileStack,
} from "lucide-react";
import { getUser, logOutUser } from "../../services/user.service";

const navItems = [
  { label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard" },
  { label: "Clients",          icon: Users,           path: "/dashboard/clients" },
  { label: "Items & Services", icon: Package,         path: "/dashboard/items" },
  { label: "Recent Invoices",  icon: FileText,        path: "/dashboard/invoices" },
  { label: "Create Invoice",   icon: FilePlus,        path: "/dashboard/create-invoice" },
  { label: "Payments",         icon: CreditCard,      path: "/dashboard/payments" },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = getUser();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    logOutUser();
    navigate("/login");
  };

  return (
    <aside className="flex flex-col h-screen w-64 bg-slate-900 border-r border-white/5 shadow-2xl">

      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
          <FileStack className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">
          Invoice<span className="text-blue-400">Pro</span>
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-slate-500">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <button
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400 shadow-inner"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 flex-shrink-0 transition-colors
                      ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}
                    size={18}
                  />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400/70" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Client info + Logout ── */}
      <div className="px-3 py-4 border-t border-white/5">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-3">
            {/* Avatar */}
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              {getInitials(user.name || user.email)}
            </div>
            {/* Name & email */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user.name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        ) : null}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut
            size={18}
            className="flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-colors"
          />
          <span>{loggingOut ? "Logging out…" : "Log out"}</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;