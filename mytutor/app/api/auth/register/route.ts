import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

function calcAge(dob: string): number {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, dateOfBirth, country, city, educationLevel, phone } =
      await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password and role are required" }, { status: 400 });
    }

    if (!["admin", "tutor", "student"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (dateOfBirth) {
      const age = calcAge(dateOfBirth);
      if (age < 9) {
        return NextResponse.json(
          { error: "Children under 9 cannot register directly. A parent must create a Kids account." },
          { status: 400 }
        );
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        country:        country        || "",
        city:           city           || "",
        educationLevel: educationLevel || "",
        phone:          phone          || "",
        tutorProfile:   role === "tutor"   ? { create: {} } : undefined,
        studentProfile: role === "student" ? { create: {} } : undefined,
      },
    });

    const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role });

    const response = NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
