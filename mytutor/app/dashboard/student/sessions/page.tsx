import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentSessionsPage() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/dashboard");

  const [enrollments, bookings] = await Promise.all([
    prisma.enrollment.findMany({
      where: { studentId: session.id },
      include: {
        session: {
          include: { tutor: { select: { name: true, email: true } } },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.booking.findMany({
      where: { studentId: session.id },
      include: {
        session: { include: { tutor: { select: { name: true } } } },
      },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
        <p className="text-gray-500 text-sm mt-1">{enrollments.length} enrolled sessions</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
          <p className="text-gray-400 text-sm mb-6">Browse tutors and book your first session to start learning</p>
          <Link href="/dashboard/student/tutors" className="btn btn-primary">
            Find a Tutor →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming bookings */}
          {bookings.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">📅 Upcoming Sessions</h2>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {new Date(b.scheduledAt).getDate()}
                      <span className="sr-only">{formatDate(b.scheduledAt)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{b.session.title}</div>
                      <div className="text-xs text-gray-500">with {b.session.tutor.name} · {formatDate(b.scheduledAt)}</div>
                    </div>
                    <span className={`badge text-xs ${statusColors[b.status]}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All enrollments */}
          <div className="card overflow-hidden p-0">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">All Enrolled Sessions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {enrollments.map((e) => (
                <div key={e.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {e.session.subject.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{e.session.title}</div>
                    <div className="text-xs text-gray-400">
                      {e.session.subject} · with {e.session.tutor.name} · enrolled {formatDate(e.enrolledAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">{formatCurrency(e.session.price, e.session.currency)}</div>
                    <span className={`badge text-xs mt-1 ${statusColors[e.status]}`}>{e.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
