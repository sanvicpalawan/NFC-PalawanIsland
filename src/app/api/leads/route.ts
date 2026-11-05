import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot spam check
    if (body.website_url_hp && body.website_url_hp.length > 0) {
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
    if (!businessName || !contactName || !email) {
      return NextResponse.json(
        { error: "Business name, contact name, and email are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const newLead = await db
      .insert(leads)
      .values({
        businessName: String(businessName).trim(),
        contactName: String(contactName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        industry: industry ? String(industry).trim() : "Hospitality",
        location: location ? String(location).trim() : "Palawan, Philippines",
        interestedSolutions: Array.isArray(interestedSolutions) ? interestedSolutions : [],
        productInquirySlug: productInquirySlug ? String(productInquirySlug).trim() : null,
        message: message ? String(message).trim() : null,
        sourceUrl: sourceUrl ? String(sourceUrl).trim() : "/",
        consentGiven: consentGiven !== false,
        status: "new",
        notes: [
          {
            author: "System",
            text: `Web inquiry submitted from ${sourceUrl || "homepage"}.`,
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
