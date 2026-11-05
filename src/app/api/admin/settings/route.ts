import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(siteSettings);
    const settingsMap: Record<string, any> = {};
    for (const item of list) {
      settingsMap[item.key] = item.value;
    }
    return NextResponse.json({ settings: settingsMap, raw: list });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPerformAction(admin.role, "settings")) {
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }

  try {
    const { key, value } = await req.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);

    if (existing.length === 0) {
      await db.insert(siteSettings).values({
        key,
        value,
        description: `Settings for ${key}`,
      });
    } else {
      await db
        .update(siteSettings)
        .set({
          value,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, key));
    }

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "update",
      entityType: "setting",
      entityId: key,
      details: `Updated site setting '${key}'.`,
    });

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
