import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const auth = await getSessionFromRequest(req);
  if (!auth || auth.role !== "tutor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  await prisma.tutorProfile.upsert({
    where: { userId: auth.id },
    create: { userId: auth.id, ...data },
    update: data,
  });

  return NextResponse.json({ message: "Profile updated" });
}
