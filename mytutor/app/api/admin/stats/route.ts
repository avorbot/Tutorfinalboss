import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalUsers, totalTutors, totalStudents, totalSessions, totalBookings, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "tutor" } }),
      prisma.user.count({ where: { role: "student" } }),
      prisma.session.count(),
      prisma.booking.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

  return NextResponse.json({
    stats: { totalUsers, totalTutors, totalStudents, totalSessions, totalBookings },
    recentUsers,
  });
}
