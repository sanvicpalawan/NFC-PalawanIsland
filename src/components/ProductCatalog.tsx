"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ArrowRight,
  Check,
  Radio,
  Sparkles,
  ShieldCheck,
  Tag,
  Maximize2,
  Cpu,
  Layers,
  Zap,
} from "lucide-react";

interface ProductVariant {
  name: string;
  finish?: string;
  dimensions?: string;
  minOrder?: string;
  estPrice?: string;
}

interface ProductItem {
  id: number;
  slug: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string;
  imageUrl: string | null;
  dimensions: string | null;
  materials: string | null;
  operatingRange: string | null;
  chipType: string | null;
  waterproofRating: string | null;
  applications: any;
  variants: any;
  specSheetUrl: string | null;
  isFeatured: boolean | null;
}

const categories = [
  { id: "all", label: "All Physical Hardware" },
  { id: "tabletop", label: "Tabletop Standups & Discs" },
  { id: "stickers", label: "Smart Stickers (NFC & QR)" },
  { id: "cards", label: "Hotel Keycards" },
  { id: "wristbands", label: "Marine Wristbands" },
  { id: "asset_labels", label: "Industrial & Solar Labels" },
  { id: "secure_tags", label: "Cryptographic DNA Tags" },
];

export function ProductCatalog({ products }: { products: ProductItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    products[0] || null
  );
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const filtered =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const active = selectedProduct || filtered[0] || products[0];

  const applications = (active?.applications as string[]) || [];
  const variants = (active?.variants as ProductVariant[]) || [];
  const activeVariant = variants[selectedVariantIndex] || variants[0];

  const handleProductSwitch = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setSelectedVariantIndex(0);
    setIsSimulatingTap(true);
    setTimeout(() => setIsSimulatingTap(false), 900);
  };

  const handleSimulatePing = () => {
    setIsSimulatingTap(true);
    setTimeout(() => setIsSimulatingTap(false), 1000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              const firstInCat =
                cat.id === "all"
                  ? products[0]
                  : products.find((p) => p.category === cat.id);
              if (firstInCat) handleProductSwitch(firstInCat);
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? "bg-[var(--text-primary)] text-[var(--bg-page)] border-[var(--text-primary)] shadow-xs"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mobile Hardware Selector Bar (Quick Swipe on Mobile) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {filtered.map((prod) => {
          const isSelected = active?.id === prod.id;
          return (
            <button
              key={prod.id}
              type="button"
              onClick={() => handleProductSwitch(prod)}
              className={`p-2 rounded-2xl border transition-all flex items-center gap-2 shrink-0 max-w-[220px] text-left cursor-pointer ${
                isSelected
                  ? "bg-[var(--bg-elevated)] border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-xs"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] relative overflow-hidden shrink-0 p-1">
                <Image
                  src={prod.imageUrl || "/images/nfc-palawan-island-product-tags.jpg"}
                  alt={prod.name}
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">
                  {prod.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                  {prod.chipType}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Desktop List + Responsive Active Spotlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Desktop Interactive List */}
        <div className="hidden lg:block lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono px-1">
            <span>Hardware Catalog ({filtered.length} items)</span>
            <span>Click to inspect</span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filtered.map((prod) => {
              const isSelected = active?.id === prod.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => handleProductSwitch(prod)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-xs"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] overflow-hidden relative shrink-0 p-1">
                      <Image
                        src={prod.imageUrl || "/images/nfc-palawan-island-product-tags.jpg"}
                        alt={prod.name}
                        fill
                        className="object-contain p-0.5"
                        sizes="52px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          {prod.name}
                        </p>
                        {prod.isFeatured && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold shrink-0">
                            Core
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {prod.chipType} &middot; {prod.dimensions}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)] shrink-0">
                    {prod.waterproofRating || "IP67"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hardware Spotlight (Primary on Mobile and Desktop) */}
        {active && (
          <div className="lg:col-span-7 p-4 sm:p-7 lg:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5 sm:space-y-6">
            {/* Visual Hardware Stage - Engineered so NO IMAGES ARE CUTOFF */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900/90 dark:bg-neutral-950 border border-[var(--border-subtle)] shadow-inner flex items-center justify-center group shine-sweep isolate">
              {/* Background radial gradient glow */}
              <div className="absolute inset-0 bg-radial from-amber-500/12 via-transparent to-black/60 pointer-events-none" />

              {/* Hardware Image with object-contain so round tags and edges are 100% visible */}
              <div className="relative w-full h-full p-3 sm:p-6 transition-transform duration-700 group-hover:scale-[1.02]">
                <Image
                  src={active.imageUrl || "/images/nfc-palawan-island-product-tags.jpg"}
                  alt={active.name}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
                />
              </div>

              {/* Animated NFC Ripple Wave (appears on tap simulation) */}
              {isSimulatingTap && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-16 h-16 rounded-full border-2 border-[var(--accent)] animate-nfc-wave" />
                  <div
                    className="w-24 h-24 rounded-full border border-[var(--accent)] animate-nfc-wave"
                    style={{ animationDelay: "0.25s" }}
                  />
                  <div
                    className="w-32 h-32 rounded-full border border-white/60 animate-nfc-wave"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <div className="absolute px-3 py-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-mono font-bold shadow-lg animate-bounce">
                    NFC Transmit Ping OK &middot; 13.56 MHz
                  </div>
                </div>
              )}

              {/* Top Badges HUD */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-black/75 text-white backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-[var(--accent)]" />
                  {active.chipType || "NXP NTAG Silicon"}
                </span>

                <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-black/75 text-white backdrop-blur-md border border-white/10">
                  {active.waterproofRating || "IP68 Submersible"}
                </span>
              </div>

              {/* Interactive "Tap to Ping Tag" Action Button */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={handleSimulatePing}
                  className="px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/15 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Radio
                    className={`w-3.5 h-3.5 text-[var(--accent)] ${
                      isSimulatingTap ? "animate-ping" : ""
                    }`}
                  />
                  <span>Test Signal Ping</span>
                </button>

                <span className="text-[10px] font-mono text-white/70 hidden sm:inline-block bg-black/50 px-2 py-1 rounded-md backdrop-blur-xs">
                  Zero Battery Required
                </span>
              </div>
            </div>

            {/* Product Title and Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
                  {active.name}
                </h3>
                <span className="text-[11px] font-mono text-[var(--accent)] font-semibold">
                  {active.operatingRange || "15mm - 40mm reading clearance"}
                </span>
              </div>
              {active.tagline && (
                <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] mt-1">
                  {active.tagline}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {active.description}
            </p>

            {/* Specifications Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Materials</p>
                <p className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                  {active.materials || "Solid Teak / PET"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Dimensions</p>
                <p className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                  {active.dimensions || "80mm Ø"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Chipset</p>
                <p className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                  {active.chipType || "NTAG215"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Waterproof</p>
                <p className="font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                  {active.waterproofRating || "IP68"}
                </p>
              </div>
            </div>

            {/* Interactive Production Variants Matrix */}
            {variants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider font-semibold text-[var(--text-muted)] text-[11px]">
                    Production Variants & Finishes:
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {variants.length} available
                  </span>
                </div>

                <div className="space-y-1.5">
                  {variants.map((v, i) => {
                    const isSelected = selectedVariantIndex === i;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedVariantIndex(i)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs ${
                          isSelected
                            ? "bg-[var(--bg-elevated)] border-[var(--accent)]"
                            : "bg-[var(--bg-page)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? "bg-[var(--accent)]" : "bg-[var(--border-strong)]"
                            }`}
                          />
                          <span className="font-semibold text-[var(--text-primary)]">
                            {v.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] font-mono pl-4 sm:pl-0">
                          {v.finish && <span>{v.finish}</span>}
                          {v.minOrder && <span>MOQ: {v.minOrder}</span>}
                          {v.estPrice && (
                            <span className="text-[var(--accent)] font-semibold font-sans">
                              {v.estPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Business Applications Checklist */}
            {applications.length > 0 && (
              <div className="space-y-2">
                <p className="uppercase tracking-wider font-semibold text-[var(--text-muted)] text-[11px]">
                  Verified Deployments:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {applications.map((app, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-[var(--text-secondary)]"
                    >
                      <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href={`/#contact?product=${encodeURIComponent(
                  active.name + (activeVariant ? ` - ${activeVariant.name}` : "")
                )}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 transition-all shadow-xs"
              >
                Inquire for Hardware Batch
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/products/${active.slug}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-all"
              >
                View Complete Engineering Specs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
