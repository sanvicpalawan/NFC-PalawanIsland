import { NextResponse } from "next/server";
import { getCurrentAdmin, canPerformAction, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await db.select().from(products).orderBy(asc(products.sortOrder));
    return NextResponse.json({ products: list });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
    const {
      name,
      slug,
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
    } = body;

    if (!name || !description || !category) {
      return NextResponse.json({ error: "Name, category, and description are required" }, { status: 400 });
    }

    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

    const [created] = await db
      .insert(products)
      .values({
        name: String(name).trim(),
        slug: cleanSlug,
        category: String(category).trim(),
        tagline: tagline || null,
        description: String(description).trim(),
        imageUrl: imageUrl || "/images/merqato-product-tags.jpg",
        galleryUrls: Array.isArray(galleryUrls) ? galleryUrls : [imageUrl || "/images/merqato-product-tags.jpg"],
        dimensions: dimensions || null,
        materials: materials || null,
        operatingRange: operatingRange || null,
        chipType: chipType || "NXP NTAG213",
        waterproofRating: waterproofRating || "IP67",
        applications: Array.isArray(applications) ? applications : [],
        variants: Array.isArray(variants) ? variants : [],
        specSheetUrl: specSheetUrl || null,
        isFeatured: Boolean(isFeatured),
        sortOrder: 10,
        status: status || "published",
      })
      .returning();

    await logAudit({
      adminEmail: admin.email,
      adminName: admin.name,
      action: "create",
      entityType: "product",
      entityId: String(created.id),
      details: `Created new product '${created.name}' (${created.category}).`,
    });

    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
