"use client";

import { useState, useEffect } from "react";

export default function TutorProfilePage() {
  const [profile, setProfile] = useState({
    name: "", email: "", bio: "", subjects: "", hourlyRate: "", currency: "UGX", experience: "", education: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => {
        if (user) {
          setProfile({
            name: user.name || "",
            email: user.email || "",
            bio: user.tutorProfile?.bio || "",
            subjects: user.tutorProfile?.subjects || "",
            hourlyRate: user.tutorProfile?.hourlyRate?.toString() || "",
            currency: user.tutorProfile?.currency || "UGX",
            experience: user.tutorProfile?.experience?.toString() || "",
            education: user.tutorProfile?.education || "",
          });
        }
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/tutor/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: profile.bio,
        subjects: profile.subjects,
        hourlyRate: parseFloat(profile.hourlyRate) || 0,
        currency: profile.currency,
        experience: parseInt(profile.experience) || 0,
        education: profile.education,
      }),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const subjectOptions = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science",
    "Economics", "History", "Geography", "French", "Kiswahili", "Literature",
    "Business Studies", "Music", "Art",
  ];

  const selectedSubjects = profile.subjects ? profile.subjects.split(",").map((s) => s.trim()).filter(Boolean) : [];

  function toggleSubject(subject: string) {
    const current = new Set(selectedSubjects);
    if (current.has(subject)) current.delete(subject);
    else current.add(subject);
    setProfile({ ...profile, subjects: Array.from(current).join(", ") });
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Keep your profile updated so students can find you</p>
      </div>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          ✅ Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input className="input bg-gray-50" value={profile.name} disabled />
              <p className="text-xs text-gray-400 mt-1">Name is set during registration</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input className="input bg-gray-50" value={profile.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
              <textarea
                className="input h-28 resize-none"
                placeholder="Tell students about yourself, your teaching style, and experience..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Teaching details */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Teaching Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects You Teach *</label>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      selectedSubjects.includes(subject)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate *</label>
                <div className="flex gap-2">
                  <select
                    className="input w-24"
                    value={profile.currency}
                    onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                  >
                    <option>UGX</option>
                    <option>USD</option>
                    <option>KES</option>
                  </select>
                  <input
                    type="number" min="0" className="input"
                    placeholder="50000"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number" min="0" max="50" className="input"
                  placeholder="5"
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education / Qualifications</label>
              <input
                className="input"
                placeholder="e.g. BSc Mathematics, Makerere University"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary px-8">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
