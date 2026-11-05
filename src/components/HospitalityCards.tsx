"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MotionFlipCard } from "./MotionFlipCard";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  CheckCircle2,
  Coffee,
  Compass,
  Menu,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Solution = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  features: unknown;
};

const icons: Record<string, LucideIcon> = {
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

function SolutionCard({
  solution,
  compact = false,
  showLink = true,
  onActionHover,
}: {
  solution: Solution;
  compact?: boolean;
  showLink?: boolean;
  onActionHover?: (hovered: boolean) => void;
}) {
  const Icon = icons[solution.slug] ?? Zap;
  const features = Array.isArray(solution.features)
    ? solution.features.filter((feature): feature is string => typeof feature === "string")
    : [];

  return (
    <div
      className={`group flex h-full flex-col justify-between rounded-[26px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-left transition-[border-color,box-shadow] duration-300 hover:border-[var(--accent)] hover:shadow-md ${
        compact ? "p-5 min-[390px]:p-6" : "p-6"
      }`}
    >
      <div className="min-h-0">
        <div className="flex items-center justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--accent)] transition-transform duration-300 group-hover:rotate-[-7deg]">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="rounded bg-[var(--tag-bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
            Native Web
          </span>
        </div>

        <div className={compact ? "mt-4" : "mt-5"}>
          <h3 className="font-serif-editorial text-[18px] font-bold leading-[1.2] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)] sm:text-[19px]">
            {solution.title}
          </h3>
          {solution.subtitle && (
            <p className={`mt-1 text-xs font-medium leading-snug text-[var(--accent)] ${compact ? "line-clamp-2" : ""}`}>
              {solution.subtitle}
            </p>
          )}
        </div>

        <p className={`mt-3 text-xs leading-[1.65] text-[var(--text-secondary)] ${compact ? "line-clamp-4" : showLink ? "" : "line-clamp-3"}`}>
          {solution.description}
        </p>

        {features.length > 0 && (
          <ul className={`mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-3 ${compact ? "" : ""}`}>
            {features.slice(0, 2).map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showLink ? (
        <Link
          href={`/use-cases/${solution.slug}`}
          onPointerEnter={() => onActionHover?.(true)}
          onPointerLeave={() => onActionHover?.(false)}
          onFocus={() => onActionHover?.(true)}
          onBlur={() => onActionHover?.(false)}
          className="inline-flex min-h-10 w-fit items-center gap-2 pt-3 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Explore Solution Details
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <span aria-hidden="true" className="mt-auto block h-10" />
      )}
    </div>
  );
}

const stageHeight = "h-[462px] min-[375px]:h-[432px] min-[480px]:h-[420px]";
const cardHeight = "h-[410px] min-[375px]:h-[380px] min-[480px]:h-[368px]";

export function HospitalityCards({ items }: { items: Solution[] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const reduceMotion = useReducedMotion();
  const total = items.length;

  const change = useCallback(
    (step: number) => {
      if (total < 2) return;
      setDirection(step);
      setActive((index) => (index + step + total) % total);
    },
    [total],
  );

  // Only a fine pointer triggers automatic shuffling. Touch users retain normal
  // vertical page scrolling and can swipe sideways or use the arrow buttons.
  useEffect(() => {
    if (!hovered || paused || focusWithin || reduceMotion || total < 2) return;
    const first = window.setTimeout(() => change(1), 1050);
    const interval = window.setInterval(() => change(1), 3400);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [hovered, paused, focusWithin, reduceMotion, total, change]);

  function onDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setPaused(false);
    if (info.offset.x < -55 || info.velocity.x < -450) change(1);
    else if (info.offset.x > 55 || info.velocity.x > 450) change(-1);
  }

  if (!total) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-6 text-sm text-[var(--text-muted)]">
        Hospitality solutions will appear here when published.
      </div>
    );
  }

  const current = items[active];
  const next = items[(active + 1) % total];

  return (
    <>
      {/* Mobile: one readable card and two ordered, overlapping cards behind it. */}
      <div
        className="rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hospitality solutions"
        tabIndex={0}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            change(1);
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            change(-1);
          }
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
            {total > 1 ? "Swipe · hover to shuffle" : "Explore this solution"}
          </p>
          <span className="font-mono text-[11px] text-[var(--accent)]" aria-live="polite" aria-atomic="true">
            {String(active + 1).padStart(2, "0")} <span className="text-[var(--text-muted)]">/</span> {String(total).padStart(2, "0")}
          </span>
        </div>

        <div
          className={`relative mx-1 overflow-hidden rounded-[28px] ${stageHeight}`}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse" || event.pointerType === "pen") setHovered(true);
          }}
          onPointerLeave={() => {
            setHovered(false);
            setPaused(false);
          }}
        >
          {total > 1 &&
            [2, 1].map((depth) => {
              if (total <= depth) return null;
              const behind = items[(active + depth) % total];
              return (
                <motion.div
                  key={`behind-${depth}-${behind.id}`}
                  aria-hidden="true"
                  initial={reduceMotion ? false : { y: 46, scale: 0.88, opacity: 0 }}
                  animate={{
                    y: hovered && !reduceMotion ? (depth === 1 ? 26 : 38) : depth * 17,
                    scale: 1 - depth * 0.045,
                    opacity: 1 - depth * 0.22,
                    rotate: hovered && !reduceMotion ? (depth === 1 ? 0.8 : -1.1) : 0,
                  }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 290, damping: 29 }}
                  className={`pointer-events-none absolute inset-x-0 top-[14px] ${cardHeight}`}
                  style={{ zIndex: 3 - depth }}
                >
                  <div className="h-full rounded-[26px] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[0_12px_28px_rgba(20,21,24,0.06)]" />
                </motion.div>
              );
            })}

          <AnimatePresence mode="sync" initial={false} custom={direction}>
            <motion.article
              key={current.id}
              initial={reduceMotion ? { opacity: 1 } : { y: direction * 54, scale: 0.96, opacity: 0 }}
              animate={{ y: hovered && !reduceMotion ? -10 : 0, x: 0, scale: hovered && !reduceMotion ? 1.012 : 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -direction * 112, x: 0, scale: 0.94, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 31, mass: 0.85 }}
              drag={total > 1 && !reduceMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragStart={() => setPaused(true)}
              onDragEnd={onDragEnd}
              className={`absolute inset-x-0 top-[14px] z-10 touch-pan-y select-none ${cardHeight}`}
            >
              <SolutionCard solution={current} compact onActionHover={setPaused} />
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => change(-1)}
              disabled={total < 2}
              aria-label="Previous hospitality solution"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => change(1)}
              disabled={total < 2}
              aria-label="Next hospitality solution"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] transition-colors hover:bg-[var(--accent)] disabled:opacity-40"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="min-w-0 truncate text-right text-[11px] text-[var(--text-muted)]">
            Next: <span className="font-medium text-[var(--text-secondary)]">{next.title}</span>
          </p>
        </div>
        <div aria-hidden="true" className="mt-4 flex gap-1.5">
          {items.map((item, index) => (
            <span
              key={item.id}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === active ? "w-6 bg-[var(--accent)]" : "w-2 bg-[var(--border-strong)]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tablet and desktop: keep the grid, but reveal cards only when in view. */}
      <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {items.map((solution, index) => (
          <motion.article
            key={solution.id}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: (index % 3) * 0.075, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <MotionFlipCard
              label={solution.title}
              className="h-[360px] lg:h-[344px]"
              front={<SolutionCard solution={solution} showLink={false} />}
              back={
                <div className="flex h-full flex-col rounded-[26px] border border-[var(--accent-border)] bg-[var(--accent-subtle)] p-6 pr-12">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">Connected solution</span>
                  <h4 className="mt-5 font-serif-editorial text-[21px] font-bold leading-tight text-[var(--text-primary)]">
                    {solution.title}
                  </h4>
                  <p className="mt-3 line-clamp-6 text-[13px] leading-[1.6] text-[var(--text-secondary)]">
                    {solution.description}
                  </p>
                  <Link
                    href={`/use-cases/${solution.slug}`}
                    className="mt-auto inline-flex min-h-10 w-fit items-center gap-2 border-t border-[var(--accent-border)] pt-3 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    Explore solution details <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              }
            />
          </motion.article>
        ))}
      </div>
    </>
  );
}
