import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/ProductGallery";
import { getProductBySlug } from "@/lib/public-data";
import { Download, ArrowRight, Check, Cpu, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

function toPillsFromDimensions(dimensions: string | null, variants: any[]): string[] {
  if (Array.isArray(variants) && variants.length) {
    const dims = variants.map((v: any) => v.dimensions).filter(Boolean) as string[];
    const uniq = Array.from(new Set(dims.map((d) => d.trim()).filter(Boolean)));
    if (uniq.length) return uniq.slice(0, 6);
  }
  if (!dimensions) return [];
  // split by "/" or ","
  return dimensions
    .split(/[\/,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function toMaterialsPills(materials: string | null, variants: any[]): string[] {
  if (Array.isArray(variants) && variants.length) {
    const finishes = variants.map((v: any) => v.finish).filter(Boolean) as string[];
    const uniq = Array.from(new Set(finishes.map((f) => f.trim()).filter(Boolean)));
    if (uniq.length >= 2) return uniq.slice(0, 6);
  }
  if (!materials) return [];
  // If materials contains " / " or " , " split, else keep as single pill
  const parts = materials
    .split(/[/,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length > 1 && parts.length <= 6) return parts;
  // fallback: if string is very long, return as single pill truncated
  return [materials];
}

function cheapestPrice(variants: any[]): string | null {
  if (!Array.isArray(variants) || !variants.length) return null;
  // pick first with estPrice
  const withPrice = variants.find((v: any) => v.estPrice);
  return withPrice?.estPrice || null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const applications = (product.applications as string[]) || [];
  const variants = (product.variants as any[]) || [];
  const gallery = (product.galleryUrls as string[]) || [];
  const allImages = [product.imageUrl, ...gallery].filter(Boolean) as string[];
  // dedupe
  const images = Array.from(new Set(allImages));

  const availableSizes = toPillsFromDimensions(product.dimensions, variants);
  const materialsPills = toMaterialsPills(product.materials, variants);
  const priceFrom = cheapestPrice(variants);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 sm:mb-8">
            <Link href="/" className="hover:text-[var(--text-primary)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[var(--text-primary)]">
              Hardware
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* Left: Gallery — now fully interactive */}
            <div className="lg:col-span-6 xl:col-span-6">
              <ProductGallery
                images={images}
                alt={product.name}
                chipType={product.chipType}
                waterproofRating={product.waterproofRating}
              />
            </div>

            {/* Right: Specs — editorial pill layout matching screenshot */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6">
              {/* category + title */}
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.14em] font-mono font-medium text-[var(--text-muted)] uppercase">
                  {product.category?.replace(/_/g, " ") || "Product"}
                </p>

                <h1 className="text-[32px] sm:text-[42px] lg:text-[46px] font-serif-editorial font-bold tracking-tight leading-[0.9] text-[var(--text-primary)]">
                  {product.name}
                </h1>

                {product.tagline && (
                  <p className="text-[15px] sm:text-[16px] leading-relaxed text-[var(--text-secondary)] max-w-[46ch]">
                    {product.tagline}
                  </p>
                )}

                {priceFrom && (
                  <p className="text-[12px] font-mono tracking-wide text-[#B85D32]">
                    from {priceFrom}
                  </p>
                )}

                <p className="text-[13px] sm:text-[14px] leading-relaxed text-[var(--text-secondary)] max-w-[60ch] pt-1">
                  {product.description}
                </p>
              </div>

              {/* AVAILABLE SIZES */}
              {availableSizes.length > 0 && (
                <div className="pt-5 border-t border-[var(--border-subtle)]">
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.12em] font-mono font-semibold text-[var(--text-muted)] uppercase mb-2">
                        Available sizes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSizes.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-full bg-white dark:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-mono tracking-wide text-[var(--text-primary)]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* MATERIALS — side by side on desktop like screenshot */}
                    {materialsPills.length > 0 && (
                      <div className="flex-1">
                        <p className="text-[10px] tracking-[0.12em] font-mono font-semibold text-[var(--text-muted)] uppercase mb-2">
                          Materials
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {materialsPills.map((m) => (
                            <span
                              key={m}
                              className="px-2.5 py-1 rounded-full bg-white dark:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-mono tracking-wide text-[var(--text-primary)]"
                            >
                              {m.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* APPLICATIONS */}
              {applications.length > 0 && (
                <div className="pt-4">
                  <p className="text-[10px] tracking-[0.12em] font-mono font-semibold text-[var(--text-muted)] uppercase mb-2">
                    Applications
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {applications.map((app) => (
                      <span
                        key={app}
                        className="px-2.5 py-1 rounded-full bg-white dark:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-mono tracking-wide text-[var(--text-secondary)]"
                      >
                        {app.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CODE / chip row — like screenshot bottom table */}
              <div className="rounded-[16px] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <div className="grid grid-cols-[110px_1fr] text-xs">
                  <div className="px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase bg-[var(--bg-page)] border-r border-[var(--border-subtle)] flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" />
                    Code
                  </div>
                  <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)] flex items-center gap-2">
                    <span className="truncate">{product.chipType || "NXP NTAG — Cloud-redirected"}</span>
                  </div>
                </div>
                {product.operatingRange && (
                  <div className="grid grid-cols-[110px_1fr] text-xs border-t border-[var(--border-subtle)]">
                    <div className="px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase bg-[var(--bg-page)] border-r border-[var(--border-subtle)]">
                      Range
                    </div>
                    <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                      {product.operatingRange}
                    </div>
                  </div>
                )}
                {product.waterproofRating && (
                  <div className="grid grid-cols-[110px_1fr] text-xs border-t border-[var(--border-subtle)]">
                    <div className="px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-[var(--text-muted)] uppercase bg-[var(--bg-page)] border-r border-[var(--border-subtle)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      Durability
                    </div>
                    <div className="px-4 py-3 text-[13px] text-[var(--text-secondary)]">
                      {product.waterproofRating}
                    </div>
                  </div>
                )}
              </div>

              {/* Variants — keep but as table matching screenshot pricing */}
              {variants.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] tracking-[0.12em] font-mono font-semibold text-[var(--text-muted)] uppercase mb-2">
                    Variants & finish
                  </p>
                  <div className="space-y-1.5">
                    {variants.map((v: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{v.name}</p>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono">
                            {v.dimensions} {v.finish ? `· ${v.finish}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono">
                          {v.minOrder && <span className="text-[var(--text-muted)]">MOQ {v.minOrder}</span>}
                          {v.estPrice && <span className="text-[var(--accent)] font-bold">{v.estPrice}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/#contact?product=${encodeURIComponent(product.name)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-sm"
                >
                  Inquire for batch quote
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={product.specSheetUrl || `/docs/${product.slug}-spec.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium bg-white dark:bg-[var(--bg-surface)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download spec sheet
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
