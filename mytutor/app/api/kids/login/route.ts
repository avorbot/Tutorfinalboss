import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mytutor-super-secret-key-2026-change-in-prod"
);

export async function POST(req: NextRequest) {
  try {
    const { avatarId, pin } = await req.json();

    if (!avatarId || !pin) {
      return NextResponse.json({ error: "Avatar and PIN required" }, { status: 400 });
    }

    // Find kids accounts with matching avatarId
    const kidsAccounts = await prisma.kidsAccount.findMany({
      where: { avatarId },
      include: { parent: true },
    });

    if (kidsAccounts.length === 0) {
      return NextResponse.json({ error: "No account found with that character. Try another!" }, { status: 401 });
    }

    // Verify PIN against parent's PIN
    let matchedKid = null;
    for (const kid of kidsAccounts) {
      const pinMatch = await bcrypt.compare(pin, kid.parent.pin);
      if (pinMatch) { matchedKid = kid; break; }
    }

    if (!matchedKid) {
      return NextResponse.json({ error: "Wrong PIN! Try again." }, { status: 401 });
    }

    const token = await new SignJWT({ kidId: matchedKid.id, name: matchedKid.name, avatarId: matchedKid.avatarId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("12h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ kid: { id: matchedKid.id, name: matchedKid.name } });
    response.cookies.set("kids-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
