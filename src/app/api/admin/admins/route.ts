import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { admins } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentAdmin();
  if (!current) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db
      .select({
        id: admins.id,
        email: admins.email,
        name: admins.name,
        role: admins.role,
        avatarUrl: admins.avatarUrl,
        createdAt: admins.createdAt,
        lastLoginAt: admins.lastLoginAt,
      })
      .from(admins);

    return NextResponse.json({ admins: list, currentUser: current });
  } catch (error) {
    console.error("Admins GET error:", error);
    return NextResponse.json({ error: "Failed to fetch admin list" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const current = await getCurrentAdmin();
  if (!current) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (current.role !== "owner") {
    return NextResponse.json({ error: "Only the system owner can invite or create new administrators." }, { status: 403 });
  }

  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await db.select().from(admins).where(eq(admins.email, cleanEmail)).limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "An administrator with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [created] = await db
      .insert(admins)
      .values({
        email: cleanEmail,
        passwordHash,
        name: String(name).trim(),
        role: role || "editor",
      })
      .returning({
        id: admins.id,
        email: admins.email,
        name: admins.name,
        role: admins.role,
      });

    await logAudit({
      adminEmail: current.email,
      adminName: current.name,
      action: "create",
      entityType: "admin",
      entityId: String(created.id),
      details: `Created administrator account for ${created.name} (${created.email}) with role '${created.role}'.`,
    });

    return NextResponse.json({ success: true, admin: created });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ error: "Failed to create administrator" }, { status: 500 });
  }
}
