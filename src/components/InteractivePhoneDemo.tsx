"use client";

import { useState } from "react";
import {
  Menu,
  Star,
  Smartphone,
  Coffee,
  Compass,
  Wifi,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Radio,
} from "lucide-react";

export function InteractivePhoneDemo() {
  const [activeTab, setActiveTab] = useState<"menu" | "review" | "portal" | "concierge" | "tour">("portal");
  const [tapped, setTapped] = useState(false);

  const triggerTap = (tab: "menu" | "review" | "portal" | "concierge" | "tour") => {
    setActiveTab(tab);
    setTapped(true);
    setTimeout(() => setTapped(false), 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Left controls and explanation */}
      <div className="lg:col-span-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          Interactive Physical-to-Digital Simulator
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
          Tap the tag. Experience zero friction.
        </h3>

        <p className="text-base text-[var(--text-secondary)] leading-relaxed">
          No app downloads. No camera hunting in dim lighting. When a guest taps or scans a MerQato smart disc, an ultra-fast web portal renders in under 600 milliseconds.
        </p>

        {/* Interactive Selector Buttons */}
        <div className="space-y-2 pt-2">
          <p className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
            Select an interaction scenario:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => triggerTap("portal")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                activeTab === "portal"
                  ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-xs"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === "portal" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-page)] text-[var(--text-secondary)]"}`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Guest Portal</p>
                <p className="text-[11px] text-[var(--text-muted)]">Room concierge & Wi-Fi</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => triggerTap("menu")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                activeTab === "menu"
                  ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-xs"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === "menu" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-page)] text-[var(--text-secondary)]"}`}>
                <Menu className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Digital Menu</p>
                <p className="text-[11px] text-[var(--text-muted)]">Dynamic daily catch & specials</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => triggerTap("review")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                activeTab === "review"
                  ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-xs"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === "review" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-page)] text-[var(--text-secondary)]"}`}>
                <Star className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">1-Tap Google Review</p>
                <p className="text-[11px] text-[var(--text-muted)]">Maps deep-link prompt</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => triggerTap("concierge")}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                activeTab === "concierge"
                  ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-xs"
                  : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className={`p-2 rounded-lg ${activeTab === "concierge" ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-page)] text-[var(--text-secondary)]"}`}>
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Room Service</p>
                <p className="text-[11px] text-[var(--text-muted)]">Orders & housekeeping help</p>
              </div>
            </button>
          </div>
        </div>

        {/* Tactile Hardware representation */}
        <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center font-mono text-xs font-bold shadow-inner">
              NFC
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Physical MerQato Smart Standup
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Solid Palawan Teak &middot; Embedded NXP NTAG215 chip
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">
            Zero App Required
          </span>
        </div>
      </div>

      {/* Right: Phone Simulator */}
      <div className="lg:col-span-6 flex justify-center">
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-neutral-900 rounded-[40px] p-2.5 shadow-2xl border-4 border-neutral-800">
          {/* Speaker ear piece and camera island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-neutral-800 ml-auto mr-2" />
          </div>

          {/* Screen Content */}
          <div className="w-full rounded-[32px] bg-[var(--bg-page)] text-[var(--text-primary)] overflow-hidden flex flex-col relative pt-7 font-sans">
            {/* Tap feedback banner */}
            <div
              className={`absolute top-8 left-4 right-4 z-30 transition-all duration-300 pointer-events-none ${
                tapped ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              }`}
            >
              <div className="px-3 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] text-[11px] font-semibold flex items-center gap-2 shadow-lg">
                <Radio className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
                <span>NFC Tag Detected &middot; Table #14 Connected</span>
              </div>
            </div>

            {/* Portal Header */}
            <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] tracking-wider uppercase font-semibold text-[var(--text-muted)]">
                  EL NIDO BAYVIEW RESORT
                </p>
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  {activeTab === "portal" && "Guest Concierge Portal"}
                  {activeTab === "menu" && "Beachside Terrace Menu"}
                  {activeTab === "review" && "Google Maps Review"}
                  {activeTab === "concierge" && "In-Room Dining & Requests"}
                </p>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold">
                Villa 12
              </span>
            </div>

            {/* Dynamic Screen View — full content, no internal clipping */}
            <div className="flex-1 p-4 pb-5 space-y-3.5 text-xs">
              {/* TAB 1: GUEST PORTAL */}
              {activeTab === "portal" && (
                <>
                  {/* Wi-Fi card */}
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center">
                        <Wifi className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">Resort High-Speed Wi-Fi</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Network: ElNido_Guest_5G</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--text-primary)] text-[var(--bg-page)]"
                    >
                      Connect
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase">Sunset Hour</p>
                      <p className="font-semibold text-[var(--text-primary)]">5:30 PM &middot; Beach Bar</p>
                      <p className="text-[10px] text-[var(--accent)]">2-for-1 Cocktails</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase">Tide & Marine</p>
                      <p className="font-semibold text-[var(--text-primary)]">Low Tide 2:15 PM</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Calm Waters &middot; Tour A On</p>
                    </div>
                  </div>

                  {/* Quick Action Tiles */}
                  <div className="space-y-1.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-between cursor-pointer hover:opacity-90">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span className="font-medium text-[var(--text-primary)]">Order Poolside Drinks</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-between cursor-pointer hover:opacity-90">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span className="font-medium text-[var(--text-primary)]">Request Fresh Beach Towels</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-between cursor-pointer hover:opacity-90">
                      <div className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
                        <span className="font-medium text-[var(--text-primary)]">Book Private Lagoon Kayak</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: DIGITAL MENU */}
              {activeTab === "menu" && (
                <>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-[var(--text-primary)]">Chef's Island Catch of the Day</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      Fresh Today
                    </span>
                  </div>

                  {/* Menu item 1 */}
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">Grilled Bacuit Bay Snapper</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Calamansi butter, lemongrass jasmine rice, roasted chayote</p>
                      </div>
                      <span className="font-bold text-[var(--accent)] whitespace-nowrap ml-2">₱680</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)] font-medium">Gluten-Free</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)] font-medium">Sustainably Caught</span>
                    </div>
                  </div>

                  {/* Menu item 2 */}
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">Palawan Honey Calamansi Poke</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Yellowfin tuna, avocado, seaweed crisps, toasted sesame</p>
                      </div>
                      <span className="font-bold text-[var(--accent)] whitespace-nowrap ml-2">₱540</span>
                    </div>
                  </div>

                  {/* Menu item 3 */}
                  <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">Buko Pandan Float</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Young coconut, pandan cream, toasted coconut</p>
                      </div>
                      <span className="font-bold text-[var(--accent)] whitespace-nowrap ml-2">₱180</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)] font-medium">Vegan</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)] font-medium">House favourite</span>
                    </div>
                  </div>

                  {/* Order summary + CTA */}
                  <div className="flex items-center justify-between rounded-xl bg-[var(--bg-elevated)] px-3 py-2">
                    <span className="text-[10px] text-[var(--text-muted)]">Subtotal · 3 items</span>
                    <span className="font-mono text-[11px] font-bold text-[var(--text-primary)]">₱1,400</span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] font-semibold text-center shadow-xs"
                  >
                    Send Order to Table #14
                  </button>
                </>
              )}

              {/* TAB 3: GOOGLE REVIEWS */}
              {activeTab === "review" && (
                <>
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center space-y-2">
                    <div className="flex justify-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="font-bold text-xs text-[var(--text-primary)]">
                      How was your stay at El Nido Bayview?
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Your review on Google Maps helps travelers find authentic Palawan hospitality.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        G
                      </div>
                      <p className="text-[11px] font-semibold text-blue-900 dark:text-blue-200">
                        1-Tap Google Review Deep-Link
                      </p>
                    </div>
                    <p className="text-[10px] text-blue-800 dark:text-blue-300">
                      Directly opens Google Maps review dialogue on iOS & Android. Zero login friction.
                    </p>
                    <button
                      type="button"
                      className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-[11px] shadow-xs"
                    >
                      Post Review to Google
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold text-[var(--text-primary)]">Quick tags</p>
                      <span className="font-mono text-[9px] text-[var(--text-muted)]">Optional</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Food", "Service", "Views", "Quiet", "Value"].map((tag) => (
                        <span key={tag} className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[9px] font-medium text-[var(--text-secondary)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] leading-relaxed text-[var(--text-muted)]">
                      Ratings you post are yours. MerQato never edits or filters reviews.
                    </p>
                  </div>
                </>
              )}

              {/* TAB 4: CONCIERGE */}
              {activeTab === "concierge" && (
                <>
                  <p className="text-[11px] font-bold text-[var(--text-primary)]">Instant Guest Service</p>

                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">Extra Beach Towels (x2)</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Deliver to Villa 12 veranda</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Sent
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">Late Checkout Request</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Requested 1:00 PM (Standard 11:00 AM)</p>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Reviewing
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">Breakfast In-Bed Basket</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Scheduled for 8:30 AM tomorrow</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                    <p className="text-[11px] font-semibold text-[var(--text-primary)]">New request</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Towels", "Room service", "Transport", "Maintenance"].map((chip) => (
                        <span key={chip} className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-page)] px-2 py-0.5 text-[9px] font-medium text-[var(--text-secondary)]">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="w-full py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] font-semibold text-[11px] shadow-xs"
                    >
                      Send to front desk
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Bottom status bar */}
            <div className="px-4 py-2 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span>Powered by MerQato</span>
              <span>Encrypted NFC SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
