import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { useCases } from "@/db/schema";
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
  const useCaseId = parseInt(id, 10);
  if (isNaN(useCaseId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const existing = await db.select().from(useCases).where(eq(useCases.id, useCaseId)).limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Use case not found" }, { status: 404 });
    }

    const { title, subtitle, description, icon, imageUrl, industrySlugs, features, benefits, demoType, isHospitalityFeature, status, sortOrder } = body;

    await db
      .update(useCases)
      .set({
        title: title ? String(title).trim() : existing[0].title,
        subtitle: subtitle !== undefined ? subtitle : existing[0].subtitle,
        description: description ? String(description).trim() : existing[0].description,
        icon: icon !== undefined ? icon : existing[0].icon,
        imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl,
        industrySlugs: industrySlugs !== undefined ? industrySlugs : existing[0].industrySlugs,
        features: features !== undefined ? features : existing[0].features,
        benefits: benefits !== undefined ? benefits : existing[0].benefits,
        demoType: demoType !== undefined ? demoType : existing[0].demoType,
        isHospitalityFeature: isHospitalityFeature !== undefined ? Boolean(isHospitalityFeature) : existing[0].isHospitalityFeature,
        status: status !== undefined ? status : existing[0].status,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing[0].sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(useCases.id, useCaseId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "update",
      entityType: "use_case",
      entityId: String(useCaseId),
      details: `Updated use case '${title || existing[0].title}'.`,
    });

    const [updated] = await db.select().from(useCases).where(eq(useCases.id, useCaseId)).limit(1);
    return NextResponse.json({ success: true, useCase: updated });
  } catch (error) {
    console.error("Update use case error:", error);
    return NextResponse.json({ error: "Failed to update use case" }, { status: 500 });
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
  const useCaseId = parseInt(id, 10);
  if (isNaN(useCaseId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const existing = await db.select().from(useCases).where(eq(useCases.id, useCaseId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Use case not found" }, { status: 404 });
    }

    await db.delete(useCases).where(eq(useCases.id, useCaseId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "delete",
      entityType: "use_case",
      entityId: String(useCaseId),
      details: `Deleted use case '${existing[0].title}'.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete use case error:", error);
    return NextResponse.json({ error: "Failed to delete use case" }, { status: 500 });
  }
}
