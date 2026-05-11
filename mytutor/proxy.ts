import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based route guarding
    if (pathname.startsWith("/dashboard/admin") && session.role !== "admin") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, req.url));
    }
    if (pathname.startsWith("/dashboard/tutor") && session.role !== "tutor") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, req.url));
    }
    if (pathname.startsWith("/dashboard/student") && session.role !== "student") {
      return NextResponse.redirect(new URL(`/dashboard/${session.role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
