import { useState } from "react";
import {
  FaUserTag, FaBug, FaCircle,
  FaPlus, FaTrash, FaPalette,
} from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────

interface RoleItem   { id: number; name: string }
interface TypeItem   { id: number; name: string; color: string }
interface StatusItem { id: number; name: string; color: string }

// ─── Seed data (system defaults) ─────────────────────────
// These mirror the Prisma enums. In a future iteration these
// could be persisted to a DB table; for now they live in state.

const DEFAULT_ROLES: RoleItem[] = [
  { id: 1, name: "Admin"     },
  { id: 2, name: "Developer" },
  { id: 3, name: "Designer"  },
  { id: 4, name: "QA"        },
  { id: 5, name: "Manager"   },
];

const DEFAULT_TYPES: TypeItem[] = [
  { id: 1, name: "Bug",         color: "#ef4444" },
  { id: 2, name: "Enhancement", color: "#a855f7" },
  { id: 3, name: "Task",        color: "#3b82f6" },
  { id: 4, name: "Feature",     color: "#10b981" },
];

const DEFAULT_STATUSES: StatusItem[] = [
  { id: 1, name: "Open",       color: "#3b82f6" },
  { id: 2, name: "InProgress", color: "#f97316" },
  { id: 3, name: "Review",     color: "#06b6d4" },
  { id: 4, name: "Closed",     color: "#6b7280" },
];

// ─── Shared styles ────────────────────────────────────────

const inputCls =
  "flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

// ─── Tab definitions ──────────────────────────────────────

const TABS = [
  { key: "roles",    label: "Roles",       icon: <FaUserTag /> },
  { key: "types",    label: "Issue Types", icon: <FaBug />     },
  { key: "statuses", label: "Statuses",    icon: <FaCircle />  },
] as const;
type TabKey = typeof TABS[number]["key"];

// ─── Roles Tab ────────────────────────────────────────────

const RolesTab = () => {
  const [roles, setRoles] = useState<RoleItem[]>(DEFAULT_ROLES);
  const [input, setInput] = useState("");
  const nextId = () => Math.max(0, ...roles.map((r) => r.id)) + 1;

  const add = () => {
    const name = input.trim();
    if (!name || roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) return;
    setRoles((prev) => [...prev, { id: nextId(), name }]);
    setInput("");
  };

  const remove = (id: number) => setRoles((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Manage the roles available to team members in this system.
      </p>

      {/* Add row */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New role name…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className={inputCls}
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition"
        >
          <FaPlus className="text-xs" /> Add
        </button>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2">
        {roles.map((role) => (
          <li
            key={role.id}
            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-2.5">
              <FaUserTag className="text-blue-400 text-sm" />
              <span className="text-sm font-medium text-gray-700">{role.name}</span>
            </div>
            <button
              onClick={() => remove(role.id)}
              className="text-gray-300 hover:text-red-400 transition p-1 rounded"
              title="Remove role"
            >
              <FaTrash className="text-xs" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Issue Types Tab ──────────────────────────────────────

const TypesTab = () => {
  const [types, setTypes] = useState<TypeItem[]>(DEFAULT_TYPES);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const nextId = () => Math.max(0, ...types.map((t) => t.id)) + 1;

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed || types.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return;
    setTypes((prev) => [...prev, { id: nextId(), name: trimmed, color }]);
    setName("");
    setColor("#6366f1");
  };

  const remove = (id: number) => setTypes((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Define the types of issues that can be raised in this system.
      </p>

      {/* Add row */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="New issue type…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className={inputCls}
        />
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5">
          <FaPalette className="text-gray-400 text-sm" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
            title="Pick color"
          />
        </div>
        <button
          onClick={add}
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition"
        >
          <FaPlus className="text-xs" /> Add
        </button>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2">
        {types.map((type) => (
          <li
            key={type.id}
            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-sm font-medium text-gray-700">{type.name}</span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: type.color + "22", color: type.color }}
              >
                {type.color}
              </span>
            </div>
            <button
              onClick={() => remove(type.id)}
              className="text-gray-300 hover:text-red-400 transition p-1 rounded"
              title="Remove type"
            >
              <FaTrash className="text-xs" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Statuses Tab ─────────────────────────────────────────

const StatusesTab = () => {
  const [statuses, setStatuses] = useState<StatusItem[]>(DEFAULT_STATUSES);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#8b5cf6");
  const nextId = () => Math.max(0, ...statuses.map((s) => s.id)) + 1;

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed || statuses.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    setStatuses((prev) => [...prev, { id: nextId(), name: trimmed, color }]);
    setName("");
    setColor("#8b5cf6");
  };

  const remove = (id: number) => setStatuses((prev) => prev.filter((s) => s.id !== id));

  const updateColor = (id: number, newColor: string) => {
    setStatuses((prev) => prev.map((s) => (s.id === id ? { ...s, color: newColor } : s)));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        Configure workflow stages and their badge colors.
      </p>

      {/* Add row */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="New status name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className={inputCls}
        />
        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5">
          <FaPalette className="text-gray-400 text-sm" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
            title="Pick color"
          />
        </div>
        <button
          onClick={add}
          disabled={!name.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition"
        >
          <FaPlus className="text-xs" /> Add
        </button>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2">
        {statuses.map((status) => (
          <li
            key={status.id}
            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Inline color picker on the dot */}
              <label className="cursor-pointer relative flex-shrink-0" title="Change color">
                <span
                  className="w-4 h-4 rounded-full block border border-white shadow-sm"
                  style={{ backgroundColor: status.color }}
                />
                <input
                  type="color"
                  value={status.color}
                  onChange={(e) => updateColor(status.id, e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
              <span className="text-sm font-medium text-gray-700">{status.name}</span>
              {/* Badge preview */}
              <span
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: status.color + "22",
                  color: status.color,
                  border: `1px solid ${status.color}44`,
                }}
              >
                {status.name}
              </span>
            </div>
            <button
              onClick={() => remove(status.id)}
              className="text-gray-300 hover:text-red-400 transition p-1 rounded ml-2"
              title="Remove status"
            >
              <FaTrash className="text-xs" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────

const CreationsPanel = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("roles");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Creations</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage system variables — roles, issue types, and workflow statuses.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "roles"    && <RolesTab />}
          {activeTab === "types"    && <TypesTab />}
          {activeTab === "statuses" && <StatusesTab />}
        </div>
      </div>
    </div>
  );
};

export default CreationsPanel;
