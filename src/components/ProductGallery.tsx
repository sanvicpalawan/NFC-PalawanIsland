"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand, Cpu } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  chipType?: string | null;
  waterproofRating?: string | null;
}

export function ProductGallery({
  images,
  alt,
  chipType,
  waterproofRating,
}: ProductGalleryProps) {
  const validImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reset active when images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const next = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % validImages.length);
    setActiveIndex((i) => (i + 1) % validImages.length);
  }, [validImages.length]);
  const prev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + validImages.length) % validImages.length);
    setActiveIndex((i) => (i - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // keyboard lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxOpen, closeLightbox, next, prev]);

  // prevent body scroll when lightbox open
  useEffect(() => {
    if (lightboxOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  if (validImages.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main image stage */}
      <button
        type="button"
        onClick={() => openLightbox(activeIndex)}
        className="relative w-full aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] rounded-[20px] sm:rounded-[24px] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 cursor-zoom-in"
        aria-label="Open gallery lightbox"
      >
        {/* image */}
        <Image
          src={validImages[activeIndex]}
          alt={alt}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
        />

        {/* top HUD - keep subtle like design */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/55 text-white backdrop-blur-md border border-white/10 items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[var(--accent)]" />
            {chipType || "NXP NTAG"}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-md border border-white/10 text-[10px] font-mono font-semibold">
            <Expand className="w-3 h-3" />
            Click to enlarge
          </span>
        </div>

        {/* bottom expand hint */}
        <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md border border-white/10">
            {activeIndex + 1} / {validImages.length}
          </span>
        </div>

        {/* subtle vignette for legibility */}
        <div className="absolute inset-0 ring-1 ring-black/5 rounded-[inherit] pointer-events-none" />
      </button>

      {/* Thumbnails — clickable, fixes the “nothing happens” bug */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 snap-x snap-mandatory">
        {validImages.map((src, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={src + idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              onDoubleClick={() => openLightbox(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-current={isActive}
              className={`relative shrink-0 w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-[14px] overflow-hidden border-2 bg-white snap-start transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                isActive
                  ? "border-[var(--accent)] shadow-md scale-[0.99]"
                  : "border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:shadow-sm"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="92px"
              />
              {isActive && (
                <span className="absolute inset-0 ring-1 ring-inset ring-[var(--accent)]/30 rounded-[12px] pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Caption pill — matches screenshot language */}
      <div className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 sm:px-4 py-2 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-[0.08em] font-mono text-[var(--text-muted)] text-center">
        <span className="hidden sm:inline">SAMPLE PRODUCT IMAGERY</span>
        <span className="sm:hidden">SAMPLE IMAGERY</span>
        <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/50" />
        <span>CONFIGURE ARTWORK AND FINISHES PER ORDER</span>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-[2px] flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          {/* top bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-white/60">
                {lightboxIndex + 1} / {validImages.length}
              </span>
              <span className="hidden sm:inline text-sm font-medium text-white/90 truncate max-w-[40vw]">
                {alt}
              </span>
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* image stage */}
          <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-10 min-h-0">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-[1100px] h-full max-h-[72vh] sm:max-h-[78vh] flex items-center justify-center">
              <Image
                src={validImages[lightboxIndex]}
                alt={alt}
                fill
                className="object-contain"
                sizes="1100px"
                priority
              />
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* thumb strip inside lightbox */}
          <div className="px-4 sm:px-6 pb-6 pt-2">
            <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none mx-auto max-w-full">
              {validImages.map((src, idx) => (
                <button
                  key={src + idx + "-lb"}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(idx);
                    setActiveIndex(idx);
                  }}
                  className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === lightboxIndex
                      ? "border-white scale-105"
                      : "border-white/20 opacity-70 hover:opacity-100 hover:border-white/40"
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
            <p className="text-center text-[11px] font-mono tracking-wide text-white/50 mt-3">
              Click thumbnails to switch · Press ESC to close · Arrow keys to navigate
            </p>
          </div>

          {/* click backdrop to close */}
          <button
            type="button"
            aria-label="Close backdrop"
            onClick={closeLightbox}
            className="absolute inset-0 -z-10"
            tabIndex={-1}
          />
        </div>
      )}
    </div>
  );
}
