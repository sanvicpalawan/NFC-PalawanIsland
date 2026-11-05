import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { industries } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(industries).orderBy(asc(industries.sortOrder));
    return NextResponse.json({ industries: list });
  } catch (error) {
    console.error("Industries GET error:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
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
    const { name, slug, tagline, description, icon, imageUrl, isPrimary, benefits, exampleDeployments, status } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const [created] = await db
      .insert(industries)
      .values({
        name: String(name).trim(),
        slug: cleanSlug,
        tagline: tagline || null,
        description: String(description).trim(),
        icon: icon || "Layers",
        imageUrl: imageUrl || "/images/merqato-hero-tap.jpg",
        isPrimary: Boolean(isPrimary),
        sortOrder: 10,
        status: status || "published",
        benefits: Array.isArray(benefits) ? benefits : [],
        exampleDeployments: Array.isArray(exampleDeployments) ? exampleDeployments : [],
      })
      .returning();

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "create",
      entityType: "industry",
      entityId: String(created.id),
      details: `Created new industry '${created.name}' (${created.slug}).`,
    });

    return NextResponse.json({ success: true, industry: created });
  } catch (error) {
    console.error("Industry POST error:", error);
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}
