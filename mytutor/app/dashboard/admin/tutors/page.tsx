import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminTutorsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard");

  const tutors = await prisma.user.findMany({
    where: { role: "tutor" },
    include: {
      tutorProfile: true,
      _count: { select: { tutorSessions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tutors</h1>
        <p className="text-gray-500 text-sm mt-1">{tutors.length} registered tutors</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutors.map((t) => (
          <div key={t.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                {t.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 truncate">{t.name}</span>
                  {t.tutorProfile?.verified && <span className="text-blue-500 text-xs">✓</span>}
                </div>
                <div className="text-xs text-gray-400 truncate">{t.email}</div>
              </div>
              <span className={`badge text-xs ${t.tutorProfile?.verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                {t.tutorProfile?.verified ? "Verified" : "Pending"}
              </span>
            </div>

            <div className="space-y-1.5 text-sm text-gray-500 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Subjects:</span>
                <span className="text-gray-700 text-xs max-w-[60%] text-right truncate">
                  {t.tutorProfile?.subjects || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rate:</span>
                <span className="text-gray-700 font-medium">
                  {t.tutorProfile ? formatCurrency(t.tutorProfile.hourlyRate, t.tutorProfile.currency) + "/hr" : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sessions created:</span>
                <span className="text-gray-700">{t._count.tutorSessions}</span>
              </div>
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="text-gray-700">{t.tutorProfile?.rating.toFixed(1) || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Joined:</span>
                <span>{formatDate(t.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tutors.length === 0 && (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">👨‍🏫</div>
          <p className="text-gray-400">No tutors registered yet</p>
        </div>
      )}
    </div>
  );
}
