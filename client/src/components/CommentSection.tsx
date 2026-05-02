import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { createComment, type Comment, type User } from "../services/api";

// ─── Helpers ──────────────────────────────────────────────

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500",  "bg-cyan-500",
];
const avatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
};

// ─── Single comment bubble ────────────────────────────────

const CommentBubble = ({ comment }: { comment: Comment }) => (
  <div className="flex gap-3">
    {/* Avatar */}
    <div
      className={`w-8 h-8 rounded-full ${avatarColor(comment.author.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}
    >
      {comment.author.name.charAt(0).toUpperCase()}
    </div>

    {/* Bubble */}
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-gray-800">{comment.author.name}</span>
        <span className="text-[11px] text-gray-400">{formatTime(comment.createdAt)}</span>
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {comment.text}
      </div>
    </div>
  </div>
);

// ─── Props ────────────────────────────────────────────────

interface Props {
  ticketId: number;
  initialComments: Comment[];
  currentUser: User; // the "logged-in" user posting comments
}

// ─── Component ────────────────────────────────────────────

const CommentSection = ({ ticketId, initialComments, currentUser }: Props) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const handlePost = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setPosting(true);
    setError("");
    try {
      const comment = await createComment({
        text: trimmed,
        ticketId,
        authorId: currentUser.id,
      });
      setComments((prev) => [...prev, comment]);
      setText("");
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">
          Comments
        </h2>
        <span className="text-xs text-gray-400">{comments.length}</span>
      </div>

      {/* Feed */}
      <div className="px-5 py-4 flex flex-col gap-5">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">
            No comments yet. Be the first to add one.
          </p>
        ) : (
          comments.map((c) => <CommentBubble key={c.id} comment={c} />)
        )}
      </div>

      {/* Composer */}
      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
        <div className="flex gap-3 items-start">
          {/* Current user avatar */}
          <div
            className={`w-8 h-8 rounded-full ${avatarColor(currentUser.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1`}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment… (Ctrl+Enter to post)"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}

            <div className="flex justify-end mt-2">
              <button
                onClick={handlePost}
                disabled={posting || !text.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition"
              >
                {posting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaPaperPlane className="text-xs" />
                )}
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
