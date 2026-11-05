import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "Do guests need to download an app to use MerQato?",
    a: "No. Zero app installation is required. Every modern iPhone and Android phone automatically reads NFC tags or scans QR codes natively and renders an ultra-fast web portal in under 600 milliseconds.",
  },
  {
    q: "How does the NFC tag get power? Do we need to recharge or replace batteries?",
    a: "MerQato smart tags are completely passive. They contain zero batteries and never require charging. When a guest taps their smartphone, the phone's native NFC field induces power into the microchip. Our tags last for many years of daily commercial use.",
  },
  {
    q: "Are the physical tags waterproof and resistant to Palawan's climate?",
    a: "Yes. Our tabletop standups and circular discs are sealed to IP68 standards. They endure direct monsoons, saltwater spray, UV sun exposure, and daily sanitizing alcohol cleaning without fading or electronic degradation.",
  },
  {
    q: "Can we update menus, prices, and daily specials in real time?",
    a: "Yes. Venue managers have access to an instant update screen. When you mark an item sold out, update today's fresh seafood catch, or change cocktail pricing, it updates immediately across all physical table tags.",
  },
  {
    q: "What is included in the ₱1,000 Hospitality Pilot Program?",
    a: "The pilot includes 25 custom-designed physical MerQato smart tags, full digital guest portal setup, 1-tap Google Review configuration, on-site rollout, and 90 days of hosting with zero monthly software fees. Your venue keeps all physical hardware permanently.",
  },
  {
    q: "Can MerQato integrate with our existing POS or Hotel PMS?",
    a: "MerQato is designed for clean API integration. During the initial pilot, orders and guest requests can be dispatched via mobile tablet dashboard, WhatsApp, or dedicated email alerts. Direct POS & PMS hooks are on our operational platform roadmap.",
  },
  {
    q: "What other industries does MerQato support?",
    a: "Beyond hospitality and dining, MerQato supports tour boat fleets, diving centers, off-grid solar equipment maintenance, rental motorbikes, property management villas, and artisan craft authenticity verification.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Everything you need to know about MerQato NFC hardware, mobile web portals, and pilot rollout in Palawan.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2"
              >
                <h3 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold font-serif-editorial">
                Have a specific venue question?
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Our Palawan technology team is happy to assist.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold"
            >
              Ask Our Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
