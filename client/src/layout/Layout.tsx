import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaFolder,
  FaTh,
  FaColumns,
  FaPlus,
  FaBell,
  FaSync,
  FaChevronDown,
  FaCircle,
} from "react-icons/fa";
import { useTickets } from "../context/TicketContext";
import TicketForm from "../components/forms/TicketForm";

// ─── Sidebar nav items ────────────────────────────────────

const navItems = [
  { to: "/",          icon: <FaTachometerAlt />, label: "Dashboard", end: true },
  { to: "/tickets",   icon: <FaTicketAlt />,     label: "Tickets"             },
  { to: "/kanban",    icon: <FaColumns />,        label: "Kanban"              },
  { to: "/projects",  icon: <FaFolder />,         label: "Projects"            },
  { to: "/creations", icon: <FaTh />,             label: "Creations"           },
];

// Map pathname → readable title shown in the top navbar
const PAGE_TITLES: Record<string, string> = {
  "/":          "Dashboard",
  "/tickets":   "Tickets",
  "/kanban":    "Kanban Board",
  "/projects":  "Projects",
  "/creations": "Creations",
};

const getPageTitle = (pathname: string): string => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/tickets/"))  return "Ticket Detail";
  if (pathname.startsWith("/projects/")) return "Project Detail";
  return "Admin Panel";
};

// ─── Notification Bell ────────────────────────────────────

const NotificationBell = () => {
  const { tickets } = useTickets();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Only show Open tickets as "notifications"
  const openTickets = tickets.filter((t) => t.status === "Open").slice(0, 8);
  const count = tickets.filter((t) => t.status === "Open").length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
        aria-label="Notifications"
      >
        <FaBell className="text-base" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">Open Tickets</span>
            <span className="text-xs text-gray-400">{count} total</span>
          </div>

          {openTickets.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No open tickets 🎉
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
              {openTickets.map((t) => (
                <li key={t.id}>
                  <NavLink
                    to={`/tickets/${t.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <FaCircle className="text-blue-400 text-[8px] mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t.project?.name || "—"} · {t.priority}
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] font-mono text-gray-300 flex-shrink-0">
                      #{t.id}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {count > 8 && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-center">
              <NavLink
                to="/tickets"
                onClick={() => setOpen(false)}
                className="text-xs text-blue-500 hover:underline"
              >
                View all {count} open tickets →
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── User Menu ────────────────────────────────────────────

const UserMenu = () => {
  const { refresh, loading } = useTickets();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-bold select-none">
          A
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-700 leading-none">Anish</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Admin</p>
        </div>
        <FaChevronDown className={`text-[10px] text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {/* Profile header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Anish</p>
            <p className="text-xs text-gray-400">anish@ticketsys.com</p>
            <span className="inline-block mt-1.5 text-[11px] font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              Admin
            </span>
          </div>

          {/* Actions */}
          <ul className="py-1">
            <li>
              <button
                onClick={async () => { await refresh(); setOpen(false); }}
                disabled={loading}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <FaSync className={`text-gray-400 text-xs ${loading ? "animate-spin" : ""}`} />
                {loading ? "Refreshing…" : "Refresh Data"}
              </button>
            </li>
            <li>
              <NavLink
                to="/creations"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <FaTh className="text-gray-400 text-xs" />
                Manage System
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

// ─── Layout ───────────────────────────────────────────────

const Layout = () => {
  const location = useLocation();
  const { addTicket } = useTickets();
  const [showTicketForm, setShowTicketForm] = useState(false);

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-100 p-4 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FaTicketAlt className="text-white text-sm" />
          </div>
          <span className="text-base font-bold text-gray-800">TicketSys</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 text-center">TicketSys v1.0</p>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top Navbar ── */}
        <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">

          {/* Left: current page title */}
          <h2 className="text-base font-semibold text-gray-800 truncate">{pageTitle}</h2>

          {/* Right: actions */}
          <div className="flex items-center gap-2">

            {/* + New Ticket */}
            <button
              onClick={() => setShowTicketForm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
            >
              <FaPlus className="text-xs" />
              <span className="hidden sm:inline">New Ticket</span>
            </button>

            {/* Notification bell */}
            <NotificationBell />

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* User menu */}
            <UserMenu />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* ── New Ticket Modal (global, available on every page) ── */}
      {showTicketForm && (
        <TicketForm
          onClose={() => setShowTicketForm(false)}
          onCreated={(ticket) => {
            addTicket(ticket);
            setShowTicketForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;
