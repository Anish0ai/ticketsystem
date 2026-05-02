import { useState, useEffect } from "react";
import { FaTimes, FaTicketAlt } from "react-icons/fa";
import {
  getProjects,
  getUsers,
  createTicket,
  type Project,
  type User,
  type Ticket,
} from "../../services/api";

// ─── Types ────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  onCreated: (ticket: Ticket) => void;
}

// ─── Field config ─────────────────────────────────────────

const TYPES = ["Bug", "Enhancement", "Task", "Feature"] as const;
const PRIORITIES = ["Low", "Medium", "High"] as const;
const PLATFORMS = ["Web", "Mobile", "Desktop", "API"] as const;
const STATUSES = ["Open", "InProgress", "Review"] as const;

// ─── Shared field styles ──────────────────────────────────

const fieldCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";

// ─── Component ────────────────────────────────────────────

const TicketForm = ({ onClose, onCreated }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    type: "Bug",
    priority: "Medium",
    platform: "Web",
    status: "Open",
    creatorId: "1", // default to first user; could be replaced with auth context
    assignedToId: "",
  });

  // Fetch projects + users for dropdowns
  useEffect(() => {
    Promise.all([getProjects(), getUsers()])
      .then(([p, u]) => {
        setProjects(p);
        setUsers(u);
        // Pre-select first project if available
        if (p.length > 0) setForm((f) => ({ ...f, projectId: String(p[0].id) }));
        if (u.length > 0) setForm((f) => ({ ...f, creatorId: String(u[0].id) }));
      })
      .catch(() => setError("Failed to load form data. Please try again."));
  }, []);

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required.");
    if (!form.projectId) return setError("Please select a project.");

    setSubmitting(true);
    try {
      const ticket = await createTicket({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        status: form.status,
        priority: form.priority,
        type: form.type,
        platform: form.platform,
        projectId: Number(form.projectId),
        creatorId: Number(form.creatorId),
        assignedToId: form.assignedToId ? Number(form.assignedToId) : undefined,
      });
      onCreated(ticket);
      onClose();
    } catch {
      setError("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <FaTicketAlt />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">New Ticket</h2>
              <p className="text-xs text-gray-400">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. Login page crashes on mobile"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={fieldCls}
              autoFocus
            />
          </div>

          {/* Project */}
          <div>
            <label className={labelCls}>Project <span className="text-red-400">*</span></label>
            <select
              value={form.projectId}
              onChange={(e) => set("projectId", e.target.value)}
              className={fieldCls}
            >
              <option value="">— Select a project —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Type + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={fieldCls}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={fieldCls}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Platform + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Platform</label>
              <select value={form.platform} onChange={(e) => set("platform", e.target.value)} className={fieldCls}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={fieldCls}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "InProgress" ? "In Progress" : s === "Review" ? "In Review" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Creator + Assigned To row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Created By <span className="text-red-400">*</span></label>
              <select value={form.creatorId} onChange={(e) => set("creatorId", e.target.value)} className={fieldCls}>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assign To</label>
              <select value={form.assignedToId} onChange={(e) => set("assignedToId", e.target.value)} className={fieldCls}>
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              placeholder="Describe the issue or request..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={`${fieldCls} resize-none`}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Ticket"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
