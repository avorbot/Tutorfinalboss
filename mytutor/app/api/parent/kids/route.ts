import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: session.id },
      include: { kidsAccounts: { orderBy: { createdAt: "asc" } } },
    });

    if (!parentProfile) {
      return NextResponse.json({ kids: [] });
    }

    return NextResponse.json({ kids: parentProfile.kidsAccounts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, age, avatarId, favouriteColor } = await req.json();

    if (!name || !age) {
      return NextResponse.json({ error: "Name and age are required" }, { status: 400 });
    }

    if (age < 1 || age > 12) {
      return NextResponse.json({ error: "Age must be between 1 and 12" }, { status: 400 });
    }

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId: session.id },
    });

    if (!parentProfile) {
      return NextResponse.json({ error: "Parent profile not found. Please complete parent registration." }, { status: 400 });
    }

    const kid = await prisma.kidsAccount.create({
      data: {
        parentId: parentProfile.id,
        name,
        age,
        avatarId: avatarId || "1",
        favouriteColor: favouriteColor || "blue",
      },
    });

    return NextResponse.json({ kid }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
