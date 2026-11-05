"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, ArrowUpRight, Radio, Sparkles } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src="/brand/palawan-collective-logo-dark.png"
              alt=""
              aria-hidden="true"
              className="w-8 h-8 shrink-0 object-contain transition-transform group-hover:scale-105 dark:hidden"
            />
            <img
              src="/brand/palawan-collective-logo-light.png"
              alt=""
              aria-hidden="true"
              className="hidden w-8 h-8 shrink-0 object-contain transition-transform group-hover:scale-105 dark:block"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)] leading-none font-serif-editorial">
                NFC Palawan Island
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[var(--text-muted)] mt-0.5">
                Palawan Collective
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]">
            <Link
              href="/solutions"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="/#industries"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Industries
            </Link>
            <Link
              href="/products"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Physical Tags
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pilot-program"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <Sparkles className="w-3 h-3" />
              Pilot Program
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] hover:opacity-90 transition-all shadow-xs"
            >
              Request a Demo
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-6 pt-2 border-t border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-3">
            <div className="flex flex-col space-y-2 text-base font-medium px-2">
              <Link
                href="/solutions"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                Solutions
              </Link>
              <Link
                href="/#industries"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                Industries
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                Physical Products
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                How It Works
              </Link>
              <Link
                href="/pilot-program"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--accent)] font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                90-Day Hospitality Pilot (₱1,000)
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                About NFC Palawan Island
              </Link>
              <Link
                href="/insights"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                Insights & Field Notes
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="py-2 text-[var(--text-primary)] hover:text-[var(--accent)]"
              >
                Contact
              </Link>
              <div className="pt-2">
                <Link
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-sm font-semibold shadow-xs"
                >
                  Request a Demo
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
