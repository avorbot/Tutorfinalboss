import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const search = searchParams.get("search");

  const tutors = await prisma.user.findMany({
    where: {
      role: "tutor",
      ...(search ? { name: { contains: search } } : {}),
      tutorProfile: {
        ...(subject ? { subjects: { contains: subject } } : {}),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      tutorProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tutors });
}
