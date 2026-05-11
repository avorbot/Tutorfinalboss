import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth || auth.role !== "student") {
    return NextResponse.json({ error: "Only students can book sessions" }, { status: 401 });
  }

  try {
    const { sessionId, scheduledAt, notes } = await req.json();

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { studentId_sessionId: { studentId: auth.id, sessionId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this session" }, { status: 409 });
    }

    const [enrollment, booking] = await prisma.$transaction([
      prisma.enrollment.create({
        data: { studentId: auth.id, sessionId },
      }),
      prisma.booking.create({
        data: {
          studentId: auth.id,
          sessionId,
          scheduledAt: new Date(scheduledAt),
          notes: notes || "",
        },
      }),
    ]);

    return NextResponse.json({ enrollment, booking }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { studentId: auth.id },
    include: {
      session: {
        include: { tutor: { select: { name: true, avatar: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
