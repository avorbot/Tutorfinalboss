"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Link as LinkIcon, Video, FileText, ClipboardText } from "@phosphor-icons/react";

interface Submission {
  id: string;
  title: string;
  type: string;
  direction: string;
  content: string;
  description: string;
  status: string;
  createdAt: string;
  submittedBy: { name: string; email: string; role: string };
  session?: { title: string; subject: string } | null;
}

const typeIcons: Record<string, React.ElementType> = {
  video: Video, link: LinkIcon, document: FileText, assignment: ClipboardText,
};

const statusColors: Record<string, string> = {
  pending:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminApprovalsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/submissions?status=${filter}`);
    const data = await res.json();
    setSubmissions(data.submissions || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function handleAction(id: string, action: "approve" | "reject") {
    setActioning(id);
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reviewNote }),
    });
    setReviewNote("");
    setActioning(null);
    load();
  }

  const tabs = ["pending", "approved", "rejected"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Content Approvals</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          All content from tutors and students passes through here before anyone can see it.
        </p>
      </div>

      {/* Tab filter */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === tab
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow"
                : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--neon-blue)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="card text-center py-12 text-[var(--text-muted)]">
          <CheckCircle size={48} className="mx-auto mb-3 opacity-40" />
          No {filter} submissions
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const TypeIcon = typeIcons[sub.type] || FileText;
            return (
              <div key={sub.id} className="card-neon">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(59,130,246,0.1)", color: "var(--neon-blue)" }}>
                    <TypeIcon size={20} weight="duotone" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{sub.title}</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          by <span className="font-medium">{sub.submittedBy.name}</span>{" "}
                          ({sub.submittedBy.role}) · {sub.type} · {sub.direction.replace("_", " → ")}
                          {sub.session && ` · Session: ${sub.session.title}`}
                        </p>
                      </div>
                      <span className={`badge text-xs ${statusColors[sub.status] || ""}`}>
                        {sub.status}
                      </span>
                    </div>

                    {sub.description && (
                      <p className="text-sm text-[var(--text-muted)] mt-2">{sub.description}</p>
                    )}

                    <a
                      href={sub.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-[var(--neon-blue)] hover:underline"
                    >
                      <LinkIcon size={14} /> {sub.content.length > 60 ? sub.content.slice(0, 60) + "…" : sub.content}
                    </a>

                    {sub.status === "pending" && (
                      <div className="mt-4 space-y-2">
                        <textarea
                          placeholder="Optional rejection reason / review note..."
                          className="input text-sm h-16 resize-none"
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(sub.id, "approve")}
                            disabled={actioning === sub.id}
                            className="btn btn-primary flex items-center gap-2 text-sm py-2"
                          >
                            <CheckCircle size={16} weight="fill" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(sub.id, "reject")}
                            disabled={actioning === sub.id}
                            className="btn btn-danger flex items-center gap-2 text-sm py-2"
                          >
                            <XCircle size={16} weight="fill" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

