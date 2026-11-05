import "dotenv/config";
import { and, eq, sql } from "drizzle-orm";
import { db, pool } from "./index";
import { industries } from "./schema";
import { previewIndustryCopy } from "../lib/industry-copy";

/**
 * One-time preview content refresh. Only records retaining the original seeded
 * description AND unchanged created/updated timestamps are touched; editor
 * changes made through /admin/industries are never overwritten.
 *
 * Run: npx tsx src/db/refresh-preview-industries.ts
 */
const oldDescriptions: Record<string, string> = {
  hospitality:
    "Equip hotel rooms, sunbeds, cabanas, and concierge desks with tactile smart tags. Guests tap to order room service, book excursions, request towels, or leave 5-star reviews without downloading any app.",
  "restaurants-and-cafes":
    "Durable NFC discs and QR standups allow patrons to browse dynamic multilingual menus, view daily catch specials, request water or the bill, and tap to leave glowing reviews.",
  "tourism-and-marine":
    "Marine-grade waterproof NFC tags on speedboats, dive gear, and tour pick-up points. Guests tap for daily itineraries, digital safety briefings, eco-conservation guidelines, and photo album links.",
  "property-and-facilities":
    "Transform rental properties and commercial real estate with smart tags on air conditioning controls, Wi-Fi routers, breaker panels, and entryways for guest manuals and technician logs.",
  "solar-and-energy":
    "Off-grid and grid-tied solar installations in remote island locations require verifiable field tracking. MerQato rugged asset tags link inverters, batteries, and solar arrays to commissioning certificates and repair history.",
  "equipment-rentals":
    "Mount durable NFC tags on rental motorbikes, ATVs, scuba gear, and construction generators. Customers tap for return times, operating instructions, and emergency roadside assistance.",
  "manufacturing-and-product-identity":
    "High-value local craft, organic agriculture, pearls, and exported goods carry MerQato cryptographic NFC seals verifying origin, certification, and artisan story.",
  "logistics-and-supply-chains":
    "Track inter-island shipping containers, cold-chain seafood boxes, and high-value cargo with durable scanned checkpoints that work reliably even with intermittent connectivity.",
  "events-and-experiences":
    "Festivals, corporate summits, and private island retreats use MerQato silicone wristbands and laminate NFC passes for frictionless entry, schedule updates, and digital business card exchange.",
};

async function main() {
  let updated = 0;
  for (const [slug, copy] of Object.entries(previewIndustryCopy)) {
    const oldDescription = oldDescriptions[slug];
    if (!oldDescription) continue;
    const rows = await db
      .update(industries)
      .set({ ...copy, exampleDeployments: [], updatedAt: new Date() })
      .where(
        and(
          eq(industries.slug, slug),
          eq(industries.description, oldDescription),
          sql`${industries.updatedAt} = ${industries.createdAt}`,
        ),
      )
      .returning({ id: industries.id });
    updated += rows.length;
  }
  console.log(`Refreshed ${updated} untouched preview industries; other records were left as-is.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
