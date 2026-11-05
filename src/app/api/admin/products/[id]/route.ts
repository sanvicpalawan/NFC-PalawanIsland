import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
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
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const existing = await db.select().from(products).where(eq(products.id, productId)).limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      name,
      category,
      tagline,
      description,
      imageUrl,
      galleryUrls,
      dimensions,
      materials,
      operatingRange,
      chipType,
      waterproofRating,
      applications,
      variants,
      specSheetUrl,
      isFeatured,
      status,
      sortOrder,
    } = body;

    await db
      .update(products)
      .set({
        name: name ? String(name).trim() : existing[0].name,
        category: category !== undefined ? category : existing[0].category,
        tagline: tagline !== undefined ? tagline : existing[0].tagline,
        description: description ? String(description).trim() : existing[0].description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl,
        galleryUrls: galleryUrls !== undefined ? galleryUrls : existing[0].galleryUrls,
        dimensions: dimensions !== undefined ? dimensions : existing[0].dimensions,
        materials: materials !== undefined ? materials : existing[0].materials,
        operatingRange: operatingRange !== undefined ? operatingRange : existing[0].operatingRange,
        chipType: chipType !== undefined ? chipType : existing[0].chipType,
        waterproofRating: waterproofRating !== undefined ? waterproofRating : existing[0].waterproofRating,
        applications: applications !== undefined ? applications : existing[0].applications,
        variants: variants !== undefined ? variants : existing[0].variants,
        specSheetUrl: specSheetUrl !== undefined ? specSheetUrl : existing[0].specSheetUrl,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing[0].isFeatured,
        status: status !== undefined ? status : existing[0].status,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing[0].sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "update",
      entityType: "product",
      entityId: String(productId),
      details: `Updated product '${name || existing[0].name}'.`,
    });

    const [updated] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const existing = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, productId));

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "delete",
      entityType: "product",
      entityId: String(productId),
      details: `Deleted product '${existing[0].name}' (${existing[0].slug}).`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
