import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") || "pending";

    const submissions = await prisma.contentSubmission.findMany({
      where: { status },
      include: {
        submittedBy: { select: { id: true, name: true, email: true, role: true } },
        session: { select: { title: true, subject: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingCount = await prisma.contentSubmission.count({ where: { status: "pending" } });

    return NextResponse.json({ submissions, pendingCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
