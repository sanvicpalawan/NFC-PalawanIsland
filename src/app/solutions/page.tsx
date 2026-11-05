import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getUseCases } from "@/lib/public-data";
import {
  Menu,
  Star,
  Smartphone,
  Coffee,
  Compass,
  Award,
  Bell,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

const iconMap: Record<string, any> = {
  "digital-menus-and-ordering": Menu,
  "google-review-collection": Star,
  "hotel-guest-portals": Smartphone,
  "room-service-and-concierge": Coffee,
  "tour-and-activity-booking": Compass,
  "customer-loyalty": Award,
  "guest-requests": Bell,
  "housekeeping-management": Sparkles,
  "equipment-and-rental-tracking": ShieldCheck,
};

export default async function SolutionsPage() {
  const useCases = await getUseCases();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <span>Connected Business Software</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              Connected Solutions
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Every NFC Palawan Island solution is engineered to eliminate friction between your guests or staff and the physical assets they interact with daily.
            </p>
          </div>

          {/* Solutions List */}
          <div className="space-y-12">
            {useCases.map((uc, index) => {
              const IconComp = iconMap[uc.slug] || Zap;
              const features = (uc.features as string[]) || [];
              const benefits = (uc.benefits as string[]) || [];

              return (
                <div
                  key={uc.id}
                  id={uc.slug}
                  className="p-8 sm:p-10 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)]">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        Module #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
                      {uc.title}
                    </h2>

                    {uc.subtitle && (
                      <p className="text-sm font-medium text-[var(--accent)]">
                        {uc.subtitle}
                      </p>
                    )}

                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {uc.description}
                    </p>

                    {/* Features list */}
                    {features.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <p className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                          Technical Inclusions:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                          {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex items-center gap-3">
                      <Link
                        href={`/#contact?solution=${encodeURIComponent(uc.title)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
                      >
                        Request Demo for {uc.title}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/use-cases/${uc.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium"
                      >
                        Deep Dive Page
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-4">
                    <p className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                      Operational Impact
                    </p>
                    {benefits.map((b, i) => (
                      <div key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
