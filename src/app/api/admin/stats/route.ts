import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/db";
import { leads, products, industries, useCases, pages, auditLogs } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [leadsCount] = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const [productsCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
    const [industriesCount] = await db.select({ count: sql<number>`count(*)` }).from(industries);
    const [useCasesCount] = await db.select({ count: sql<number>`count(*)` }).from(useCases);
    const [pagesCount] = await db.select({ count: sql<number>`count(*)` }).from(pages);

    const recentLeads = await db
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt))
      .limit(5);

    const recentLogs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    return NextResponse.json({
      counts: {
        leads: Number(leadsCount?.count || 0),
        products: Number(productsCount?.count || 0),
        industries: Number(industriesCount?.count || 0),
        useCases: Number(useCasesCount?.count || 0),
        pages: Number(pagesCount?.count || 0),
      },
      recentLeads,
      recentLogs,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
