import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSessionToken, logAudit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const adminList = await db
      .select()
      .from(admins)
      .where(eq(admins.email, cleanEmail))
      .limit(1);

    if (adminList.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const admin = adminList[0];
    const passwordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update lastLoginAt
    await db
      .update(admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(admins.id, admin.id));

    // Audit log
    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "login",
      entityType: "admin",
      entityId: String(admin.id),
      details: `Admin logged in successfully with role '${admin.role}'.`,
    });

    const sessionUser = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as "owner" | "admin" | "editor" | "viewer",
    };

    const token = createSessionToken(sessionUser);

    const res = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    res.cookies.set({
      name: "merqato_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
