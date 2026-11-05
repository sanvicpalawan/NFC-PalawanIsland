import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getIndustryBySlug, getUseCases } from "@/lib/public-data";
import { ArrowRight, CheckCircle2, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const allUseCases = await getUseCases();
  const matchedUseCases = allUseCases.filter((uc) => {
    const slugs = (uc.industrySlugs as string[]) || [];
    return slugs.includes(industry.slug);
  });

  const benefits = (industry.benefits as string[]) || [];
  const deployments =
    (industry.exampleDeployments as Array<{
      title: string;
      venueType: string;
      outcome: string;
    }>) || [];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/#industries" className="hover:text-[var(--text-primary)]">
              Industries
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-medium">
              {industry.name}
            </span>
          </div>

          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-surface)]">
                <Layers className="w-3.5 h-3.5" />
                <span>Sector Implementation Guide</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
                {industry.name}
              </h1>

              {industry.tagline && (
                <p className="text-lg font-medium text-[var(--accent)]">
                  {industry.tagline}
                </p>
              )}

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {industry.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/#contact?industry=${encodeURIComponent(industry.name)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs"
                >
                  Consult on {industry.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/11] rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <Image
                src={industry.imageUrl || "/images/nfc-palawan-island-hero-tap.jpg"}
                alt={industry.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Measurable outcomes & Deployments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.length > 0 && (
              <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-editorial">
                  Operational Benefits
                </h2>
                <div className="space-y-3">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deployments.length > 0 && (
              <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)] font-serif-editorial">
                  Field Implementations
                </h2>
                <div className="space-y-3">
                  {deployments.map((d, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center font-semibold text-[var(--text-primary)]">
                        <span>{d.title}</span>
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">
                          {d.venueType}
                        </span>
                      </div>
                      <p className="text-[var(--accent)]">{d.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Matched Use Cases */}
          {matchedUseCases.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif-editorial">
                Assigned Digital Solutions for {industry.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedUseCases.map((uc) => (
                  <Link
                    key={uc.id}
                    href={`/use-cases/${uc.slug}`}
                    className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {uc.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                        {uc.description}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center gap-1.5 text-xs text-[var(--accent)] font-semibold">
                      <span>Explore Use Case</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
