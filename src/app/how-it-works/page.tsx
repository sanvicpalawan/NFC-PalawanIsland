import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractivePhoneDemo } from "@/components/InteractivePhoneDemo";
import { HowItWorksFlow } from "@/components/HowItWorksFlow";
import { Radio, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 lg:space-y-20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <Radio className="w-3.5 h-3.5" />
              <span>Architecture & Flow</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              How NFC Palawan Island Works
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              From a physical tap to a useful digital experience. Follow the three steps, then try the interactive guest demo.
            </p>
          </div>

          <HowItWorksFlow />

          {/* Interactive Demo */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-8 lg:p-12">
            <InteractivePhoneDemo />
          </div>

          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold font-serif-editorial">
              Ready to experience NFC Palawan Island at your venue?
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Join our 90-day Palawan hospitality connected experience pilot.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold"
            >
              Request a Pilot Hardware Kit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
