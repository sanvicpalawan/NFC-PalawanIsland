import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Terms of Service
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Effective Date: January 2026 &middot; NFC Palawan Island (Palawan Collective)
          </p>

          <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">1. Commercial Agreement</h2>
              <p>
                By requesting a pilot deployment, purchasing physical smart hardware, or accessing the administration system of NFC Palawan Island, you agree to these commercial terms established by Palawan Collective.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">2. Pilot Program Terms</h2>
              <p>
                Our 90-day hospitality pilot program includes a ₱1,000 setup commitment covering physical tag manufacturing and laser engraving. During the 90-day trial period, zero recurring monthly software fees apply. Your venue retains physical ownership of all delivered smart hardware discs and standups at the conclusion of the trial.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">3. Intellectual Property</h2>
              <p>
                NFC Palawan Island and Palawan Collective retain all intellectual property rights associated with the connected business software, edge redirection technology, and industrial designs. Clients retain full ownership of their venue trademarks, logos, menu photography, and operational content.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
