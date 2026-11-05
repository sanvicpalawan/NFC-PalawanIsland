import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractivePhoneDemo } from "@/components/InteractivePhoneDemo";
import { HeroDeviceShowcase } from "@/components/HeroDeviceShowcase";
import { HowItWorksFlow } from "@/components/HowItWorksFlow";
import { IndustrySelector } from "@/components/IndustrySelector";
import { ProductCatalog } from "@/components/ProductCatalog";
import { PilotOfferSection } from "@/components/PilotOfferSection";
import { LeadInquiryForm } from "@/components/LeadInquiryForm";
import {
  getSiteSettings,
  getIndustries,
  getUseCases,
  getProducts,
  getPageBySlug,
} from "@/lib/public-data";
import { FlipOutcomesSection } from "@/components/FlipOutcomesSection";
import { HospitalityCards } from "@/components/HospitalityCards";
import {
  ArrowRight,
  ArrowUpRight,
  Radio,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, industries, allUseCases, products, homePageData] =
    await Promise.all([
      getSiteSettings(),
      getIndustries(),
      getUseCases(),
      getProducts(),
      getPageBySlug("home"),
    ]);

  const hospitalityUseCases = allUseCases.filter(
    (uc) => uc.isHospitalityFeature
  );

  const brand = settings.brand || {};
  const pilotSettings = settings.pilot_offer || {};

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        {/* SECTION A — HERO */}
        <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16 lg:pb-24 overflow-hidden border-b border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
              {/* Left Hero Text Column */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:pr-4 reveal-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                  <span>Palawan Connected Hospitality &middot; Pilot Now Open</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial leading-[1.1] sm:leading-[1.04]" style={{ animation: "revealUp 0.8s 0.08s both" }}>
                  Make Every Tap Count.
                </h1>

                <p className="text-base sm:text-xl lg:text-2xl font-medium text-[var(--text-secondary)] leading-snug" style={{ animation: "revealUp 0.8s 0.14s both" }}>
                  Turn everyday objects into powerful business tools.
                </p>

                <p className="text-xs sm:text-base text-[var(--text-muted)] max-w-xl leading-relaxed" style={{ animation: "revealUp 0.8s 0.2s both" }}>
                  MerQato connects physical places, products, and equipment to useful digital experiences through QR codes, NFC technology, and connected business software.
                </p>

                {/* CTAs with mobile full-width touch targets */}
                <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4" style={{ animation: "revealUp 0.8s 0.26s both" }}>
                  <Link
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs sm:text-sm font-semibold hover:opacity-90 transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Request a Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="#hospitality"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs sm:text-sm font-medium hover:bg-[var(--bg-elevated)] transition-all hover:scale-[1.01]"
                  >
                    Explore Solutions
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </Link>
                </div>

                {/* Proof points — quiet editorial stats instead of a dotted list. */}
                <dl className="grid grid-cols-3 divide-x divide-[var(--border-subtle)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 p-1 sm:rounded-2xl" style={{ animation: "revealUp 0.8s 0.32s both" }}>
                  {[
                    { value: "0", unit: "apps", note: "Runs in the browser" },
                    { value: "<1", unit: "second", note: "From tap to screen" },
                    { value: "IP68", unit: "rated", note: "Sealed for outdoors" },
                  ].map((stat) => (
                    <div key={stat.note} className="px-3 py-3 sm:px-4 sm:py-4">
                      <dt className="sr-only">{stat.note}</dt>
                      <dd className="flex items-baseline gap-1 font-serif-editorial text-[22px] font-bold leading-none tracking-tight text-[var(--text-primary)] sm:text-[26px]">
                        {stat.value}
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{stat.unit}</span>
                      </dd>
                      <p className="mt-1.5 text-[10px] leading-snug text-[var(--text-muted)] sm:text-[11px]">{stat.note}</p>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right hero visual — interactive tag and connected experience */}
              <div className="lg:col-span-5" style={{ animation: "revealUp 0.9s 0.18s both" }}>
                <HeroDeviceShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B — HOW IT WORKS */}
        <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:space-y-12 sm:px-6 lg:space-y-16 lg:px-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-elevated)] px-3 py-1 font-mono text-xs font-medium text-[var(--text-muted)]">
                Three Simple Steps
              </div>
              <h2 className="font-serif-editorial text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                How MerQato Works
              </h2>
              <p className="text-base text-[var(--text-secondary)]">
                One tap, the right experience, and a useful next step. Explore the flow below.
              </p>
            </div>

            <HowItWorksFlow />

            {/* Keep the full simulator accessible without another long mobile stack. */}
            <Link
              href="/how-it-works"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] px-5 py-4 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] md:hidden"
            >
              Try the full interactive guest demo
              <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="hidden md:block">
              <InteractivePhoneDemo />
            </div>
          </div>
        </section>

        {/* SECTION C — HOSPITALITY SOLUTIONS */}
        <section id="hospitality" className="py-16 sm:py-20 lg:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Primary Hospitality Offering</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
                  Hospitality Solutions
                </h2>
                <p className="text-base text-[var(--text-secondary)]">
                  Connected experiences designed for Palawan resorts, beachfront dining, boutique hotels, and tour operators.
                </p>
              </div>

              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                View all technical solution briefs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Swipeable, layered deck on mobile; motion-enhanced grid on larger screens. */}
            <HospitalityCards items={hospitalityUseCases} />
          </div>
        </section>

        {/* SECTION D — EXPLORE OTHER INDUSTRIES */}
        <section id="industries" className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:space-y-12 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">Beyond hospitality</p>
              <h2 className="font-serif-editorial text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                One platform. Many ways to connect.
              </h2>
              <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                Built first for hospitality in Palawan. Adapted for the places, products, and equipment that matter in your industry.
              </p>
            </div>

            {/* Dynamic Industry Selector */}
            <IndustrySelector industries={industries} useCases={allUseCases} />
          </div>
        </section>

        {/* SECTION E — PHYSICAL PRODUCTS */}
        <section id="products" className="py-20 lg:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-elevated)]">
                  <span>Tactile Hardware</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
                  Physical Smart Products
                </h2>
                <p className="text-base text-[var(--text-secondary)]">
                  Crafted for tropical resilience. Weatherproof, saltwater-resistant, and aesthetically elevated for premier business venues.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline whitespace-nowrap"
              >
                Browse complete physical catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Product Catalog Component */}
            <ProductCatalog products={products} />
          </div>
        </section>

        {/* SECTION F — BUSINESS BENEFITS — FLIP CARD OUTCOMES */}
        <FlipOutcomesSection />

        {/* SECTION G — PILOT PROGRAM */}
        <PilotOfferSection settings={pilotSettings} />

        {/* SECTION H — FINAL CONVERSION */}
        <section id="contact" className="py-20 lg:py-28 bg-[var(--bg-page)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column Text */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Begin Your Deployment</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
                  Your Business. Connected.
                </h2>

                <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                  Connect your venue or equipment to intelligent mobile web experiences. Tell us about your property or fleet, and our Palawan team will schedule an on-site hardware demonstration.
                </p>

                <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    <span>Direct consultation with Palawan Collective founders</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    <span>Hardware sample kit available for El Nido, Coron & Puerto Princesa</span>
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                    <span>No third-party subscription lock-in</span>
                  </p>
                </div>
              </div>

              {/* Right Column Form */}
              <div className="lg:col-span-7">
                <LeadInquiryForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
