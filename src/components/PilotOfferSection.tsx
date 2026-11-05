"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";

interface PilotSettings {
  title?: string;
  badge?: string;
  durationDays?: number;
  setupCommitmentPhp?: number;
  regularValuePhp?: number;
  inclusions?: string[];
  eligibility?: string;
  spotsRemaining?: number;
  maxSpots?: number;
  guaranteeText?: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function PilotOfferSection({ settings }: { settings?: PilotSettings }) {
  const reduceMotion = useReducedMotion();
  const title = settings?.title || "Palawan Hospitality Pilot";
  const badge = settings?.badge || "Limited to 20 Palawan hospitality venues";
  const duration = settings?.durationDays || 90;
  const setupPhp = settings?.setupCommitmentPhp || 1000;
  const regularValue = settings?.regularValuePhp || 12500;
  const spotsRemaining = settings?.spotsRemaining !== undefined ? settings?.spotsRemaining : 7;
  const maxSpots = settings?.maxSpots || 20;

  const inclusions = settings?.inclusions ?? [
    "25 custom-designed physical MerQato smart NFC & QR tabletop discs or standups",
    "Branded mobile guest portal: digital menu, instant concierge & guest requests",
    "1-Tap Google Review accelerator directly configured for your venue",
    "On-site deployment, staff training & setup in Puerto Princesa, El Nido, Coron, or San Vicente",
    "90 days of full digital experience hosting, zero monthly fees during pilot",
    "Hardware ownership: Keep all physical smart tags even after the 90-day trial",
    "Priority onboarding for future POS & PMS integrations",
  ];

  const eligibility =
    settings?.eligibility ||
    "Open to licensed boutique resorts, eco-lodges, beachfront restaurants, cafes, and island tour operators operating in Palawan.";

  const spotsPct = maxSpots > 0 ? Math.min(100, Math.max(0, ((maxSpots - spotsRemaining) / maxSpots) * 100)) : 0;

  return (
    <section id="pilot-program" className="relative overflow-hidden bg-[var(--bg-page)] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_24px_64px_-52px_rgba(20,21,24,0.4)] sm:rounded-[28px]"
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="grid gap-8 border-b border-[var(--border-subtle)] p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:p-12">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
                <Sparkles aria-hidden="true" className="h-3 w-3" strokeWidth={1.9} />
                {badge}
              </span>

              <h2 className="mt-5 font-serif-editorial text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.06] tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>

              <p className="mt-4 max-w-[58ch] text-[14px] leading-[1.7] text-[var(--text-secondary)]">
                Run MerQato across your own tables, rooms, and tours before committing to anything. We deploy, train your
                team, and review results with you at the end of the trial.
              </p>

              <p className="mt-5 flex items-start gap-2 text-[12px] leading-relaxed text-[var(--text-muted)]">
                <MapPin aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" strokeWidth={1.8} />
                On-site rollout across Puerto Princesa, El Nido, Coron &amp; San Vicente
              </p>
            </div>

            {/* ── Price panel ─────────────────────────────────────── */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-page)] p-5 sm:p-6">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]" />

              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                One-time setup
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="font-serif-editorial text-[38px] font-bold leading-none tracking-tight text-[var(--text-primary)]">
                  ₱{setupPhp.toLocaleString()}
                </span>
                <span className="pb-1 text-[11px] text-[var(--text-muted)]">total</span>
              </div>

              <p className="mt-2 text-[12px] font-medium text-[var(--accent)]">
                {duration} days full access · hardware included
              </p>

              <dl className="mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-[12px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">Typical value</dt>
                  <dd className="font-mono text-[var(--text-muted)] line-through">
                    ₱{regularValue.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--text-muted)]">Monthly during trial</dt>
                  <dd className="font-mono font-semibold text-[var(--text-primary)]">₱0</dd>
                </div>
              </dl>

              {/* Cohort availability */}
              <div className="mt-5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  <span>Pilot allocation</span>
                  <span className="text-[var(--accent)]">
                    {spotsRemaining}/{maxSpots} left
                  </span>
                </div>
                <div aria-hidden="true" className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <motion.div
                    initial={reduceMotion ? false : { width: 0 }}
                    whileInView={{ width: `${spotsPct}%` }}
                    viewport={{ once: true }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-[var(--accent)]"
                  />
                </div>
              </div>

              <Link
                href="/#contact?subject=PilotProgram"
                className="group mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--text-primary)] px-5 text-[13px] font-semibold text-[var(--bg-page)] transition-colors hover:bg-[var(--accent)]"
              >
                Apply for the pilot
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <p className="mt-3 text-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                No automatic rollover billing
              </p>
            </div>
          </div>

          {/* ── Inclusions: editorial numbered list ────────────────── */}
          <div className="p-6 sm:p-9 lg:p-12">
            <motion.h3
              variants={container}
              initial={reduceMotion ? undefined : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.2 }}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]"
            >
              What the pilot includes
            </motion.h3>

            <motion.ul
              variants={container}
              initial={reduceMotion ? undefined : "hidden"}
              whileInView={reduceMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.15 }}
              className="mt-6 grid gap-x-10 gap-y-0 md:grid-cols-2 lg:grid-cols-3"
            >
              {inclusions.map((inclusion, index) => (
                <motion.li
                  key={index}
                  variants={item}
                  className="group flex items-start gap-3.5 border-b border-[var(--border-subtle)] py-4 first:pt-0 md:[&:nth-last-child(2)]:border-b-0 lg:[&:nth-child(-n+3)]:pt-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n))]:pr-8"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] leading-[1.6] text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                    {inclusion}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* ── Eligibility strip ────────────────────────────────── */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={1.8} />
                {eligibility}
              </p>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">
                Day {duration} review included
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
