import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PilotOfferSection } from "@/components/PilotOfferSection";
import { LeadInquiryForm } from "@/components/LeadInquiryForm";
import { getSiteSettings } from "@/lib/public-data";
import { CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PilotProgramPage() {
  const settings = await getSiteSettings();
  const pilotSettings = settings.pilot_offer || {};

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Palawan Commercial Pilot</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              90-Day Hospitality Pilot Program
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Test MerQato in your dining rooms, poolside cabanas, and hotel suites for 90 days with a simple ₱1,000 setup commitment and zero monthly software fees during your trial.
            </p>
          </div>

          <PilotOfferSection settings={pilotSettings} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8 border-t border-[var(--border-subtle)]">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-editorial">
                Apply for Venue Allocation
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Pilot hardware kits are assembled by Palawan Collective in Puerto Princesa. We conduct on-site staff training and deployment across Palawan.
              </p>
              <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2 text-xs">
                <p className="font-semibold text-[var(--text-primary)]">Hardware Guarantee</p>
                <p className="text-[var(--text-muted)]">
                  Your venue keeps the 25 custom-engraved physical smart discs even if you choose not to subscribe after the 90-day trial.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <LeadInquiryForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
