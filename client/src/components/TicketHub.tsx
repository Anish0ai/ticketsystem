import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTickets } from "../context/TicketContext";
import {
  FaList,
  FaTh,
  FaSearch,
  FaBug,
  FaRocket,
  FaCog,
  FaStar,
  FaGlobe,
  FaMobileAlt,
  FaDesktop,
  FaPlug,
  FaPlus,
} from "react-icons/fa";
import TicketForm from "./forms/TicketForm";

// ─── Status / Priority Config ────────────────────────────

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  Open: { label: "Open", bg: "bg-blue-100", text: "text-blue-700" },
  InProgress: { label: "In Progress", bg: "bg-orange-100", text: "text-orange-700" },
  Review: { label: "In Review", bg: "bg-cyan-100", text: "text-cyan-700" },
  Closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-600" },
};

const priorityConfig: Record<string, { label: string; dot: string }> = {
  Low: { label: "Low", dot: "bg-green-400" },
  Medium: { label: "Medium", dot: "bg-yellow-400" },
  High: { label: "High", dot: "bg-red-400" },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  Bug: { label: "Bug", icon: <FaBug className="text-[10px]" />, color: "text-red-600 bg-red-50 border-red-200" },
  Enhancement: { label: "Enhancement", icon: <FaRocket className="text-[10px]" />, color: "text-purple-600 bg-purple-50 border-purple-200" },
  Task: { label: "Task", icon: <FaCog className="text-[10px]" />, color: "text-blue-600 bg-blue-50 border-blue-200" },
  Feature: { label: "Feature", icon: <FaStar className="text-[10px]" />, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
};

const platformIcons: Record<string, React.ReactNode> = {
  Web: <FaGlobe className="text-[10px]" />,
  Mobile: <FaMobileAlt className="text-[10px]" />,
  Desktop: <FaDesktop className="text-[10px]" />,
  API: <FaPlug className="text-[10px]" />,
};

// ─── Sub-components ──────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status] || statusConfig.Open;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const cfg = priorityConfig[priority] || priorityConfig.Medium;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Main Component ──────────────────────────────────────

const TicketHub = () => {
  const { tickets, loading, addTicket } = useTickets();
  const [viewType, setViewType] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Derived data
  const projectNames = useMemo(
    () => [...new Set(tickets.map((t) => t.project?.name).filter(Boolean))],
    [tickets]
  );

  const filtered = useMemo(() => {    return tickets.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (projectFilter !== "all" && t.project?.name !== projectFilter) return false;
      return true;
    });
  }, [tickets, search, statusFilter, priorityFilter, projectFilter]);

  // ─── Skeleton Loader ───────────────────────────────────

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-7 bg-gray-200 rounded w-40 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-64 mt-2 animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-gray-50 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-28 ml-auto" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} ticket{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Right side: New Ticket button + View Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTicketForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
          >
            <FaPlus className="text-xs" />
            New Ticket
          </button>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "list"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaList className="text-xs" /> List
          </button>
          <button
            onClick={() => setViewType("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "grid"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaTh className="text-xs" /> Grid
          </button>
        </div>
        </div> {/* end right-side flex */}
      </div>
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="InProgress">In Progress</option>
          <option value="Review">In Review</option>
          <option value="Closed">Closed</option>
        </select>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Projects */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {projectNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* ────── List View (Table) ────── */}
      {viewType === "list" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Project</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No tickets match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                        #{ticket.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <Link to={`/tickets/${ticket.id}`} className="hover:text-blue-600 transition-colors">
                          {ticket.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {ticket.project?.name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {ticket.assignedTo?.name || (
                          <span className="text-gray-300 italic">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────── Grid View (Cards) ────── */}
      {viewType === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              No tickets match your filters.
            </div>
          ) : (
            filtered.map((ticket) => {
              const typeCfg = typeConfig[ticket.type] || typeConfig.Task;
              return (
                <Link
                  key={ticket.id}
                  to={`/tickets/${ticket.id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
                >
                  {/* Top row: ID + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-400">
                      #{ticket.id}
                    </span>
                    <StatusBadge status={ticket.status} />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2 leading-snug">
                    {ticket.title}
                  </h3>

                  {/* Tags: Platform + Type */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border bg-gray-50 text-gray-600 border-gray-200">
                      {platformIcons[ticket.platform] || platformIcons.Web}
                      {ticket.platform}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border ${typeCfg.color}`}
                    >
                      {typeCfg.icon}
                      {typeCfg.label}
                    </span>
                  </div>

                  {/* Footer: Priority + Assignee */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <PriorityBadge priority={ticket.priority} />
                    <span className="text-xs text-gray-400">
                      {ticket.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* ────── New Ticket Modal ────── */}
      {showTicketForm && (
        <TicketForm
          onClose={() => setShowTicketForm(false)}
          onCreated={addTicket}
        />
      )}
    </div>
  );
};

export default TicketHub;
