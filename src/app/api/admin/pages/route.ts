import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(pages);
    return NextResponse.json({ pages: list });
  } catch (error) {
    console.error("Pages GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canPerformAction(admin.role, "update")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { slug, title, metaTitle, metaDescription, heroHeadline, heroSubheadline, heroDescription, sectionsContent, status } = body;

    if (!slug) {
      return NextResponse.json({ error: "Page slug is required" }, { status: 400 });
    }

    const existing = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);

    if (existing.length === 0) {
      // create page if doesn't exist
      const [created] = await db
        .insert(pages)
        .values({
          slug,
          title: title || slug,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          heroHeadline: heroHeadline || null,
          heroSubheadline: heroSubheadline || null,
          heroDescription: heroDescription || null,
          sectionsContent: sectionsContent || {},
          status: status || "published",
        })
        .returning();

      await logAudit({
        adminEmail: admin.email,
        adminName: admin.name,
        action: "create",
        entityType: "page",
        entityId: slug,
        details: `Created page '${created.title}'.`,
      });

      return NextResponse.json({ success: true, page: created });
    }

    await db
      .update(pages)
      .set({
        title: title !== undefined ? title : existing[0].title,
        metaTitle: metaTitle !== undefined ? metaTitle : existing[0].metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existing[0].metaDescription,
        heroHeadline: heroHeadline !== undefined ? heroHeadline : existing[0].heroHeadline,
        heroSubheadline: heroSubheadline !== undefined ? heroSubheadline : existing[0].heroSubheadline,
        heroDescription: heroDescription !== undefined ? heroDescription : existing[0].heroDescription,
        sectionsContent: sectionsContent !== undefined ? sectionsContent : existing[0].sectionsContent,
        status: status !== undefined ? status : existing[0].status,
        updatedAt: new Date(),
      })
      .where(eq(pages.slug, slug));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "update",
      entityType: "page",
      entityId: slug,
      details: `Updated page '${title || existing[0].title}'.`,
    });

    const [updated] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    return NextResponse.json({ success: true, page: updated });
  } catch (error) {
    console.error("Page PUT error:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}
