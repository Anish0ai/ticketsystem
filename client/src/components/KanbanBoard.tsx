import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft, FaChevronRight,
  FaBug, FaRocket, FaCog, FaStar,
  FaGlobe, FaMobileAlt, FaDesktop, FaPlug,
} from "react-icons/fa";
import { useTickets } from "../context/TicketContext";
import type { Ticket } from "../services/api";

// ─── Status pipeline ──────────────────────────────────────

const STATUSES = ["Open", "InProgress", "Review", "Closed"] as const;
type Status = typeof STATUSES[number];

const columnConfig: Record<Status, { label: string; headerBg: string; headerText: string; dot: string }> = {
  Open:       { label: "Open",        headerBg: "bg-blue-50",   headerText: "text-blue-700",   dot: "bg-blue-400"   },
  InProgress: { label: "In Progress", headerBg: "bg-orange-50", headerText: "text-orange-700", dot: "bg-orange-400" },
  Review:     { label: "In Review",   headerBg: "bg-cyan-50",   headerText: "text-cyan-700",   dot: "bg-cyan-400"   },
  Closed:     { label: "Closed",      headerBg: "bg-gray-50",   headerText: "text-gray-600",   dot: "bg-gray-400"   },
};

// ─── Type / Platform config ───────────────────────────────

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Bug:         { icon: <FaBug className="text-[9px]" />,    color: "text-red-600 bg-red-50 border-red-200"           },
  Enhancement: { icon: <FaRocket className="text-[9px]" />, color: "text-purple-600 bg-purple-50 border-purple-200"  },
  Task:        { icon: <FaCog className="text-[9px]" />,    color: "text-blue-600 bg-blue-50 border-blue-200"        },
  Feature:     { icon: <FaStar className="text-[9px]" />,   color: "text-emerald-600 bg-emerald-50 border-emerald-200"},
};

const platformIcons: Record<string, React.ReactNode> = {
  Web:     <FaGlobe className="text-[9px]" />,
  Mobile:  <FaMobileAlt className="text-[9px]" />,
  Desktop: <FaDesktop className="text-[9px]" />,
  API:     <FaPlug className="text-[9px]" />,
};

const priorityDot: Record<string, string> = {
  Low: "bg-green-400", Medium: "bg-yellow-400", High: "bg-red-400",
};

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500",  "bg-cyan-500",
];
const avatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

// ─── Kanban Card ──────────────────────────────────────────

interface CardProps {
  ticket: Ticket;
  onMove: (id: number, direction: "prev" | "next") => void;
  moving: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const KanbanCard = ({ ticket, onMove, moving, isFirst, isLast }: CardProps) => {
  const typeCfg = typeConfig[ticket.type] || typeConfig.Task;

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-col gap-2 transition-opacity ${moving ? "opacity-50" : ""}`}>
      {/* Top: ID + type tag */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-gray-400">#{ticket.id}</span>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded border ${typeCfg.color}`}>
          {typeCfg.icon} {ticket.type}
        </span>
      </div>

      {/* Title — links to detail */}
      <Link
        to={`/tickets/${ticket.id}`}
        className="text-xs font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
      >
        {ticket.title}
      </Link>

      {/* Platform + priority */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-500">
          {platformIcons[ticket.platform] || platformIcons.Web}
          {ticket.platform}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
          <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[ticket.priority] || "bg-gray-300"}`} />
          {ticket.priority}
        </span>
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50">
        {ticket.assignedTo ? (
          <>
            <div className={`w-5 h-5 rounded-full ${avatarColor(ticket.assignedTo.name)} flex items-center justify-center text-white text-[9px] font-bold`}>
              {ticket.assignedTo.name.charAt(0)}
            </div>
            <span className="text-[10px] text-gray-500 truncate">{ticket.assignedTo.name}</span>
          </>
        ) : (
          <span className="text-[10px] text-gray-300 italic">Unassigned</span>
        )}

        {/* Move buttons */}
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => onMove(ticket.id, "prev")}
            disabled={isFirst || moving}
            title="Move left"
            className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500"
          >
            <FaChevronLeft className="text-[8px]" />
          </button>
          <button
            onClick={() => onMove(ticket.id, "next")}
            disabled={isLast || moving}
            title="Move right"
            className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500"
          >
            <FaChevronRight className="text-[8px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Column ───────────────────────────────────────────────

const Column = ({
  status, tickets, onMove, movingId,
}: {
  status: Status;
  tickets: Ticket[];
  onMove: (id: number, direction: "prev" | "next") => void;
  movingId: number | null;
}) => {
  const cfg = columnConfig[status];
  const idx = STATUSES.indexOf(status);

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 ${cfg.headerBg}`}>
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-semibold ${cfg.headerText}`}>{cfg.label}</span>
        <span className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/70 ${cfg.headerText}`}>
          {tickets.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1">
        {tickets.length === 0 ? (
          <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-gray-100 text-xs text-gray-300">
            No tickets
          </div>
        ) : (
          tickets.map((t) => (
            <KanbanCard
              key={t.id}
              ticket={t}
              onMove={onMove}
              moving={movingId === t.id}
              isFirst={idx === 0}
              isLast={idx === STATUSES.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────

const Skeleton = () => (
  <div className="grid grid-cols-4 gap-4">
    {STATUSES.map((s) => (
      <div key={s} className="animate-pulse">
        <div className="h-9 bg-gray-100 rounded-xl mb-3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 mb-2 h-24" />
        ))}
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────

const KanbanBoard = () => {
  const { tickets, loading, patchTicket } = useTickets();
  const [movingId, setMovingId] = useState<number | null>(null);

  const handleMove = async (id: number, direction: "prev" | "next") => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;

    const currentIdx = STATUSES.indexOf(ticket.status as Status);
    const nextIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx < 0 || nextIdx >= STATUSES.length) return;

    const newStatus = STATUSES[nextIdx];
    setMovingId(id);
    try {
      await patchTicket(id, { status: newStatus });
    } finally {
      setMovingId(null);
    }
  };

  // Group tickets by status
  const columns = STATUSES.reduce<Record<Status, Ticket[]>>(
    (acc, s) => ({ ...acc, [s]: [] }),
    {} as Record<Status, Ticket[]>
  );
  tickets.forEach((t) => {
    const s = t.status as Status;
    if (columns[s]) columns[s].push(t);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Loading…" : `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""} across ${STATUSES.length} columns`}
        </p>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUSES.map((s) => (
            <Column
              key={s}
              status={s}
              tickets={columns[s]}
              onMove={handleMove}
              movingId={movingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
