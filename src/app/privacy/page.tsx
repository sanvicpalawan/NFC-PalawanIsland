import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Privacy Policy
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-mono">
            Last Updated: January 2026 &middot; MerQato Digital (Palawan Collective)
          </p>

          <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">1. Overview</h2>
              <p>
                MerQato (&ldquo;merqato.digital&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is operated by Palawan Collective in Puerto Princesa, Palawan, Philippines. We are committed to protecting the privacy of our business clients, website visitors, and guests who interact with MerQato physical tags.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">2. Anonymous Guest Tap Architecture</h2>
              <p>
                When a hotel guest, diner, or customer taps a MerQato NFC tag or scans a QR code, no personally identifiable information (PII) is automatically collected. The interaction initiates an encrypted HTTPS session to resolve the appropriate venue menu, service portal, or review link.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">3. Business Inquiries & Pilot Submissions</h2>
              <p>
                When you submit an inquiry form or apply for our hospitality pilot program, we collect your business name, contact name, email address, phone number, and venue requirements solely for communicating regarding your deployment. We never sell or share commercial lead data with third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">4. Contact & Inquiries</h2>
              <p>
                For questions regarding data privacy, you may contact our team at hello@merqato.digital or visit our hub at Rizal Avenue, Puerto Princesa, Palawan 5300, Philippines.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
