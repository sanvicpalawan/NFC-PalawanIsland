"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Compass,
  Coffee,
  QrCode,
  Radio,
  Sparkles,
  Star,
  Sun,
  Waves,
  Wifi,
} from "lucide-react";

type Screen = "portal" | "menu" | "request" | "review";

const screens: { key: Screen; label: string; icon: typeof Coffee }[] = [
  { key: "portal", label: "Portal", icon: Sun },
  { key: "menu", label: "Menu", icon: Coffee },
  { key: "request", label: "Requests", icon: Sparkles },
  { key: "review", label: "Review", icon: Star },
];

/* ------------------------------------------------------------------ *
 * Complete, fully-populated screens. Nothing is clipped: the stack is
 * measured by content, so every row stays visible.
 * ------------------------------------------------------------------ */

function PortalScreen() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)]">
            <Wifi className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[var(--text-primary)]">Guest Wi-Fi</p>
            <p className="truncate font-mono text-[9px] text-[var(--text-muted)]">ElNido_Guest · connected</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 font-mono text-[9px] text-[var(--accent)]">OK</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Sunset hour", value: "5:30 PM", note: "Beach bar" },
          { label: "Low tide", value: "2:15 PM", note: "Reef walk" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{item.label}</p>
            <p className="mt-1 text-[12px] font-bold leading-tight text-[var(--text-primary)]">{item.value}</p>
            <p className="mt-0.5 text-[9.5px] text-[var(--text-secondary)]">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {[
          { icon: Coffee, title: "Order to the villa", meta: "Kitchen open until 10 PM" },
          { icon: Sparkles, title: "Housekeeping request", meta: "Average reply 6 min" },
          { icon: Compass, title: "Book tomorrow's tour", meta: "3 departures available" },
        ].map((row) => (
          <div key={row.title} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-2.5">
            <span className="flex min-w-0 items-center gap-2">
              <row.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" strokeWidth={1.8} />
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-semibold text-[var(--text-primary)]">{row.title}</span>
                <span className="block truncate text-[9px] text-[var(--text-muted)]">{row.meta}</span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="h-3 w-3 shrink-0 text-[var(--text-muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuScreen() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-[var(--text-primary)]">Island catch today</p>
        <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 font-mono text-[8.5px] text-[var(--accent)]">Live</span>
      </div>
      {[
        { name: "Grilled reef snapper", meta: "Calamansi butter · jasmine rice", price: "₱680", tag: "Gluten-free" },
        { name: "Calamansi tuna poke", meta: "Avocado · toasted sesame", price: "₱540", tag: "High protein" },
        { name: "Buko pandan float", meta: "Young coconut · pandan cream", price: "₱180", tag: "Vegan" },
      ].map((dish) => (
        <div key={dish.name} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[var(--text-primary)]">{dish.name}</p>
              <p className="mt-0.5 truncate text-[9px] text-[var(--text-muted)]">{dish.meta}</p>
            </div>
            <span className="shrink-0 font-mono text-[10.5px] font-bold text-[var(--accent)]">{dish.price}</span>
          </div>
          <span className="mt-1.5 inline-block rounded bg-[var(--tag-bg)] px-1.5 py-0.5 font-mono text-[8.5px] text-[var(--text-secondary)]">{dish.tag}</span>
        </div>
      ))}
      <div className="rounded-full bg-[var(--text-primary)] py-2 text-center text-[10.5px] font-semibold text-[var(--bg-page)]">
        Send order · Villa 12
      </div>
    </div>
  );
}

function RequestScreen() {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-[var(--text-primary)]">Your requests</p>
      {[
        { title: "Extra towels ×2", meta: "Villa 12 veranda", state: "Delivered", tone: "text-[var(--text-secondary)]", done: true },
        { title: "Late checkout 2 PM", meta: "Standard 11 AM", state: "Confirmed", tone: "text-[var(--text-secondary)]", done: true },
        { title: "Breakfast in-villa", meta: "Tomorrow, 8:30 AM", state: "Scheduled", tone: "text-[var(--accent)]", done: false },
      ].map((row) => (
        <div key={row.title} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2.5">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-[var(--text-primary)]">{row.title}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-[var(--text-muted)]">
              <Clock aria-hidden="true" className="h-2.5 w-2.5 shrink-0" /> {row.meta}
            </p>
          </div>
          <span className={`inline-flex shrink-0 items-center gap-1 font-mono text-[9px] ${row.tone}`}>
            {row.done ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
            {row.state}
          </span>
        </div>
      ))}
      <div className="flex gap-1.5">
        {["Towels", "Food", "Transport"].map((chip) => (
          <span key={chip} className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)] px-2.5 py-1 font-mono text-[9px] text-[var(--text-secondary)]">
            + {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReviewScreen() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-center">
        <div className="flex justify-center gap-0.5 text-[var(--accent)]">
          {[...Array(5)].map((_, index) => (
            <Star key={index} aria-hidden="true" className="h-4 w-4 fill-current" strokeWidth={0} />
          ))}
        </div>
        <p className="mt-2 text-[11.5px] font-bold leading-snug text-[var(--text-primary)]">How was your stay?</p>
        <p className="mt-1 text-[9.5px] leading-relaxed text-[var(--text-muted)]">Share what stood out and we will pass it to the team.</p>
      </div>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)]">Step 1 of 2</p>
        <p className="mt-1.5 text-[10.5px] font-semibold text-[var(--text-primary)]">Pick what mattered most</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Food", "Service", "Views", "Quiet"].map((chip) => (
            <span key={chip} className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
              {chip}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-full bg-[var(--accent)] py-2 text-center text-[10.5px] font-semibold text-white">
        Continue
      </div>
    </div>
  );
}

const bodies: Record<Screen, () => React.ReactElement> = {
  portal: PortalScreen,
  menu: MenuScreen,
  request: RequestScreen,
  review: ReviewScreen,
};

const titles: Record<Screen, string> = {
  portal: "Guest portal",
  menu: "Beach terrace menu",
  request: "Requests & services",
  review: "Share feedback",
};

export function HeroDeviceShowcase() {
  const [tapped, setTapped] = useState(false);
  const [screen, setScreen] = useState<Screen>("portal");
  const reduceMotion = useReducedMotion();

  // Auto-preview each screen once the tag has been tapped.
  useEffect(() => {
    if (!tapped || reduceMotion) return;
    const timer = setInterval(() => {
      setScreen((current) => screens[(screens.findIndex((item) => item.key === current) + 1) % screens.length].key);
    }, 4200);
    return () => clearInterval(timer);
  }, [tapped, reduceMotion]);

  const Body = bodies[screen];

  return (
    <div className="relative">
      {/* Photograph */}
      <div className="relative overflow-hidden rounded-[26px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[0_36px_80px_-48px_rgba(20,21,24,0.45)] sm:rounded-[32px]">
        <Image
          src="/images/merqato-hero-tap.jpg"
          alt="A guest's phone resting above a MerQato smart tag on a resort table"
          width={1280}
          height={1536}
          priority
          className="aspect-[4/5] w-full object-cover sm:aspect-[16/13] lg:aspect-[4/5]"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-page)]/70 via-transparent to-transparent" />

        {/* Tag activation pad */}
        <button
          type="button"
          onClick={() => setTapped((value) => !value)}
          aria-pressed={tapped}
          aria-label={tapped ? "Hide the connected experience" : "Show the connected experience"}
          className="group absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full border border-white/25 bg-black/55 py-1.5 pl-1.5 pr-4 text-white backdrop-blur-md transition-colors hover:bg-black/70 sm:bottom-5 sm:left-5"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)]">
            {!reduceMotion && tapped && (
              <span aria-hidden="true" className="absolute inset-0 animate-nfc-wave rounded-full border border-[var(--accent)]" />
            )}
            <Radio aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <span className="text-left">
            <span className="block text-[11px] font-semibold leading-none">
              {tapped ? "Connected" : "Tap the tag"}
            </span>
            <span className="mt-0.5 block font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/70">
              {tapped ? "Live experience" : "See what opens"}
            </span>
          </span>
        </button>

        <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white backdrop-blur-md sm:right-5 sm:top-5">
          NFC + QR
        </span>
      </div>

      {/* Floating device with the complete experience */}
      <AnimatePresence>
        {tapped && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, rotate: -3, scale: 0.94 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: -2, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }}
            className="absolute -bottom-6 right-2 w-[196px] rounded-[26px] border border-[var(--border-strong)] bg-[var(--bg-page)] p-1.5 shadow-[0_28px_60px_-28px_rgba(20,21,24,0.5)] sm:-bottom-8 sm:right-6 sm:w-[224px] sm:p-2"
          >
            <div className="overflow-hidden rounded-[20px] bg-[var(--bg-page)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-2.5 py-2">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[7.5px] uppercase tracking-[0.14em] text-[var(--text-muted)]">El Nido Bayview</p>
                  <p className="truncate text-[10px] font-bold leading-tight text-[var(--text-primary)]">{titles[screen]}</p>
                </div>
                <span className="shrink-0 rounded bg-[var(--accent-subtle)] px-1.5 py-0.5 font-mono text-[7.5px] text-[var(--accent)]">Villa 12</span>
              </div>

              <div className="flex gap-1 px-2 pt-2">
                {screens.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setScreen(item.key)}
                    aria-pressed={screen === item.key}
                    aria-label={`Show ${item.label}`}
                    className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors ${
                      screen === item.key ? "bg-[var(--text-primary)] text-[var(--bg-page)]" : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <item.icon aria-hidden="true" className="h-3 w-3" strokeWidth={1.9} />
                    <span className="font-mono text-[7px] uppercase tracking-[0.06em]">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-2.5">
                <Body />
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-2.5 py-1.5">
                <span className="font-mono text-[7.5px] text-[var(--text-muted)]">No app installed</span>
                <Waves aria-hidden="true" className="h-2.5 w-2.5 text-[var(--accent)]" />
              </div>
            </div>

            <p className="pt-1.5 text-center font-mono text-[7px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Illustrative interface
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reserve space so the layout never jumps when the device appears. */}
      <div aria-hidden="true" className="h-8 sm:h-10" />
    </div>
  );
}

export { QrCode };
