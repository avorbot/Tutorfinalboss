import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get("tutorId");

  const sessions = await prisma.session.findMany({
    where: {
      status: "active",
      ...(tutorId ? { tutorId } : {}),
    },
    include: {
      tutor: { select: { id: true, name: true, avatar: true } },
      tutorProfile: { select: { rating: true, subjects: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth || auth.role !== "tutor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, subject, description, duration, price, currency, maxStudents, sessionType } =
      await req.json();

    const session = await prisma.session.create({
      data: {
        tutorId: auth.id,
        title,
        subject,
        description: description || "",
        duration: duration || 60,
        price,
        currency: currency || "UGX",
        maxStudents: maxStudents || 1,
        sessionType: sessionType || "one-on-one",
      },
    });

    return NextResponse.json({ session }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
