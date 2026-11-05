"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowRight, Check, Nfc, QrCode, Smartphone } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "Tap",
    eyebrow: "The physical moment",
    title: "Tap or scan a smart tag.",
    description:
      "A guest holds their phone near a NFC Palawan Island tag or scans its QR code. No app, account, or extra hardware is needed on their side.",
    note: "NFC + QR fallback",
  },
  {
    number: "02",
    label: "Open",
    eyebrow: "The connected experience",
    title: "Open the right experience.",
    description:
      "A branded mobile page opens in the guest’s browser. The tag can lead to a menu, guest portal, booking page, or the right information for that place.",
    note: "Right place · right page",
  },
  {
    number: "03",
    label: "Act",
    eyebrow: "A useful outcome",
    title: "Make the moment count.",
    description:
      "Guests can order, book, send a request, or leave feedback. The business gets a clear action rather than another paper form or missed conversation.",
    note: "Action, not just a scan",
  },
] as const;

function StepVisual({ step, reduceMotion }: { step: number; reduceMotion: boolean | null }) {
  return (
    <div className="relative flex h-[145px] items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] sm:h-[170px] md:h-[235px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 10%, transparent 78%)",
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.96 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          {step === 0 && (
            <div className="flex items-center gap-5 sm:gap-8">
              <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--bg-page)] shadow-[0_12px_28px_rgba(20,21,24,0.08)] sm:h-24 sm:w-24">
                {!reduceMotion && [0, 0.8].map((delay) => (
                  <motion.span
                    key={delay}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[var(--accent)]"
                    animate={{ scale: [1, 1.85], opacity: [0.5, 0] }}
                    transition={{ duration: 2.5, delay, repeat: Infinity, ease: "easeOut" }}
                  />
                ))}
                <span className="grid h-12 w-12 place-items-center rounded-full border border-dashed border-[var(--border-strong)] text-[var(--accent)] sm:h-14 sm:w-14">
                  <Nfc aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
                </span>
              </div>
              <div className="flex flex-col items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Smart tag</span>
                <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)] px-2.5 py-1 text-[11px] text-[var(--text-primary)]">
                  <QrCode aria-hidden="true" className="h-3.5 w-3.5 text-[var(--accent)]" />
                  QR fallback
                </span>
                <span className="font-mono text-[10px] text-[var(--accent)]">Tap or scan →</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="w-[215px] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--bg-page)] shadow-[0_16px_36px_rgba(20,21,24,0.12)] sm:w-[248px]">
              <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                <span className="ml-auto font-mono text-[9px] text-[var(--text-muted)]">merqato.digital</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-3 sm:py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                  <Smartphone aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="font-serif-editorial text-[15px] font-bold leading-tight text-[var(--text-primary)]">Guest portal</p>
                  <p className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">Menu · Services · Places</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex w-[222px] items-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-page)] px-4 py-4 shadow-[0_16px_36px_rgba(20,21,24,0.12)] sm:w-[260px]">
              <motion.span
                initial={reduceMotion ? false : { scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 17, delay: 0.12 }}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]"
              >
                <Check aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
              </motion.span>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Example action</p>
                <p className="mt-1 font-serif-editorial text-[16px] font-bold leading-tight text-[var(--text-primary)]">Request sent</p>
                <p className="mt-1 text-[10px] text-[var(--text-secondary)]">Clear next step for the team</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <span className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--text-muted)] sm:bottom-3 sm:left-4">
        Illustrative flow · not live activity
      </span>
    </div>
  );
}

export function HowItWorksFlow() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const step = steps[active];

  const select = (index: number) => {
    setDirection(index < active ? -1 : 1);
    setActive(index);
  };

  const advance = (delta: number) => {
    setDirection(delta);
    setActive((index) => (index + delta + steps.length) % steps.length);
  };

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -55 || info.velocity.x < -450) advance(1);
    else if (info.offset.x > 55 || info.velocity.x > 450) advance(-1);
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-page)] shadow-sm sm:rounded-[28px]">
      <div className="grid grid-cols-3 border-b border-[var(--border-subtle)]" role="tablist" aria-label="How NFC Palawan Island works">
        {steps.map((item, index) => (
          <button
            key={item.number}
            ref={(node) => { tabRefs.current[index] = node; }}
            type="button"
            id={`nfc-palawan-island-step-${item.number}`}
            role="tab"
            aria-selected={active === index}
            aria-controls="nfc-palawan-island-step-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              let target = index;
              if (event.key === "ArrowRight") target = (index + 1) % steps.length;
              else if (event.key === "ArrowLeft") target = (index - 1 + steps.length) % steps.length;
              else if (event.key === "Home") target = 0;
              else if (event.key === "End") target = steps.length - 1;
              else return;
              event.preventDefault();
              select(target);
              tabRefs.current[target]?.focus();
            }}
            className={`relative flex min-h-14 items-center justify-center gap-1.5 border-r border-[var(--border-subtle)] px-2 py-3 text-[12px] font-semibold transition-colors last:border-r-0 sm:gap-2 sm:text-[14px] ${
              active === index ? "bg-[var(--accent-subtle)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span className={`font-mono text-[11px] ${active === index ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>{item.number}</span>
            <span>{item.label}</span>
            {active === index && (
              <motion.span
                layoutId="how-it-works-active-step"
                className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        id="nfc-palawan-island-step-panel"
        role="tabpanel"
        aria-labelledby={`nfc-palawan-island-step-${step.number}`}
        className="grid touch-pan-y gap-5 p-5 sm:gap-7 sm:p-7 md:grid-cols-[1fr_0.9fr] md:items-center md:p-8"
        drag={reduceMotion ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={onDragEnd}
      >
        <div className="order-2 min-w-0 md:order-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
            Step {step.number} / 03 · {step.eyebrow}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 22, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -direction * 22, y: -10 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="mt-2.5 font-serif-editorial text-[22px] font-bold leading-[1.18] text-[var(--text-primary)] sm:text-[27px] lg:text-[30px]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[48ch] text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:text-[14px]">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)]">{step.note}</span>
            <button
              type="button"
              onClick={() => advance(1)}
              aria-label={`Next step: ${steps[(active + 1) % steps.length].label}`}
              className="group inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-3.5 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Next
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
        <div className="order-1 min-w-0 md:order-2">
          <StepVisual step={active} reduceMotion={reduceMotion} />
        </div>
      </motion.div>

      <div aria-hidden="true" className="h-0.5 bg-[var(--border-subtle)]">
        <motion.div
          className="h-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
