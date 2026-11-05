"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Hotel,
  Layers,
  Ship,
  Sparkles,
  SunMedium,
  Ticket,
  Truck,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type IndustryItem = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  icon: string | null;
  imageUrl: string | null;
  isPrimary: boolean | null;
  benefits: unknown;
};

type UseCaseItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  industrySlugs: unknown;
};

const icons: Record<string, LucideIcon> = {
  Hotel,
  Utensils,
  Ship,
  Building2,
  SunMedium,
  Wrench,
  Sparkles,
  Truck,
  Ticket,
  Layers,
};

const MAX_WORKFLOWS = 6;

export function IndustrySelector({
  industries,
  useCases,
}: {
  industries: IndustryItem[];
  useCases: UseCaseItem[];
}) {
  const [selectedSlug, setSelectedSlug] = useState(
    () => industries.find((industry) => industry.isPrimary)?.slug ?? industries[0]?.slug ?? "",
  );
  const reduceMotion = useReducedMotion();

  if (industries.length === 0) {
    return (
      <p className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-6 text-sm text-[var(--text-muted)]">
        Industry solutions will appear here when published.
      </p>
    );
  }

  const current = industries.find((industry) => industry.slug === selectedSlug) ?? industries[0];
  const Icon = current.icon ? icons[current.icon] ?? Layers : Layers;
  const benefits = Array.isArray(current.benefits)
    ? current.benefits.filter((benefit): benefit is string => typeof benefit === "string" && benefit.trim().length > 0)
    : [];
  const matching = useCases.filter(
    (useCase) => Array.isArray(useCase.industrySlugs) && useCase.industrySlugs.includes(current.slug),
  );
  const visibleWorkflows = matching.slice(0, MAX_WORKFLOWS);

  return (
    <div className="overflow-hidden rounded-[26px] border border-[var(--border-subtle)] bg-[var(--bg-page)] shadow-[0_18px_48px_-44px_rgba(20,21,24,0.3)] sm:rounded-[30px]">
      <div className="grid lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Industry picker */}
        <nav
          aria-label="Choose an industry"
          className="min-w-0 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-5"
        >
          <div
            role="tablist"
            aria-label="Industries"
            aria-orientation="horizontal"
            className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
          >
            {industries.map((industry, index) => {
              const TabIcon = industry.icon ? icons[industry.icon] ?? Layers : Layers;
              const selected = industry.slug === current.slug;
              return (
                <button
                  key={industry.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedSlug(industry.slug)}
                  onKeyDown={(event) => {
                    let target = index;
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % industries.length;
                    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + industries.length) % industries.length;
                    else if (event.key === "Home") target = 0;
                    else if (event.key === "End") target = industries.length - 1;
                    else return;
                    event.preventDefault();
                    setSelectedSlug(industries[target].slug);
                    event.currentTarget.parentElement?.querySelectorAll("button")[target]?.focus();
                  }}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-[13px] transition-colors lg:w-full ${
                    selected
                      ? "border-[var(--border-strong)] bg-[var(--bg-page)] font-semibold text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-page)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <TabIcon
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 ${selected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
                    strokeWidth={1.7}
                  />
                  <span className="whitespace-nowrap lg:max-w-[150px] lg:truncate">{industry.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Selected industry */}
        <motion.article
          key={current.slug}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
          className="min-w-0"
        >
          <div className="grid md:grid-cols-[1.05fr_0.95fr]">
            {/* Copy */}
            <div className="order-2 min-w-0 p-5 sm:p-7 md:order-1 md:flex md:flex-col md:justify-center lg:p-8">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                <Icon aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.6} />
                {current.isPrimary ? "Flagship market" : "Connected industry"}
              </span>

              <h3 className="mt-4 font-serif-editorial text-[clamp(1.75rem,3.6vw,2.6rem)] leading-[1.08] tracking-tight text-[var(--text-primary)]">
                {current.name}
              </h3>

              {current.tagline && (
                <p className="mt-2 text-[14px] font-medium leading-snug text-[var(--accent)] sm:text-[15px]">{current.tagline}</p>
              )}

              <p className="mt-4 max-w-[52ch] text-[13px] leading-[1.7] text-[var(--text-secondary)] sm:text-[14px]">
                {current.description}
              </p>

              {benefits.length > 0 && (
                <ul className="mt-6 space-y-2.5 border-t border-[var(--border-subtle)] pt-5">
                  {benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-[13px] leading-[1.55] text-[var(--text-secondary)]">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/industries/${current.slug}`}
                className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--text-primary)] px-5 text-[13px] font-semibold text-[var(--bg-page)] transition-colors hover:bg-[var(--accent)]"
              >
                Explore {current.name}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Image */}
            <div className="order-1 min-w-0 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] md:order-2 md:border-b-0 md:border-l">
              <div className="relative h-[190px] w-full overflow-hidden sm:h-[230px] md:h-full md:min-h-[360px]">
                <Image
                  src={current.imageUrl || "/images/nfc-palawan-island-hero-tap.jpg"}
                  alt={`${current.name} — illustrative setting`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>

          {/* Workflows */}
          {visibleWorkflows.length > 0 && (
            <div className="min-w-0 border-t border-[var(--border-subtle)] p-5 sm:p-7 lg:p-8">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                What you can connect here
              </h4>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleWorkflows.map((useCase) => (
                  <Link
                    key={useCase.id}
                    href={`/use-cases/${useCase.slug}`}
                    className="group flex min-h-[112px] flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-sm"
                  >
                    <span className="text-[13px] font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                      {useCase.title}
                    </span>
                    <span className="mt-1.5 line-clamp-2 text-[11.5px] leading-[1.5] text-[var(--text-muted)]">
                      {useCase.subtitle || useCase.description}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>

              {matching.length > visibleWorkflows.length && (
                <Link
                  href={`/industries/${current.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  See all {matching.length} workflows
                  <ArrowRight aria-hidden="true" className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
}
