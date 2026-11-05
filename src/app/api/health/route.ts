import { db } from "@/db";
import { sql } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    await seedDatabase();
    return Response.json({ ok: true, status: "healthy", service: "merqato.digital" });
  } catch (error) {
    console.error("Healthcheck error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
