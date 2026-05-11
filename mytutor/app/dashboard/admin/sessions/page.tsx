import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminSessionsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard");

  const sessions = await prisma.session.findMany({
    include: {
      tutor: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Sessions</h1>
        <p className="text-gray-500 text-sm mt-1">{sessions.length} sessions on the platform</p>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Session</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Tutor</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Students</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{s.title}</div>
                    <div className="text-xs text-gray-400">{s.subject} · {s.duration} mins</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.tutor.name}</td>
                  <td className="px-6 py-4 font-medium text-indigo-600">{formatCurrency(s.price, s.currency)}</td>
                  <td className="px-6 py-4">
                    <span className="badge bg-green-100 text-green-700">{s._count.enrollments}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions.length === 0 && (
            <div className="text-center py-12 text-gray-400">No sessions yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
