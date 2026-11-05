import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getInsightBySlug } from "@/lib/public-data";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Insights</span>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold">
              <span>{article.category}</span>
              <span>&middot;</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial leading-tight">
              {article.title}
            </h1>

            <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <span>Published by {article.author}</span>
            </div>
          </div>

          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <Image
              src={article.coverImage || "/images/nfc-palawan-island-hero-tap.jpg"}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
            />
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-6 text-[var(--text-secondary)]">
            {article.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="pt-8 border-t border-[var(--border-subtle)] flex justify-between items-center text-xs">
            <Link
              href="/insights"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium"
            >
              &larr; More Articles
            </Link>
            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] font-semibold"
            >
              Discuss with Engineering Team &rarr;
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
