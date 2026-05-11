import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/dashboard");

  const [enrollments, totalTutors, recentBookings] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: session.id },
      include: {
        session: {
          include: { tutor: { select: { name: true } }, tutorProfile: { select: { rating: true } } },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.user.count({ where: { role: "tutor" } }),
    prisma.booking.findMany({
      where: { studentId: session.id },
      include: {
        session: { include: { tutor: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };

  const bookingStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {session.name} 🎓</h1>
        <p className="text-gray-500 text-sm mt-1">Your learning journey at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Enrolled Sessions", value: enrollments.length, icon: "📅", color: "bg-blue-50 text-blue-700" },
          { label: "Active Sessions", value: enrollments.filter((e) => e.status === "active").length, icon: "✅", color: "bg-green-50 text-green-700" },
          { label: "Completed", value: enrollments.filter((e) => e.status === "completed").length, icon: "🏆", color: "bg-purple-50 text-purple-700" },
          { label: "Tutors Available", value: totalTutors, icon: "👨‍🏫", color: "bg-orange-50 text-orange-700" },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA if no enrollments */}
      {enrollments.length === 0 && (
        <div className="mb-6 card border-2 border-dashed border-indigo-200 text-center py-10">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-2">Start your learning journey</h3>
          <p className="text-gray-400 text-sm mb-4">Browse our qualified tutors and book your first session</p>
          <Link href="/dashboard/student/tutors" className="btn btn-primary">
            Find a Tutor →
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Sessions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Enrolled Sessions</h2>
            <Link href="/dashboard/student/sessions" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {enrollments.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">No sessions enrolled yet</div>
          ) : (
            <div className="space-y-3">
              {enrollments.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-700">
                    {e.session.subject.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{e.session.title}</div>
                    <div className="text-xs text-gray-400">with {e.session.tutor.name}</div>
                  </div>
                  <span className={`badge text-xs ${statusColors[e.status] || "bg-gray-100 text-gray-600"}`}>
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upcoming Bookings</h2>
            <Link href="/dashboard/student/sessions" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-gray-400 text-sm mb-3">No bookings yet</p>
              <Link href="/dashboard/student/tutors" className="btn btn-primary text-xs py-2 px-4">
                Book a Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                  <span className="text-2xl">📅</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{b.session.title}</div>
                    <div className="text-xs text-gray-400">{formatDate(b.scheduledAt)} · {b.session.tutor.name}</div>
                  </div>
                  <span className={`badge text-xs ${bookingStatusColors[b.status] || "bg-gray-100 text-gray-600"}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Browse tutors CTA */}
      <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Ready to learn something new?</h3>
            <p className="text-indigo-200 text-sm mt-1">Browse {totalTutors} qualified tutors across all subjects</p>
          </div>
          <Link
            href="/dashboard/student/tutors"
            className="btn bg-white text-indigo-600 hover:bg-indigo-50 whitespace-nowrap"
          >
            Browse Tutors →
          </Link>
        </div>
      </div>
    </div>
  );
}
