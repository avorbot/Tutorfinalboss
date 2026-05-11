import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      tutorProfile: { select: { verified: true, subjects: true, hourlyRate: true, currency: true, rating: true } },
      _count: { select: { enrollments: true, tutorSessions: true } },
    },
  });

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    tutor: "bg-blue-100 text-blue-700",
    student: "bg-green-100 text-green-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">User</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Details</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Activity</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        <div className="text-gray-400 text-xs">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${roleColors[u.role]}`}>{u.role}</span>
                    {u.role === "tutor" && u.tutorProfile && (
                      <span className={`badge ml-1 ${u.tutorProfile.verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                        {u.tutorProfile.verified ? "✓ Verified" : "Pending"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {u.role === "tutor" && u.tutorProfile ? (
                      <div>
                        <div className="text-xs">{u.tutorProfile.subjects || "No subjects yet"}</div>
                        <div className="text-xs font-medium text-gray-700">
                          {u.tutorProfile.currency} {u.tutorProfile.hourlyRate.toLocaleString()}/hr
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {u.role === "student" ? (
                      <span>{u._count.enrollments} sessions enrolled</span>
                    ) : u.role === "tutor" ? (
                      <span>{u._count.tutorSessions} sessions created</span>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-3xl mb-2">👥</div>
              <p>No users registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
