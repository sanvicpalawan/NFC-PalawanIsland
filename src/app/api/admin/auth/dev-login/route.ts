import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken, isAuthBypassed } from "@/lib/auth";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Development convenience: signs straight into the admin area when
 * ADMIN_AUTH_DISABLED=true. Refuses to run in production or when the bypass
 * flag is off, so the normal login flow is always preserved.
 */
export async function GET() {
  if (!isAuthBypassed()) {
    return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  }

  let user = {
    id: 0,
    email: "dev@localhost",
    name: "Development Session",
    role: "owner" as const,
  };

  // Prefer a real seeded owner account so records are attributed correctly.
  try {
    const rows = await db.select().from(admins).orderBy(asc(admins.id)).limit(1);
    if (rows[0]) {
      user = {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        role: (rows[0].role as typeof user.role) ?? "owner",
      };
    }
  } catch {
    // Database not reachable yet — fall back to the placeholder identity.
  }

  const response = NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  response.cookies.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
