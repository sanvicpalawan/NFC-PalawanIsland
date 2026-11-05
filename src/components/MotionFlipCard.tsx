"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";

/** A two-sided card. Hover reveals details on pointer devices; tap/Enter
 * reveals them on touch or keyboard. Links belong on the back, not inside the
 * front button. Reduced-motion visitors get an immediate state change. */
export function MotionFlipCard({
  label,
  front,
  back,
  className = "",
}: {
  label: string;
  front: ReactNode;
  back: ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: 1100 }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" || event.pointerType === "pen") setFlipped(true);
      }}
      onPointerLeave={() => setFlipped(false)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFlipped(false);
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 155, damping: 22, mass: 0.8 }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <button
          type="button"
          tabIndex={flipped ? -1 : 0}
          onClick={() => setFlipped(true)}
          aria-label={`Flip ${label} to see details`}
          aria-expanded={flipped}
          className="absolute inset-0 h-full w-full cursor-pointer text-left focus-visible:rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            pointerEvents: flipped ? "none" : "auto",
          }}
        >
          {front}
        </button>

        <div
          aria-hidden={!flipped}
          inert={!flipped}
          className="absolute inset-0 h-full w-full"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            pointerEvents: flipped ? "auto" : "none",
          }}
        >
          {back}
          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-label={`Flip ${label} back to front`}
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
