import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getInsights } from "@/lib/public-data";
import { ArrowRight, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const articles = await getInsights();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Engineering & Strategy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              Insights & Field Notes
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Research, technical explorations, and practical case studies on physical-to-digital business experiences in Palawan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/insights/${art.slug}`}
                className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all flex flex-col justify-between group block"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <Image
                      src={art.coverImage || "/images/merqato-hero-tap.jpg"}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                    <span>{art.category}</span>
                    <span>&middot;</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h2 className="text-lg font-bold text-[var(--text-primary)] font-serif-editorial group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {art.title}
                  </h2>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
                  <span>Read Field Note</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
