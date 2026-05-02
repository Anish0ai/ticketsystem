import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBug, FaRocket, FaCog, FaStar,
  FaGlobe, FaMobileAlt, FaDesktop, FaPlug,
  FaFolder, FaUser, FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import {
  getTicketById, getUsers, updateTicket,
  type TicketDetail as TicketDetailType,
  type User,
} from "../services/api";
import CommentSection from "./CommentSection";

// ─── Config maps ──────────────────────────────────────────

const statusConfig: Record<string, { label: string; bg: string; text: string; ring: string }> = {
  Open:       { label: "Open",        bg: "bg-blue-100",   text: "text-blue-700",   ring: "ring-blue-300"   },
  InProgress: { label: "In Progress", bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300" },
  Review:     { label: "In Review",   bg: "bg-cyan-100",   text: "text-cyan-700",   ring: "ring-cyan-300"   },
  Closed:     { label: "Closed",      bg: "bg-gray-100",   text: "text-gray-600",   ring: "ring-gray-300"   },
};

const priorityConfig: Record<string, { label: string; dot: string; text: string }> = {
  Low:    { label: "Low",    dot: "bg-green-400",  text: "text-green-700"  },
  Medium: { label: "Medium", dot: "bg-yellow-400", text: "text-yellow-700" },
  High:   { label: "High",   dot: "bg-red-400",    text: "text-red-700"    },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  Bug:         { label: "Bug",         icon: <FaBug />,    color: "text-red-600 bg-red-50 border-red-200"           },
  Enhancement: { label: "Enhancement", icon: <FaRocket />, color: "text-purple-600 bg-purple-50 border-purple-200"  },
  Task:        { label: "Task",        icon: <FaCog />,    color: "text-blue-600 bg-blue-50 border-blue-200"        },
  Feature:     { label: "Feature",     icon: <FaStar />,   color: "text-emerald-600 bg-emerald-50 border-emerald-200"},
};

const platformConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  Web:     { icon: <FaGlobe />,     label: "Web"     },
  Mobile:  { icon: <FaMobileAlt />, label: "Mobile"  },
  Desktop: { icon: <FaDesktop />,   label: "Desktop" },
  API:     { icon: <FaPlug />,      label: "API"     },
};

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500",  "bg-cyan-500",
];
const avatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

// ─── Shared select style ──────────────────────────────────

const selectCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

// ─── Sidebar row ──────────────────────────────────────────

const SidebarRow = ({
  icon, label, children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
      {icon} {label}
    </p>
    {children}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-32 mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-64" />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-48" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 h-96" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<TicketDetailType | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sidebar control state — mirrors the ticket's current values
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedToId, setAssignedToId] = useState<string>("");

  // Per-field saving indicators
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    Promise.all([getTicketById(Number(id)), getUsers()])
      .then(([t, u]) => {
        setTicket(t);
        setUsers(u);
        setStatus(t.status);
        setPriority(t.priority);
        setAssignedToId(t.assignedToId ? String(t.assignedToId) : "");
      })
      .catch(() => setError("Ticket not found or failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  // Generic field updater — sends PATCH and updates local state
  const patch = async (field: string, value: string | null) => {
    if (!ticket) return;
    setSaving((s) => ({ ...s, [field]: true }));
    try {
      const payload: Record<string, string | number | null> = {};
      if (field === "status")       payload.status       = value as string;
      if (field === "priority")     payload.priority     = value as string;
      if (field === "assignedToId") payload.assignedToId = value ? Number(value) : null;

      const updated = await updateTicket(ticket.id, payload);
      setTicket(updated);
    } catch {
      // revert local state on failure
      setStatus(ticket.status);
      setPriority(ticket.priority);
      setAssignedToId(ticket.assignedToId ? String(ticket.assignedToId) : "");
    } finally {
      setSaving((s) => ({ ...s, [field]: false }));
    }
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    patch("status", val);
  };

  const handlePriorityChange = (val: string) => {
    setPriority(val);
    patch("priority", val);
  };

  const handleAssigneeChange = (val: string) => {
    setAssignedToId(val);
    patch("assignedToId", val || null);
  };

  // ── Render states ──────────────────────────────────────

  if (loading) return <Skeleton />;

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium mb-4">{error || "Ticket not found."}</p>
        <Link to="/tickets" className="text-blue-500 hover:underline text-sm flex items-center gap-1.5">
          <FaArrowLeft className="text-xs" /> Back to Tickets
        </Link>
      </div>
    );
  }

  const statusCfg   = statusConfig[status]     || statusConfig.Open;
  const priorityCfg = priorityConfig[priority] || priorityConfig.Medium;
  const typeCfg     = typeConfig[ticket.type]  || typeConfig.Task;
  const platformCfg = platformConfig[ticket.platform] || platformConfig.Web;

  // Use first user as "current user" for posting comments
  // In a real app this would come from an auth context
  const currentUser = users[0] ?? ticket.creator;

  return (
    <div>
      {/* Back link */}
      <Link
        to="/tickets"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-5"
      >
        <FaArrowLeft className="text-xs" /> All Tickets
      </Link>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main column ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Title card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* ID + type badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-gray-400">#{ticket.id}</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeCfg.color}`}>
                {typeCfg.icon} {typeCfg.label}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                {platformCfg.icon} {platformCfg.label}
              </span>
            </div>

            {/* Title + status */}
            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-xl font-bold text-gray-800 flex-1 leading-snug">
                {ticket.title}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusCfg.bg} ${statusCfg.text}`}>
                {statusCfg.label}
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Description</p>
              {ticket.description ? (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">No description provided.</p>
              )}
            </div>

            {/* Meta footer */}
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-gray-50 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <FaUser className="text-gray-300" />
                Created by <strong className="text-gray-600 ml-1">{ticket.creator.name}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-gray-300" />
                {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>

          {/* Comment section */}
          {currentUser && (
            <CommentSection
              ticketId={ticket.id}
              initialComments={ticket.comments}
              currentUser={currentUser}
            />
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5 sticky top-6">

            {/* Status */}
            <SidebarRow icon={<FaCheckCircle className="text-gray-300" />} label="Status">
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving.status}
                  className={`${selectCls} ${saving.status ? "opacity-60 cursor-wait" : ""}`}
                >
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Review">In Review</option>
                  <option value="Closed">Closed</option>
                </select>
                {saving.status && (
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>
              {/* Visual badge preview */}
              <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                {statusCfg.label}
              </span>
            </SidebarRow>

            <div className="border-t border-gray-50" />

            {/* Priority */}
            <SidebarRow icon={<span className={`w-2 h-2 rounded-full ${priorityCfg.dot}`} />} label="Priority">
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  disabled={saving.priority}
                  className={`${selectCls} ${saving.priority ? "opacity-60 cursor-wait" : ""}`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {saving.priority && (
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>
            </SidebarRow>

            <div className="border-t border-gray-50" />

            {/* Project */}
            <SidebarRow icon={<FaFolder className="text-gray-300" />} label="Project">
              <Link
                to={`/projects/${ticket.projectId}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {ticket.project.name}
              </Link>
            </SidebarRow>

            <div className="border-t border-gray-50" />

            {/* Type */}
            <SidebarRow icon={typeCfg.icon} label="Issue Type">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${typeCfg.color}`}>
                {typeCfg.icon} {typeCfg.label}
              </span>
            </SidebarRow>

            <div className="border-t border-gray-50" />

            {/* Assignee */}
            <SidebarRow icon={<FaUser className="text-gray-300" />} label="Assigned To">
              <div className="relative">
                <select
                  value={assignedToId}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  disabled={saving.assignedToId}
                  className={`${selectCls} ${saving.assignedToId ? "opacity-60 cursor-wait" : ""}`}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                  ))}
                </select>
                {saving.assignedToId && (
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>

              {/* Assignee preview */}
              {ticket.assignedTo && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-6 h-6 rounded-full ${avatarColor(ticket.assignedTo.name)} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {ticket.assignedTo.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700">{ticket.assignedTo.name}</span>
                  <span className="text-xs text-gray-400">— {ticket.assignedTo.role}</span>
                </div>
              )}
            </SidebarRow>

            <div className="border-t border-gray-50" />

            {/* Reporter */}
            <SidebarRow icon={<FaUser className="text-gray-300" />} label="Reporter">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${avatarColor(ticket.creator.name)} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {ticket.creator.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{ticket.creator.name}</span>
                <span className="text-xs text-gray-400">— {ticket.creator.role}</span>
              </div>
            </SidebarRow>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
