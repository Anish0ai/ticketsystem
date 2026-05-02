import { Link } from "react-router-dom";
import {
  FaTicketAlt, FaFolderOpen, FaSpinner,
  FaCheckCircle, FaSearch, FaBug,
  FaRocket, FaCog, FaStar,
} from "react-icons/fa";
import { useTickets } from "../context/TicketContext";

// ─── Config ───────────────────────────────────────────────

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  Open:       { label: "Open",        bg: "bg-blue-100",   text: "text-blue-700"   },
  InProgress: { label: "In Progress", bg: "bg-orange-100", text: "text-orange-700" },
  Review:     { label: "In Review",   bg: "bg-cyan-100",   text: "text-cyan-700"   },
  Closed:     { label: "Closed",      bg: "bg-gray-100",   text: "text-gray-600"   },
};

const priorityDot: Record<string, string> = {
  Low: "bg-green-400", Medium: "bg-yellow-400", High: "bg-red-400",
};

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Bug:         { icon: <FaBug className="text-[10px]" />,    color: "text-red-600 bg-red-50 border-red-200"           },
  Enhancement: { icon: <FaRocket className="text-[10px]" />, color: "text-purple-600 bg-purple-50 border-purple-200"  },
  Task:        { icon: <FaCog className="text-[10px]" />,    color: "text-blue-600 bg-blue-50 border-blue-200"        },
  Feature:     { icon: <FaStar className="text-[10px]" />,   color: "text-emerald-600 bg-emerald-50 border-emerald-200"},
};

// ─── Component ────────────────────────────────────────────

const Dashboard = () => {
  const { tickets, loading } = useTickets();

  // Derive stats directly from context — always in sync
  const stats = {
    total:      tickets.length,
    open:       tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "InProgress").length,
    review:     tickets.filter((t) => t.status === "Review").length,
    closed:     tickets.filter((t) => t.status === "Closed").length,
  };

  const kpiCards = [
    { label: "Total Tickets", value: stats.total,      icon: <FaTicketAlt className="text-xl" />,  lightBg: "bg-blue-50",    textColor: "text-blue-600"    },
    { label: "Open",          value: stats.open,       icon: <FaFolderOpen className="text-xl" />, lightBg: "bg-amber-50",   textColor: "text-amber-600"   },
    { label: "In Progress",   value: stats.inProgress, icon: <FaSpinner className="text-xl" />,    lightBg: "bg-purple-50",  textColor: "text-purple-600"  },
    { label: "In Review",     value: stats.review,     icon: <FaSearch className="text-xl" />,     lightBg: "bg-cyan-50",    textColor: "text-cyan-600"    },
    { label: "Closed",        value: stats.closed,     icon: <FaCheckCircle className="text-xl" />,lightBg: "bg-emerald-50", textColor: "text-emerald-600" },
  ];

  // 5 most recent tickets
  const recent = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your ticket system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                </div>
                <div className="h-8 bg-gray-200 rounded w-12 mt-2" />
              </div>
            ))
          : kpiCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">{card.label}</span>
                  <div className={`${card.lightBg} ${card.textColor} p-2.5 rounded-lg`}>
                    {card.icon}
                  </div>
                </div>
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
            ))}
      </div>

      {/* Bottom row: Quick Summary + Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Summary</h2>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
                <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-800">{stats.open}</strong> tickets awaiting assignment
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-800">{stats.inProgress}</strong> tickets being worked on
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50">
                <div className="h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-800">{stats.review}</strong> tickets in review
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-800">{stats.closed}</strong> tickets resolved
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Recent Tickets</h2>
            <Link to="/tickets" className="text-xs text-blue-500 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-4 bg-gray-200 rounded w-10" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              No tickets yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Title</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Priority</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((ticket) => {
                  const statusCfg = statusConfig[ticket.status] || statusConfig.Open;
                  const typeCfg   = typeConfig[ticket.type]     || typeConfig.Task;
                  return (
                    <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">#{ticket.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {ticket.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border ${typeCfg.color}`}>
                          {typeCfg.icon} {ticket.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                          <span className={`w-2 h-2 rounded-full ${priorityDot[ticket.priority] || "bg-gray-300"}`} />
                          {ticket.priority}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
