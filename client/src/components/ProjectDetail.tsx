import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaGlobe,
  FaMobileAlt,
  FaDesktop,
  FaPlug,
  FaTicketAlt,
  FaUsers,
  FaUserCircle,
  FaBug,
  FaRocket,
  FaCog,
  FaStar,
} from "react-icons/fa";
import { getProjectById, type ProjectDetail as ProjectDetailType, type Ticket } from "../services/api";

// ─── Config maps (mirrors TicketHub) ─────────────────────

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  Open:       { label: "Open",        bg: "bg-blue-100",   text: "text-blue-700"   },
  InProgress: { label: "In Progress", bg: "bg-orange-100", text: "text-orange-700" },
  Review:     { label: "In Review",   bg: "bg-cyan-100",   text: "text-cyan-700"   },
  Closed:     { label: "Closed",      bg: "bg-gray-100",   text: "text-gray-600"   },
};

const priorityConfig: Record<string, { label: string; dot: string }> = {
  Low:    { label: "Low",    dot: "bg-green-400"  },
  Medium: { label: "Medium", dot: "bg-yellow-400" },
  High:   { label: "High",   dot: "bg-red-400"    },
};

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  Bug:         { label: "Bug",         icon: <FaBug className="text-[10px]" />,    color: "text-red-600 bg-red-50 border-red-200"         },
  Enhancement: { label: "Enhancement", icon: <FaRocket className="text-[10px]" />, color: "text-purple-600 bg-purple-50 border-purple-200" },
  Task:        { label: "Task",        icon: <FaCog className="text-[10px]" />,    color: "text-blue-600 bg-blue-50 border-blue-200"       },
  Feature:     { label: "Feature",     icon: <FaStar className="text-[10px]" />,   color: "text-emerald-600 bg-emerald-50 border-emerald-200"},
};

const platformConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  Web:     { icon: <FaGlobe />,     bg: "bg-blue-50",    text: "text-blue-600"    },
  Mobile:  { icon: <FaMobileAlt />, bg: "bg-purple-50",  text: "text-purple-600"  },
  Desktop: { icon: <FaDesktop />,   bg: "bg-amber-50",   text: "text-amber-600"   },
  API:     { icon: <FaPlug />,      bg: "bg-emerald-50", text: "text-emerald-600" },
};

const roleColors: Record<string, string> = {
  Admin:     "bg-rose-50 text-rose-600 border-rose-200",
  Manager:   "bg-purple-50 text-purple-600 border-purple-200",
  Developer: "bg-blue-50 text-blue-600 border-blue-200",
  Designer:  "bg-amber-50 text-amber-600 border-amber-200",
  QA:        "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500",  "bg-cyan-500",
];
const avatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

// ─── Sub-components ───────────────────────────────────────

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

// ─── Skeleton ─────────────────────────────────────────────

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
    <div className="h-4 bg-gray-100 rounded w-72 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-40" />
      </div>
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 h-80" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getProjectById(Number(id))
      .then(setProject)
      .catch(() => setError("Project not found or failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton />;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium mb-4">{error || "Project not found."}</p>
        <Link to="/projects" className="text-blue-500 hover:underline text-sm flex items-center gap-1">
          <FaArrowLeft className="text-xs" /> Back to Projects
        </Link>
      </div>
    );
  }

  const plt = platformConfig[project.platform] || platformConfig.Web;

  // Ticket stats
  const ticketStats = {
    total: project.tickets.length,
    open: project.tickets.filter((t) => t.status === "Open").length,
    inProgress: project.tickets.filter((t) => t.status === "InProgress").length,
    closed: project.tickets.filter((t) => t.status === "Closed").length,
  };

  return (
    <div>
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-5"
      >
        <FaArrowLeft className="text-xs" />
        All Projects
      </Link>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`w-14 h-14 rounded-2xl ${avatarColor(project.name)} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${plt.bg} ${plt.text}`}>
              {plt.icon} {project.platform}
            </span>
            <span className="text-gray-400 text-xs">
              Created {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500 mt-2 max-w-xl">{project.description}</p>
          )}
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Total Tickets", value: ticketStats.total, color: "bg-gray-50 text-gray-700 border-gray-200" },
          { label: "Open",          value: ticketStats.open,       color: "bg-blue-50 text-blue-700 border-blue-200"   },
          { label: "In Progress",   value: ticketStats.inProgress, color: "bg-orange-50 text-orange-700 border-orange-200" },
          { label: "Closed",        value: ticketStats.closed,     color: "bg-gray-50 text-gray-500 border-gray-200"   },
        ].map(({ label, value, color }) => (
          <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${color}`}>
            <FaTicketAlt className="text-xs opacity-60" />
            <span>{value} {label}</span>
          </div>
        ))}
      </div>

      {/* Main layout: sidebar + tickets table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left sidebar ── */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Tech Stack */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaCog className="text-gray-400" /> Tech Stack
            </h2>
            {project.techStack.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No tech stack defined.</p>
            )}
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUsers className="text-gray-400" /> Team
              <span className="ml-auto text-xs font-normal text-gray-400">
                {project.members.length} member{project.members.length !== 1 ? "s" : ""}
              </span>
            </h2>

            {project.members.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No members assigned.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {project.members.map((member) => {
                  const roleCls = roleColors[member.role] || "bg-gray-50 text-gray-600 border-gray-200";
                  return (
                    <li key={member.id} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${avatarColor(member.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${roleCls}`}>
                        {member.role}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ── Tickets table ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaTicketAlt className="text-gray-400" /> Project Tickets
            </h2>
            <span className="text-xs text-gray-400">{project.tickets.length} total</span>
          </div>

          {project.tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FaTicketAlt className="text-4xl mb-3 text-gray-200" />
              <p className="text-sm">No tickets for this project yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Priority</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {project.tickets.map((ticket: Ticket) => {
                    const typeCfg = typeConfig[ticket.type] || typeConfig.Task;
                    return (
                      <tr
                        key={ticket.id}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                          #{ticket.id}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                          <span className="line-clamp-1">{ticket.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border ${typeCfg.color}`}>
                            {typeCfg.icon} {typeCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-4 py-3">
                          {ticket.assignedTo ? (
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-full ${avatarColor(ticket.assignedTo.name)} flex items-center justify-center text-white text-[9px] font-bold`}>
                                {ticket.assignedTo.name.charAt(0)}
                              </div>
                              <span className="text-gray-600 text-xs">{ticket.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-300 text-xs italic">
                              <FaUserCircle /> Unassigned
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
