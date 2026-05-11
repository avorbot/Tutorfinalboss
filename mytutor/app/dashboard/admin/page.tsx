import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard");

  const [totalUsers, totalTutors, totalStudents, totalSessions, totalBookings, recentUsers, pendingTutors] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "tutor" } }),
      prisma.user.count({ where: { role: "student" } }),
      prisma.session.count(),
      prisma.booking.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.tutorProfile.findMany({
        where: { verified: false },
        take: 5,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: "👥", color: "bg-indigo-50 text-indigo-700", border: "border-indigo-100" },
    { label: "Tutors", value: totalTutors, icon: "👨‍🏫", color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
    { label: "Students", value: totalStudents, icon: "🎓", color: "bg-green-50 text-green-700", border: "border-green-100" },
    { label: "Sessions", value: totalSessions, icon: "📅", color: "bg-orange-50 text-orange-700", border: "border-orange-100" },
    { label: "Bookings", value: totalBookings, icon: "✅", color: "bg-purple-50 text-purple-700", border: "border-purple-100" },
  ];

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    tutor: "bg-blue-100 text-blue-700",
    student: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`card border ${s.border}`}>
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Tutor Verification */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Tutor Approvals</h2>
            <span className="badge bg-orange-100 text-orange-700">{pendingTutors.length} pending</span>
          </div>
          {pendingTutors.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm">All tutors verified</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTutors.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{t.user.name}</div>
                    <div className="text-xs text-gray-500">{t.user.email}</div>
                  </div>
                  <form action={`/api/admin/users`} method="POST">
                    <VerifyButton tutorProfileId={t.userId} />
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Registrations</h2>
            <a href="/dashboard/admin/users" className="text-xs text-indigo-600 hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                  <div className="text-xs text-gray-400">{formatDate(u.createdAt)}</div>
                </div>
                <span className={`badge text-xs ${roleColors[u.role]}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 card">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/admin/users", label: "Manage Users", icon: "👥", color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700" },
            { href: "/dashboard/admin/tutors", label: "Review Tutors", icon: "👨‍🏫", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
            { href: "/dashboard/admin/sessions", label: "All Sessions", icon: "📅", color: "bg-green-50 hover:bg-green-100 text-green-700" },
            { href: "/dashboard/admin/students", label: "Students", icon: "🎓", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 transition-colors ${action.color}`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function VerifyButton({ tutorProfileId }: { tutorProfileId: string }) {
  return (
    <span className="badge bg-green-100 text-green-700 cursor-pointer text-xs">
      Pending Verification
    </span>
  );
}
