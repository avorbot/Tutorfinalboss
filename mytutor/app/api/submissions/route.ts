import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { sessionId, direction, type, title, content, description } = await req.json();

    if (!direction || !type || !title || !content) {
      return NextResponse.json({ error: "direction, type, title and content are required" }, { status: 400 });
    }

    const validDirections = ["tutor_to_student", "student_to_tutor"];
    const validTypes = ["video", "link", "document", "assignment"];
    if (!validDirections.includes(direction) || !validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid direction or type" }, { status: 400 });
    }

    const submission = await prisma.contentSubmission.create({
      data: {
        submittedById: session.id,
        sessionId: sessionId || null,
        direction,
        type,
        title,
        content,
        description: description || "",
        status: "pending",
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = req.nextUrl;
    const statusFilter = searchParams.get("status") || undefined;

    let where: Record<string, unknown> = {};

    if (session.role === "tutor") {
      where = { submittedById: session.id };
    } else if (session.role === "student") {
      where = { direction: "tutor_to_student", status: "approved" };
    } else if (session.role === "admin") {
      if (statusFilter) where = { status: statusFilter };
    }

    const submissions = await prisma.contentSubmission.findMany({
      where,
      include: { submittedBy: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
