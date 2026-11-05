import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { useCases } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(useCases).orderBy(asc(useCases.sortOrder));
    return NextResponse.json({ useCases: list });
  } catch (error) {
    console.error("Use cases GET error:", error);
    return NextResponse.json({ error: "Failed to fetch use cases" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPerformAction(admin.role, "create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, slug, subtitle, description, icon, imageUrl, industrySlugs, features, benefits, demoType, isHospitalityFeature, status } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const [created] = await db
      .insert(useCases)
      .values({
        title: String(title).trim(),
        slug: cleanSlug,
        subtitle: subtitle || null,
        description: String(description).trim(),
        icon: icon || "Zap",
        imageUrl: imageUrl || "/images/nfc-palawan-island-hospitality-portal.jpg",
        industrySlugs: Array.isArray(industrySlugs) ? industrySlugs : ["hospitality"],
        features: Array.isArray(features) ? features : [],
        benefits: Array.isArray(benefits) ? benefits : [],
        demoType: demoType || "portal",
        isHospitalityFeature: Boolean(isHospitalityFeature),
        sortOrder: 10,
        status: status || "published",
      })
      .returning();

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "create",
      entityType: "use_case",
      entityId: String(created.id),
      details: `Created new use case '${created.title}'.`,
    });

    return NextResponse.json({ success: true, useCase: created });
  } catch (error) {
    console.error("Use case POST error:", error);
    return NextResponse.json({ error: "Failed to create use case" }, { status: 500 });
  }
}
