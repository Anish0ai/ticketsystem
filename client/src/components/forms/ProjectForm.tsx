import { useState, type KeyboardEvent } from "react";
import { FaTimes, FaFolderPlus, FaGlobe, FaMobileAlt, FaDesktop, FaPlug, FaTag } from "react-icons/fa";
import { createProject, type Project } from "../../services/api";

// ─── Types ────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

// ─── Platform options ─────────────────────────────────────

const PLATFORMS = [
  { value: "Web", icon: <FaGlobe />, label: "Web" },
  { value: "Mobile", icon: <FaMobileAlt />, label: "Mobile" },
  { value: "Desktop", icon: <FaDesktop />, label: "Desktop" },
  { value: "API", icon: <FaPlug />, label: "API" },
] as const;

// ─── Shared field styles ──────────────────────────────────

const fieldCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelCls = "block text-xs font-medium text-gray-500 mb-1";

// ─── Component ────────────────────────────────────────────

const ProjectForm = ({ onClose, onCreated }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("Web");

  // Tech stack as an array of tags
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Add a tag on Enter or comma
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/,$/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Project name is required.");

    // Flush any pending tag input
    const finalTags = tagInput.trim()
      ? [...tags, tagInput.trim()]
      : tags;

    setSubmitting(true);
    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        platform,
        techStack: finalTags.join(","),
      });
      onCreated(project);
      onClose();
    } catch {
      setError("Failed to create project. Please try again.");
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
              <FaFolderPlus />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">New Project</h2>
              <p className="text-xs text-gray-400">Set up a new project workspace</p>
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
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className={labelCls}>Project Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. E-Commerce Platform"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldCls}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${fieldCls} resize-none`}
            />
          </div>

          {/* Platform — icon toggle buttons */}
          <div>
            <label className={labelCls}>Platform</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(({ value, icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlatform(value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    platform === value
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack tags */}
          <div>
            <label className={labelCls}>
              <span className="flex items-center gap-1">
                <FaTag className="text-[10px]" /> Tech Stack
              </span>
            </label>

            {/* Tag pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-900 ml-0.5"
                      aria-label={`Remove ${tag}`}
                    >
                      <FaTimes className="text-[9px]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Type a tech and press Enter (e.g. React, Node.js)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              className={fieldCls}
            />
            <p className="text-[11px] text-gray-400 mt-1">Press Enter or comma to add each technology</p>
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
            className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg transition flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
