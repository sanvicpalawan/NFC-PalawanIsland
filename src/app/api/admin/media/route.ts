import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { mediaItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await db.select().from(mediaItems).orderBy(desc(mediaItems.createdAt));
    return NextResponse.json({ media: items });
  } catch (error) {
    console.error("Media GET error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
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
    const { fileName, url, altText, category, fileSize, mimeType } = await req.json();

    if (!fileName || !url) {
      return NextResponse.json({ error: "File name and URL are required" }, { status: 400 });
    }

    const [created] = await db
      .insert(mediaItems)
      .values({
        fileName: String(fileName).trim(),
        url: String(url).trim(),
        altText: altText ? String(altText).trim() : null,
        category: category || "product",
        fileSize: fileSize || 120000,
        mimeType: mimeType || "image/jpeg",
      })
      .returning();

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "create",
      entityType: "media",
      entityId: String(created.id),
      details: `Added media item '${created.fileName}' (${created.category}).`,
    });

    return NextResponse.json({ success: true, media: created });
  } catch (error) {
    console.error("Media POST error:", error);
    return NextResponse.json({ error: "Failed to add media" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPerformAction(admin.role, "delete")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    const mediaId = parseInt(id, 10);
    if (isNaN(mediaId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const existing = await db.select().from(mediaItems).where(eq(mediaItems.id, mediaId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    await db.delete(mediaItems).where(eq(mediaItems.id, mediaId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "delete",
      entityType: "media",
      entityId: String(mediaId),
      details: `Deleted media item '${existing[0].fileName}'.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Media DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
