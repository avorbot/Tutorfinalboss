import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TutorDashboard() {
  const session = await getSession();
  if (!session || session.role !== "tutor") redirect("/dashboard");

  const [user, sessions, recentEnrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
      include: { tutorProfile: true },
    }),
    prisma.session.findMany({
      where: { tutorId: session.id },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.enrollment.findMany({
      where: { session: { tutorId: session.id } },
      include: {
        student: { select: { name: true, email: true } },
        session: { select: { title: true, price: true, currency: true } },
      },
      orderBy: { enrolledAt: "desc" },
      take: 5,
    }),
  ]);

  const totalStudents = await prisma.enrollment.count({
    where: { session: { tutorId: session.id } },
  });

  const totalRevenue = await prisma.enrollment.findMany({
    where: { session: { tutorId: session.id } },
    include: { session: { select: { price: true } } },
  });
  const revenue = totalRevenue.reduce((sum, e) => sum + e.session.price, 0);

  const isProfileComplete = user?.tutorProfile?.bio && user?.tutorProfile?.subjects && user?.tutorProfile?.hourlyRate;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {session.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here&apos;s your teaching overview</p>
      </div>

      {/* Profile completion warning */}
      {!isProfileComplete && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className="font-semibold text-amber-800 text-sm">Complete your profile</div>
            <p className="text-amber-700 text-xs mt-1">Add your bio, subjects, and hourly rate so students can find you.</p>
          </div>
          <Link href="/dashboard/tutor/profile" className="btn btn-secondary text-xs py-1.5 px-3 text-amber-700 border-amber-300">
            Update Profile
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Sessions Created", value: sessions.length, icon: "📅", color: "bg-blue-50 text-blue-700" },
          { label: "Total Students", value: totalStudents, icon: "🎓", color: "bg-green-50 text-green-700" },
          { label: "Rating", value: user?.tutorProfile?.rating.toFixed(1) || "—", icon: "⭐", color: "bg-yellow-50 text-yellow-700" },
          {
            label: "Total Revenue",
            value: formatCurrency(revenue, user?.tutorProfile?.currency || "UGX").split(" ")[1] || "0",
            icon: "💰",
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Sessions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Sessions</h2>
            <Link href="/dashboard/tutor/sessions" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">📚</div>
              <p className="text-gray-400 text-sm mb-3">No sessions yet</p>
              <Link href="/dashboard/tutor/sessions" className="btn btn-primary text-xs py-2 px-4">
                Create First Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{s.title}</div>
                    <div className="text-xs text-gray-400">{s.subject} · {formatCurrency(s.price, s.currency)}/session</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{s._count.enrollments}</div>
                    <div className="text-xs text-gray-400">students</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enrollments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Enrollments</h2>
            <Link href="/dashboard/tutor/students" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {recentEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🎓</div>
              <p className="text-gray-400 text-sm">No students yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnrollments.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-xs">
                    {e.student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{e.student.name}</div>
                    <div className="text-xs text-gray-400 truncate">{e.session.title}</div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {formatCurrency(e.session.price, e.session.currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
