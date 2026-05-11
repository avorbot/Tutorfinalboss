"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  maxStudents: number;
  sessionType: string;
  status: string;
  _count: { enrollments: number };
}

export default function TutorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    price: "",
    currency: "UGX",
    duration: "60",
    maxStudents: "1",
    sessionType: "one-on-one",
  });

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/auth/me").then((r) => r.json());
      if (me.user) {
        const res = await fetch(`/api/sessions?tutorId=${me.user.id}`);
        const data = await res.json();
        setSessions(data.sessions || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        maxStudents: parseInt(form.maxStudents),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setSessions([data.session, ...sessions]);
      setShowForm(false);
      setForm({ title: "", subject: "", description: "", price: "", currency: "UGX", duration: "60", maxStudents: "1", sessionType: "one-on-one" });
    }
    setSaving(false);
  }

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics", "History", "Geography", "French", "Kiswahili", "Literature", "Business Studies", "Music", "Art"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your tutoring sessions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "+ New Session"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-6 border-indigo-200 bg-indigo-50/30">
          <h2 className="font-semibold text-gray-900 mb-4">Create New Session</h2>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Title *</label>
              <input className="input" placeholder="e.g. Advanced Mathematics Tutoring" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <select className="input" value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                <option value="">Select subject</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input h-20 resize-none" placeholder="Describe what students will learn..."
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <div className="flex gap-2">
                <select className="input w-28" value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  <option>UGX</option>
                  <option>USD</option>
                  <option>KES</option>
                </select>
                <input className="input" type="number" placeholder="50000" min="0" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <select className="input" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
              <select className="input" value={form.sessionType}
                onChange={(e) => setForm({ ...form, sessionType: e.target.value })}>
                <option value="one-on-one">One-on-One</option>
                <option value="group">Group</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
              <input className="input" type="number" min="1" max="50" value={form.maxStudents}
                onChange={(e) => setForm({ ...form, maxStudents: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? "Creating..." : "Create Session"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="font-semibold text-gray-900 mb-2">No sessions yet</h3>
          <p className="text-gray-400 text-sm mb-4">Create your first session and start teaching!</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Create First Session
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <div key={s.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="badge bg-blue-100 text-blue-700 text-xs">{s.subject}</span>
                <span className="badge bg-gray-100 text-gray-600 text-xs">{s.sessionType}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{s.description || "No description"}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                <div>⏱ {s.duration} mins</div>
                <div>👥 {s._count.enrollments}/{s.maxStudents} students</div>
              </div>
              <div className="font-semibold text-indigo-600">{formatCurrency(s.price, s.currency)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
