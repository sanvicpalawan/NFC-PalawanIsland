import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { industries } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPerformAction(admin.role, "update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const industryId = parseInt(id, 10);
  if (isNaN(industryId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const existing = await db.select().from(industries).where(eq(industries.id, industryId)).limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    const { name, tagline, description, icon, imageUrl, isPrimary, benefits, exampleDeployments, status, sortOrder } = body;

    await db
      .update(industries)
      .set({
        name: name ? String(name).trim() : existing[0].name,
        tagline: tagline !== undefined ? tagline : existing[0].tagline,
        description: description ? String(description).trim() : existing[0].description,
        icon: icon !== undefined ? icon : existing[0].icon,
        imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl,
        isPrimary: isPrimary !== undefined ? Boolean(isPrimary) : existing[0].isPrimary,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing[0].sortOrder,
        status: status !== undefined ? status : existing[0].status,
        benefits: benefits !== undefined ? benefits : existing[0].benefits,
        exampleDeployments: exampleDeployments !== undefined ? exampleDeployments : existing[0].exampleDeployments,
        updatedAt: new Date(),
      })
      .where(eq(industries.id, industryId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "update",
      entityType: "industry",
      entityId: String(industryId),
      details: `Updated industry '${name || existing[0].name}'.`,
    });

    const [updated] = await db.select().from(industries).where(eq(industries.id, industryId)).limit(1);
    return NextResponse.json({ success: true, industry: updated });
  } catch (error) {
    console.error("Update industry error:", error);
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPerformAction(admin.role, "delete")) {
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }

  const { id } = await params;
  const industryId = parseInt(id, 10);
  if (isNaN(industryId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const existing = await db.select().from(industries).where(eq(industries.id, industryId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    await db.delete(industries).where(eq(industries.id, industryId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "delete",
      entityType: "industry",
      entityId: String(industryId),
      details: `Deleted industry '${existing[0].name}' (${existing[0].slug}).`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete industry error:", error);
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}
