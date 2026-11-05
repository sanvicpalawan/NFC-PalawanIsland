import { NextResponse } from "next/server";
import { getCurrentAdmin, logAudit } from "@/lib/auth";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { desc, ilike, or, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "";
  const exportCsv = searchParams.get("export") === "true";

  try {
    let query = db.select().from(leads);

    const allLeads = await query.orderBy(desc(leads.createdAt));

    let filtered = allLeads;
    if (statusFilter) {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.businessName.toLowerCase().includes(s) ||
          l.contactName.toLowerCase().includes(s) ||
          l.email.toLowerCase().includes(s) ||
          (l.location && l.location.toLowerCase().includes(s)) ||
          (l.industry && l.industry.toLowerCase().includes(s))
      );
    }

    if (exportCsv) {
      await logAudit({
        adminEmail: admin.email,
        adminName: admin.name,
        action: "export",
        entityType: "lead",
        details: `Exported ${filtered.length} leads to CSV.`,
      });

      const csvRows = [
        ["ID", "Business Name", "Contact", "Email", "Phone", "Industry", "Location", "Status", "Source URL", "Created At"],
        ...filtered.map((l) => [
          l.id,
          `"${(l.businessName || "").replace(/"/g, '""')}"`,
          `"${(l.contactName || "").replace(/"/g, '""')}"`,
          `"${l.email}"`,
          `"${l.phone || ""}"`,
          `"${l.industry || ""}"`,
          `"${l.location || ""}"`,
          l.status,
          `"${l.sourceUrl || ""}"`,
          new Date(l.createdAt).toISOString(),
        ]),
      ];

      const csvString = csvRows.map((r) => r.join(",")).join("\n");
      return new NextResponse(csvString, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="merqato-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ leads: filtered });
  } catch (error) {
    console.error("Leads GET error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
