"use client";

import { useState, useEffect } from "react";
import { PaperPlaneTilt, Clock, CheckCircle, XCircle, Video, Link as LinkIcon, FileText, ClipboardText } from "@phosphor-icons/react";

interface Submission {
  id: string;
  title: string;
  type: string;
  direction: string;
  content: string;
  description: string;
  status: string;
  createdAt: string;
}

const typeOptions = [
  { value: "video",      label: "Video Link",  Icon: Video },
  { value: "link",       label: "Web Link",    Icon: LinkIcon },
  { value: "document",   label: "Document",    Icon: FileText },
  { value: "assignment", label: "Assignment",  Icon: ClipboardText },
];

const statusIcon = {
  pending:  <Clock size={14} className="text-amber-500" />,
  approved: <CheckCircle size={14} className="text-emerald-500" weight="fill" />,
  rejected: <XCircle size={14} className="text-red-500" weight="fill" />,
};

export default function TutorContentPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "video", title: "", content: "", description: "", direction: "tutor_to_student" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function loadSubmissions() {
    const res = await fetch("/api/submissions");
    const data = await res.json();
    setSubmissions(data.submissions || []);
    setLoading(false);
  }

  useEffect(() => { loadSubmissions(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    setSending(true);
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error || "Failed to submit"); return; }
    setSuccess("Content submitted for admin review!");
    setForm({ type: "video", title: "", content: "", description: "", direction: "tutor_to_student" });
    loadSubmissions();
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Content</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Upload videos, links, or assignments for your students. All content must be approved by an admin before students can see it.
        </p>
      </div>

      {/* Submit form */}
      <div className="card-neon">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Submit New Content</h2>

        {/* Type selector */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {typeOptions.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, type: value })}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                form.type === value
                  ? "border-[var(--neon-blue)] text-[var(--neon-blue)] bg-blue-50 dark:bg-blue-950/20"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--neon-blue)]/50"
              }`}
            >
              <Icon size={20} weight={form.type === value ? "fill" : "regular"} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Direction</label>
            <select className="input" value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
              <option value="tutor_to_student">Tutor → Student (share resource)</option>
              <option value="student_to_tutor">Student → Tutor (student submitted)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Title</label>
            <input type="text" className="input" placeholder="e.g. Quadratic Equations Explained" required
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {form.type === "link" || form.type === "video" ? "URL" : "Content / URL"}
            </label>
            <input type={form.type === "document" ? "text" : "url"} className="input"
              placeholder={form.type === "video" ? "https://youtube.com/watch?v=..." : "https://..."}
              required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description (optional)</label>
            <textarea className="input h-20 resize-none" placeholder="What is this content about?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {error && <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg">{error}</div>}
          {success && <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-2 rounded-lg">{success}</div>}

          <button type="submit" disabled={sending} className="btn btn-primary flex items-center gap-2">
            <PaperPlaneTilt size={16} weight="fill" />
            {sending ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>

      {/* Past submissions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">My Submissions</h2>
        {loading ? (
          <div className="text-center py-8 text-[var(--text-muted)]">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="card text-center py-8 text-[var(--text-muted)]">No submissions yet.</div>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="card flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  {statusIcon[sub.status as keyof typeof statusIcon]}
                  <span className="capitalize text-[var(--text-muted)]">{sub.status}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[var(--text-primary)] truncate">{sub.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{sub.type} · {sub.direction.replace("_", " → ")}</div>
                </div>
                <div className="text-xs text-[var(--text-muted)]">{new Date(sub.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
