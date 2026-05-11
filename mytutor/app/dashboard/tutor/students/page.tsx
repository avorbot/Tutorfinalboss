import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function TutorStudentsPage() {
  const session = await getSession();
  if (!session || session.role !== "tutor") redirect("/dashboard");

  const enrollments = await prisma.enrollment.findMany({
    where: { session: { tutorId: session.id } },
    include: {
      student: { select: { name: true, email: true } },
      session: { select: { title: true, subject: true, price: true, currency: true } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const uniqueStudents = new Map<string, typeof enrollments[number]>();
  enrollments.forEach((e) => {
    if (!uniqueStudents.has(e.studentId)) uniqueStudents.set(e.studentId, e);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-500 text-sm mt-1">{uniqueStudents.size} students enrolled across all sessions</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="font-semibold text-gray-900 mb-2">No students yet</h3>
          <p className="text-gray-400 text-sm">Create sessions and students will start enrolling</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Student</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Session</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Subject</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-xs">
                          {e.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{e.student.name}</div>
                          <div className="text-xs text-gray-400">{e.student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{e.session.title}</td>
                    <td className="px-6 py-4">
                      <span className="badge bg-blue-100 text-blue-700 text-xs">{e.session.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${e.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{formatDate(e.enrolledAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
