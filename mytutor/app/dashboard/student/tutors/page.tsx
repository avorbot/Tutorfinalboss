"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

interface Tutor {
  id: string;
  name: string;
  email: string;
  tutorProfile: {
    bio: string;
    subjects: string;
    hourlyRate: number;
    currency: string;
    experience: number;
    education: string;
    verified: boolean;
    rating: number;
    totalReviews: number;
  } | null;
}

interface Session {
  id: string;
  title: string;
  subject: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  sessionType: string;
  _count: { enrollments: number };
}

export default function BrowseTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selected, setSelected] = useState<Tutor | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/tutors")
      .then((r) => r.json())
      .then((data) => { setTutors(data.tutors || []); setLoading(false); });
  }, []);

  async function selectTutor(tutor: Tutor) {
    setSelected(tutor);
    const res = await fetch(`/api/sessions?tutorId=${tutor.id}`);
    const data = await res.json();
    setSessions(data.sessions || []);
  }

  async function handleBook(sessionId: string) {
    setBooking(sessionId);
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 3);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, scheduledAt: scheduledAt.toISOString(), notes: "" }),
    });

    if (res.ok) {
      setBooked(new Set([...booked, sessionId]));
    }
    setBooking(null);
  }

  const filtered = tutors.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.tutorProfile?.subjects || "").toLowerCase().includes(search.toLowerCase())
  );

  const stars = (rating: number) => "⭐".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find a Tutor</h1>
        <p className="text-gray-500 text-sm mt-1">Browse {tutors.length} qualified tutors</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          className="input max-w-md"
          placeholder="Search by name or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tutor list */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading tutors...</div>
          ) : filtered.length === 0 ? (
            <div className="card text-center py-8">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-gray-400 text-sm">No tutors found</p>
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTutor(t)}
                className={`w-full card text-left transition-all hover:shadow-md cursor-pointer ${selected?.id === t.id ? "border-indigo-400 ring-2 ring-indigo-100" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                      {t.tutorProfile?.verified && <span className="text-blue-500 text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate">
                      {t.tutorProfile?.subjects || "No subjects listed"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-500">{stars(t.tutorProfile?.rating || 0)}</span>
                      <span className="text-xs font-medium text-indigo-600">
                        {t.tutorProfile ? formatCurrency(t.tutorProfile.hourlyRate, t.tutorProfile.currency) + "/hr" : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Tutor detail + sessions */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="card text-center py-16">
              <div className="text-4xl mb-3">👈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Select a Tutor</h3>
              <p className="text-gray-400 text-sm">Click on a tutor to see their profile and available sessions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile card */}
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-2xl flex-shrink-0">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                      {selected.tutorProfile?.verified && (
                        <span className="badge bg-blue-100 text-blue-700 text-xs">✓ Verified</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{selected.tutorProfile?.education || "—"}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-yellow-500">{stars(selected.tutorProfile?.rating || 0)}</span>
                      <span className="text-gray-500">{selected.tutorProfile?.experience || 0} yrs experience</span>
                      <span className="font-semibold text-indigo-600">
                        {selected.tutorProfile ? formatCurrency(selected.tutorProfile.hourlyRate, selected.tutorProfile.currency) + "/hr" : "—"}
                      </span>
                    </div>
                    {selected.tutorProfile?.bio && (
                      <p className="text-gray-600 text-sm mt-3 leading-relaxed">{selected.tutorProfile.bio}</p>
                    )}
                    {selected.tutorProfile?.subjects && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {selected.tutorProfile.subjects.split(",").map((s) => (
                          <span key={s} className="badge bg-indigo-50 text-indigo-700 text-xs">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sessions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Available Sessions ({sessions.length})</h3>
                {sessions.length === 0 ? (
                  <div className="card text-center py-8 text-gray-400 text-sm">
                    No sessions available yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((s) => (
                      <div key={s.id} className="card flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{s.title}</span>
                            <span className="badge bg-blue-50 text-blue-700 text-xs">{s.subject}</span>
                            <span className="badge bg-gray-100 text-gray-600 text-xs">{s.sessionType}</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{s.description || "No description"}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>⏱ {s.duration} mins</span>
                            <span>👥 {s._count.enrollments} enrolled</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-indigo-600 mb-2">{formatCurrency(s.price, s.currency)}</div>
                          <button
                            onClick={() => handleBook(s.id)}
                            disabled={booking === s.id || booked.has(s.id)}
                            className={`btn text-xs py-2 px-4 ${booked.has(s.id) ? "btn-secondary text-green-600 border-green-200" : "btn-primary"}`}
                          >
                            {booked.has(s.id) ? "✓ Booked!" : booking === s.id ? "Booking..." : "Book Now"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
