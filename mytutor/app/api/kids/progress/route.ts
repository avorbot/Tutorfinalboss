import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mytutor-super-secret-key-2026-change-in-prod"
);

async function getKidFromRequest(req: NextRequest) {
  const token = req.cookies.get("kids-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { kidId: string; name: string; avatarId: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const kidSession = await getKidFromRequest(req);
  if (!kidSession) return NextResponse.json({ kid: null });

  try {
    const kid = await prisma.kidsAccount.findUnique({
      where: { id: kidSession.kidId },
      include: { progress: true },
    });

    return NextResponse.json({ kid });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const kidSession = await getKidFromRequest(req);
  if (!kidSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { subject, stars } = await req.json();

    const pointsToAdd = (stars || 1) * 10;

    await prisma.kidsAccount.update({
      where: { id: kidSession.kidId },
      data: { points: { increment: pointsToAdd } },
    });

    const existing = await prisma.kidsProgress.findFirst({
      where: { kidsAccountId: kidSession.kidId, subject },
    });

    if (existing) {
      await prisma.kidsProgress.update({
        where: { id: existing.id },
        data: {
          lessonsCompleted: { increment: 1 },
          stars: { increment: stars || 1 },
          lastActivity: new Date(),
        },
      });
    } else {
      await prisma.kidsProgress.create({
        data: {
          kidsAccountId: kidSession.kidId,
          subject,
          lessonsCompleted: 1,
          stars: stars || 1,
        },
      });
    }

    return NextResponse.json({ success: true, pointsAdded: pointsToAdd });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
