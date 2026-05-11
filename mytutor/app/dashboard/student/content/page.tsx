"use client";

import { useState, useEffect } from "react";
import { Video, Link as LinkIcon, FileText, ClipboardText, CheckCircle } from "@phosphor-icons/react";

interface Submission {
  id: string;
  title: string;
  type: string;
  direction: string;
  content: string;
  description: string;
  createdAt: string;
  submittedBy: { name: string };
  session?: { title: string; subject: string } | null;
}

const typeIcons: Record<string, React.ElementType> = {
  video: Video, link: LinkIcon, document: FileText, assignment: ClipboardText,
};

const typeColors: Record<string, string> = {
  video:      "from-red-500 to-pink-600",
  link:       "from-blue-500 to-cyan-600",
  document:   "from-orange-500 to-amber-600",
  assignment: "from-purple-500 to-indigo-600",
};

export default function StudentContentPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((d) => { setSubmissions(d.submissions || []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Learning Content</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Resources shared by your tutors — approved and verified by our admin team.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)]">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle size={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
          <p className="text-[var(--text-muted)]">No approved content yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((sub) => {
            const Icon = typeIcons[sub.type] || FileText;
            const grad = typeColors[sub.type] || "from-blue-500 to-indigo-600";
            return (
              <a
                key={sub.id}
                href={sub.content}
                target="_blank"
                rel="noopener noreferrer"
                className="card-neon block hover:no-underline group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} weight="fill" className="text-white" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--neon-blue)] transition-colors">
                  {sub.title}
                </h3>
                {sub.description && (
                  <p className="text-xs text-[var(--text-muted)] mb-2 line-clamp-2">{sub.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-3">
                  <span className="capitalize">{sub.type}</span>
                  <span>by {sub.submittedBy.name}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
