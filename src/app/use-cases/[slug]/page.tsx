import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getUseCaseBySlug } from "@/lib/public-data";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);

  if (!useCase) {
    notFound();
  }

  const features = (useCase.features as string[]) || [];
  const benefits = (useCase.benefits as string[]) || [];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/solutions" className="hover:text-[var(--text-primary)]">
              Solutions
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-medium">
              {useCase.title}
            </span>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent-border)]">
              <Zap className="w-3.5 h-3.5" />
              <span>Digital Connected Experience</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              {useCase.title}
            </h1>

            {useCase.subtitle && (
              <p className="text-lg font-medium text-[var(--accent)]">
                {useCase.subtitle}
              </p>
            )}

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed pt-2">
              {useCase.description}
            </p>
          </div>

          {/* Features and Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-editorial">
                Key Technical Features
              </h2>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-editorial">
                Operational Advantages
              </h2>
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-[var(--text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] font-serif-editorial">
                Deploy {useCase.title} for Your Venue
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Included in our 90-day Palawan hospitality connected experience pilot.
              </p>
            </div>
            <Link
              href={`/#contact?solution=${encodeURIComponent(useCase.title)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-bold hover:opacity-90 whitespace-nowrap shadow-xs"
            >
              Request Deployment Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
