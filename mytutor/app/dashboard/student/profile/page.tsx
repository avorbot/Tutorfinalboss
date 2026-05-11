"use client";

import { useState, useEffect } from "react";

export default function StudentProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => { setUser(user); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Your account details</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <span className="badge bg-green-100 text-green-700 text-xs mt-1">Student</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
            <div className="input bg-gray-50 text-gray-700">{user?.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
            <div className="input bg-gray-50 text-gray-700">{user?.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
            <div className="input bg-gray-50 text-gray-700 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
