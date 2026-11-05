import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCatalog } from "@/components/ProductCatalog";
import { getProducts } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
              <span>Industrial & Hospitality Hardware</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
              Physical Smart Products
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Tactile, durable NFC tags and hybrid QR hardware engineered for tropical island operations, commercial dining, marine fleets, and solar microgrids.
            </p>
          </div>

          <ProductCatalog products={products} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
