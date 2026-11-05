import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

export const dynamic = "force-dynamic";

/**
 * Column limits from src/db/schema.ts for the `leads` table.
 *
 * These must stay in sync with the varchar() declarations. PostgreSQL rejects
 * an over-long value with `value too long for type character varying(n)`, which
 * the catch block below would otherwise report to the visitor as an opaque
 * 500 "Failed to submit inquiry". Trimming to the column width keeps a
 * long-but-honest submission (a pasted paragraph in a text field, a tracking
 * query string in the referrer) from failing the whole request.
 */
const LIMITS = {
  businessName: 255,
  contactName: 255,
  email: 255,
  phone: 100,
  industry: 100,
  location: 255,
  productInquirySlug: 100,
  sourceUrl: 255,
} as const;

/** Trim to a column width, returning null for empty input. */
function clip(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

/** Trim to a column width, falling back to a default when empty. */
function clipDefault(value: unknown, max: number, fallback: string): string {
  return clip(value, max) ?? fallback;
}

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      // Malformed or empty JSON body — a client-side fault, not a server error.
      return NextResponse.json(
        { error: "We could not read that submission. Please reload the page and try again." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "We could not read that submission. Please reload the page and try again." },
        { status: 400 }
      );
    }

    // Honeypot spam check
    const honeypot = body.website_url_hp;
    if (typeof honeypot === "string" && honeypot.length > 0) {
      // Quietly reject bot
      return NextResponse.json({ success: true, message: "Inquiry received" });
    }

    const {
      businessName,
      contactName,
      email,
      phone,
      industry,
      location,
      interestedSolutions,
      productInquirySlug,
      message,
      sourceUrl,
      consentGiven,
    } = body;

    // Validation
    if (!clip(businessName, LIMITS.businessName) || !clip(contactName, LIMITS.contactName) || !clip(email, LIMITS.email)) {
      return NextResponse.json(
        { error: "Business name, contact name, and email are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > LIMITS.email) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Keep only strings, de-duplicate, and cap the list so a crafted payload
    // cannot store an unbounded array.
    const solutions = Array.isArray(interestedSolutions)
      ? Array.from(
          new Set(
            interestedSolutions
              .filter((s): s is string => typeof s === "string")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        ).slice(0, 40)
      : [];

    const resolvedSourceUrl = clipDefault(sourceUrl, LIMITS.sourceUrl, "/");

    const newLead = await db
      .insert(leads)
      .values({
        businessName: clipDefault(businessName, LIMITS.businessName, "Unknown business"),
        contactName: clipDefault(contactName, LIMITS.contactName, "Unknown contact"),
        email: normalizedEmail,
        phone: clip(phone, LIMITS.phone),
        industry: clipDefault(industry, LIMITS.industry, "Hospitality"),
        location: clipDefault(location, LIMITS.location, "Palawan, Philippines"),
        interestedSolutions: solutions,
        productInquirySlug: clip(productInquirySlug, LIMITS.productInquirySlug),
        // `message` is a text column, so it needs no clipping.
        message: clip(message, 20000),
        sourceUrl: resolvedSourceUrl,
        consentGiven: consentGiven !== false,
        status: "new",
        notes: [
          {
            author: "System",
            text: `Web inquiry submitted from ${resolvedSourceUrl}.`,
            createdAt: new Date().toISOString(),
          },
        ],
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out to MerQato. Our Palawan team will connect with you within 24 business hours.",
      leadId: newLead[0]?.id,
    });
  } catch (error) {
    console.error("Public lead error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again or email hello@merqato.digital directly." },
      { status: 500 }
    );
  }
}
