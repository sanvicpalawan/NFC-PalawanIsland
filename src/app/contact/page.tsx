import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeadInquiryForm } from "@/components/LeadInquiryForm";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Inquiries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              Connect with NFC Palawan Island
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Based in Puerto Princesa, Palawan. We deploy on-site across El Nido, Coron, San Vicente, and Puerto Princesa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
                <h2 className="text-xl font-bold font-serif-editorial text-[var(--text-primary)]">
                  Palawan Coordinates
                </h2>

                <div className="space-y-4 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Palawan Collective Innovation Hub</p>
                      <p className="text-[var(--text-muted)]">Rizal Avenue, Puerto Princesa, Palawan 5300, Philippines</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Direct Email</p>
                      <a href="mailto:hello@merqato.digital" className="text-[var(--accent)] hover:underline">
                        hello@merqato.digital
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">Phone & WhatsApp</p>
                      <p className="text-[var(--text-muted)]">+63 (048) 433-2890</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-xs text-[var(--text-secondary)] space-y-2">
                <p className="font-semibold text-[var(--text-primary)]">
                  Hardware Demonstration In Person
                </p>
                <p>
                  Traveling resort owners, hospitality general managers, or fleet directors can request physical hardware kits delivered directly to your venue for evaluation.
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
