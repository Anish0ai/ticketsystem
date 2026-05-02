import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFolder,
  FaGlobe,
  FaMobileAlt,
  FaDesktop,
  FaPlug,
  FaTicketAlt,
  FaUsers,
  FaPlus,
} from "react-icons/fa";
import { getProjects, type Project } from "../services/api";
import ProjectForm from "./forms/ProjectForm";

// ─── Helpers ──────────────────────────────────────────────

const platformConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  Web:     { icon: <FaGlobe />,     bg: "bg-blue-50",    text: "text-blue-600"   },
  Mobile:  { icon: <FaMobileAlt />, bg: "bg-purple-50",  text: "text-purple-600" },
  Desktop: { icon: <FaDesktop />,   bg: "bg-amber-50",   text: "text-amber-600"  },
  API:     { icon: <FaPlug />,      bg: "bg-emerald-50", text: "text-emerald-600"},
};

// Deterministic color from project name for the avatar
const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500",  "bg-cyan-500",
];
const avatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

// ─── Skeleton card ────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-xl bg-gray-200" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
    <div className="h-3 bg-gray-100 rounded w-full mb-2" />
    <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
    <div className="flex gap-2">
      <div className="h-5 bg-gray-100 rounded-full w-14" />
      <div className="h-5 bg-gray-100 rounded-full w-16" />
      <div className="h-5 bg-gray-100 rounded-full w-12" />
    </div>
  </div>
);

// ─── Project Card ─────────────────────────────────────────

const ProjectCard = ({ project }: { project: Project }) => {
  const plt = platformConfig[project.platform] || platformConfig.Web;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 p-5 flex flex-col"
    >
      {/* Header: avatar + name + platform badge */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${avatarColor(project.name)} flex items-center justify-center text-white text-lg font-bold flex-shrink-0`}
        >
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-blue-600 transition-colors truncate">
            {project.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${plt.bg} ${plt.text}`}
          >
            {plt.icon}
            {project.platform}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
        {project.description || "No description provided."}
      </p>

      {/* Tech stack tags */}
      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md text-[11px]">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer: ticket + member counts */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <FaTicketAlt className="text-gray-300" />
          {project._count.tickets} ticket{project._count.tickets !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <FaUsers className="text-gray-300" />
          {project._count.members} member{project._count.members !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
};

// ─── Main Component ───────────────────────────────────────

const ProjectDirectory = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleProjectCreated = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
        >
          <FaPlus className="text-xs" />
          New Project
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : projects.length === 0
          ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <FaFolder className="text-5xl mb-3 text-gray-200" />
              <p className="text-sm">No projects yet. Create your first one.</p>
            </div>
          )
          : projects.map((p) => <ProjectCard key={p.id} project={p} />)
        }
      </div>

      {/* New Project Modal */}
      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default ProjectDirectory;
