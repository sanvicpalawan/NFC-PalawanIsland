"use client";

import { useState } from "react";
import {
  ClipboardList,
  Hand,
  Layers,
  Repeat,
  Eye,
  Printer,
  ArrowUpRight,
  Rotate3d,
  Check,
} from "lucide-react";

type Outcome = {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ElementType;
  backTitle: string;
  backDescription: string;
  backMeta: string;
};

const outcomes: Outcome[] = [
  {
    eyebrow: "MANUAL RE-ENTRY",
    title: "Less manual work",
    description:
      "Requests, orders and records arrive structured instead of being written down, repeated and re-typed at the end of a shift.",
    icon: ClipboardList,
    backTitle: "What you can measure",
    backDescription:
      "During the pilot, your staff keep the structured entry log — compare it to re-typed shift notes you already do today.",
    backMeta: "No hand-entered numbers. You keep the log.",
  },
  {
    eyebrow: "SERVICE REACH",
    title: "Easier guest interaction",
    description:
      "A guest who would not walk to the desk will tap a tag beside the bed. Service becomes available at 2am without staffing for it.",
    icon: Hand,
    backTitle: "What becomes possible",
    backDescription:
      "A tap beside the bed routes the request to whoever is on duty — without adding a desk shift to cover 2am.",
    backMeta: "Observed: taps by location and time.",
  },
  {
    eyebrow: "SINGLE SOURCE",
    title: "Centralised information",
    description:
      "Menus, safety notes, manuals and house rules live in one place. Update once and every tag reflects it immediately.",
    icon: Layers,
    backTitle: "How it stays consistent",
    backDescription:
      "Edit a manual or menu once in NFC Palawan Island. Every linked tag points to the same live page — no reprinting.",
    backMeta: "One edit. Instant across all tags.",
  },
  {
    eyebrow: "RETURN VISITS",
    title: "Repeat business opportunities",
    description:
      "Loyalty records and visit history give you a reason to welcome a returning guest by name and a way to invite them back.",
    icon: Repeat,
    backTitle: "How recalls are created",
    backDescription:
      "A repeat tap creates a timestamped visit record you can use to recognise a guest and follow up — inside your system.",
    backMeta: "Your guest data stays yours.",
  },
  {
    eyebrow: "VISIBILITY",
    title: "Better operational visibility",
    description:
      "Every interaction carries a timestamp, a location and an owner, so bottlenecks and recurring faults become visible to whoever runs the site.",
    icon: Eye,
    backTitle: "What becomes visible",
    backDescription:
      "See requests by time, tag location, and handler — so recurring delays or faults surface for the manager on duty.",
    backMeta: "Time • Location • Owner on every tap.",
  },
  {
    eyebrow: "PRINT SPEND",
    title: "Print and admin cost falls",
    description:
      "Compendiums, laminated menus and instruction sheets stop being a recurring print job.",
    icon: Printer,
    backTitle: "What stops recurring",
    backDescription:
      "House manuals and menus live on the tag destination. No lamination cycle when a price or rule changes.",
    backMeta: "Print only when you choose to.",
  },
];

export function FlipOutcomesSection() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 lg:py-28 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <h2 className="text-[28px] sm:text-[40px] lg:text-[46px] font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial leading-[0.95]">
            What changes when the object is
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            connected.
          </h2>
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] leading-relaxed text-[var(--text-secondary)] max-w-[48rem]">
            Operational outcomes we design for — measured inside your business, not
            promised from a marketing deck.
          </p>

          {/* subtle hint for interaction */}
          <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase font-mono text-[var(--text-muted)]">
            <Rotate3d className="w-3.5 h-3.5 text-[var(--accent)]" />
            Hover to flip — tap to flip on mobile
          </p>
        </div>

        {/* Card grid — outer rounded container like reference */}
        <div className="mt-8 sm:mt-10 rounded-[18px] sm:rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-page)] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((item, idx) => {
              const Icon = item.icon;
              const isFlipped = flippedIndex === idx;

              // Staggered entrance delay
              const delay = `${idx * 70}ms`;

              return (
                <div
                  key={item.eyebrow}
                  className="perspective-1100 min-h-[228px] sm:min-h-[250px] border-b border-[var(--border-subtle)] last:border-b-0 md:border-b-0 md:border-r lg:border-b lg:[&:nth-child(n+4)]:border-b-0 [&:nth-child(3n)]:md:border-r-0 [&:nth-child(3n)]:lg:border-r-0 odd:md:border-r even:md:border-r-0 lg:odd:border-r lg:even:border-r bg-[var(--bg-page)] group/card"
                  style={{
                    animation: `flipIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both`,
                    animationDelay: delay,
                  }}
                >
                  {/* Flip inner — uses both hover (desktop) and click (mobile) */}
                  <button
                    type="button"
                    aria-label={`Flip card: ${item.title}`}
                    onClick={() =>
                      setFlippedIndex(isFlipped ? null : idx)
                    }
                    onMouseEnter={() => {
                      // Only auto-hover flip on desktop; keep click as override
                      if (window.matchMedia("(hover: hover)").matches) {
                        setFlippedIndex(idx);
                      }
                    }}
                    onMouseLeave={() => {
                      if (window.matchMedia("(hover: hover)").matches) {
                        setFlippedIndex(null);
                      }
                    }}
                    className="w-full h-full min-h-[228px] sm:min-h-[250px] text-left relative preserve-3d block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className={`flip-card-inner absolute inset-0 w-full h-full preserve-3d ${
                        isFlipped ? "flipped" : ""
                      }`}
                    >
                      {/* FRONT */}
                      <div className="front-face absolute inset-0 backface-hidden bg-[var(--bg-page)] p-5 sm:p-6 lg:p-7 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[10px] sm:text-[11px] tracking-[0.14em] font-mono font-medium text-[var(--accent)]">
                            {item.eyebrow}
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] tracking-widest uppercase font-mono text-[var(--text-muted)]">
                            <span className="opacity-60 group-hover/card:opacity-100 transition-opacity">Flip</span>
                            <ArrowUpRight className="w-3 h-3 opacity-40 group-hover/card:opacity-100 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all" />
                          </span>
                        </div>

                        <h3 className="mt-3 text-[17px] sm:text-[18px] font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial leading-tight">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-[13px] sm:text-[13.5px] leading-[1.55] text-[var(--text-secondary)]">
                          {item.description}
                        </p>

                        {/* subtle bottom accent line that draws on hover */}
                        <div className="mt-auto pt-5">
                          <div className="h-[1px] w-full bg-[var(--border-subtle)] overflow-hidden">
                            <div className="h-full w-0 bg-[var(--accent)] group-hover/card:w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                          </div>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="back-face absolute inset-0 backface-hidden rotate-y-180 bg-[var(--bg-surface)] p-5 sm:p-6 lg:p-7 flex flex-col border border-transparent">
                        {/* warm back header */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent)] text-white shadow-sm">
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-[10px] tracking-[0.14em] font-mono font-semibold text-[var(--accent)] uppercase">
                            {item.backTitle}
                          </span>
                        </div>

                        <p className="mt-3 text-[13.5px] leading-[1.55] text-[var(--text-primary)] font-medium">
                          {item.backDescription}
                        </p>

                        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                          <Check className="w-3 h-3 text-[var(--accent)]" />
                          <span>{item.backMeta}</span>
                        </div>

                        <div className="mt-auto pt-4 flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
                          <Rotate3d className="w-3 h-3" />
                          Tap to return
                        </div>

                        {/* subtle grain overlay */}
                        <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-pattern-subtle" />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 sm:mt-5 text-[11px] sm:text-xs leading-relaxed text-[var(--text-muted)] max-w-4xl">
          We do not publish invented customer statistics or guaranteed revenue
          outcomes. Each of these outcomes is measured inside your own operation
          during the pilot, and you keep the numbers.
        </p>
      </div>
    </section>
  );
}
