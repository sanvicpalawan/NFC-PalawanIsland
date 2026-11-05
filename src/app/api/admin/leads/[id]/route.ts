import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { leads } from "@/db/schema";
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
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const existing = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const currentLead = existing[0];
    const updateData: Partial<typeof leads.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.status) {
      updateData.status = body.status;
    }

    if (body.newNote) {
      const currentNotes = (currentLead.notes as Array<{ author: string; text: string; createdAt: string }>) || [];
      updateData.notes = [
        ...currentNotes,
        {
          author: admin.name,
          text: String(body.newNote).trim(),
          createdAt: new Date().toISOString(),
        },
      ];
    }

    await db.update(leads).set(updateData).where(eq(leads.id, leadId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "update",
      entityType: "lead",
      entityId: String(leadId),
      details: `Updated lead for ${currentLead.businessName} (status: ${body.status || currentLead.status}).`,
    });

    const [updated] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
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
  const leadId = parseInt(id, 10);
  if (isNaN(leadId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const existing = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await db.delete(leads).where(eq(leads.id, leadId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "delete",
      entityType: "lead",
      entityId: String(leadId),
      details: `Deleted lead inquiry from ${existing[0].businessName} (${existing[0].email}).`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
