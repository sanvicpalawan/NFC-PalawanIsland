"use client";

import { useState, useMemo } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   Complete solution catalogue — matches the expanded CMS
   exactly as shown in the client screenshot (31 items)
   ────────────────────────────────────────────────────────── */
const solutionOptions = [
  "Digital menus & ordering",
  "Review collection",
  "Hotel guest portals",
  "Room service & concierge",
  "Tour & activity booking",
  "Customer loyalty",
  "Guest requests & ticketing",
  "Housekeeping management",
  "Equipment & rental tracking",
  "Pre-arrival information & check-in",
  "Boat trip manifests",
  "Dive shop waivers & kit issue",
  "Safety & briefing compliance",
  "Maintenance requests",
  "Property access information",
  "Amenity & facility booking",
  "Solar asset registry",
  "Warranty verification",
  "Installation handover documents",
  "Rental check-out & return",
  "Asset maintenance schedules",
  "Product authenticity verification",
  "Batch traceability",
  "Digital manuals & support",
  "Pallet & shipment tracking",
  "Cold-chain compliance",
  "Event tickets & access control",
  "Digital programmes & sponsor surfaces",
  "Call service & bill requests",
  "Pilot programme",
  "Hardware order",
] as const;

const SOLUTION_GROUPS: { label: string; hint: string; items: string[] }[] = [
  {
    label: "Hospitality & guest experience",
    hint: "Menus, reviews, portals, loyalty",
    items: [
      "Digital menus & ordering",
      "Review collection",
      "Hotel guest portals",
      "Room service & concierge",
      "Tour & activity booking",
      "Customer loyalty",
      "Call service & bill requests",
    ],
  },
  {
    label: "Operations & housekeeping",
    hint: "Requests, housekeeping, pre-arrival",
    items: [
      "Guest requests & ticketing",
      "Housekeeping management",
      "Equipment & rental tracking",
      "Pre-arrival information & check-in",
      "Safety & briefing compliance",
      "Maintenance requests",
    ],
  },
  {
    label: "Marine & tours",
    hint: "Boats, dive, check-out",
    items: [
      "Boat trip manifests",
      "Dive shop waivers & kit issue",
      "Rental check-out & return",
      "Asset maintenance schedules",
    ],
  },
  {
    label: "Property, energy & facilities",
    hint: "Access, amenities, solar, install",
    items: [
      "Property access information",
      "Amenity & facility booking",
      "Solar asset registry",
      "Warranty verification",
      "Installation handover documents",
    ],
  },
  {
    label: "Manufacturing, logistics & events",
    hint: "Traceability, pallets, tickets",
    items: [
      "Product authenticity verification",
      "Batch traceability",
      "Digital manuals & support",
      "Pallet & shipment tracking",
      "Cold-chain compliance",
      "Event tickets & access control",
      "Digital programmes & sponsor surfaces",
      "Pilot programme",
      "Hardware order",
    ],
  },
];

const industryOptions = [
  "Hospitality & Resorts",
  "Restaurants and Cafés",
  "Tourism and Marine",
  "Property and Facilities",
  "Solar and Energy",
  "Equipment Rentals",
  "Manufacturing & Product Identity",
  "Logistics and Supply Chains",
  "Events and Experiences",
  "Other Industry",
];

export function LeadInquiryForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    location: "El Nido, Palawan",
    message: "",
    consentGiven: true,
    website_url_hp: "",
  });

  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    // on desktop all expanded, on mobile collapsed handled via showAll
    {}
  );
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const toggleSolution = (sol: string) => {
    setSelectedSolutions((prev) =>
      prev.includes(sol) ? prev.filter((s) => s !== sol) : [...prev, sol]
    );
  };

  const filteredGroups = useMemo(() => {
    if (!filter.trim()) return SOLUTION_GROUPS;
    const q = filter.toLowerCase();
    return SOLUTION_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [filter]);

  // For the collapsed mobile wall, show only first 8 items + 1 per group as preview
  const previewSolutions = useMemo(() => solutionOptions.slice(0, 8), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolutions.length) {
      setStatus({
        type: "error",
        message: "Please select at least one solution you’re interested in.",
      });
      return;
    }
    setLoading(true);
    setStatus({ type: "idle", message: "" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // fallback to selected industry value for API validation
          industry: formData.industry || "Hospitality & Resorts",
          interestedSolutions: selectedSolutions,
          sourceUrl: window.location.pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit inquiry.");
      setStatus({
        type: "success",
        message:
          data.message ||
          "Thank you for contacting MerQato. Our Palawan team will reach out within 24 business hours.",
      });
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        location: "El Nido, Palawan",
        message: "",
        consentGiven: true,
        website_url_hp: "",
      });
      setSelectedSolutions([]);
      setFilter("");
      setShowAll(false);
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="rounded-[22px] sm:rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm overflow-hidden">
      {/* Header strip */}
      <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[13px] tracking-[0.14em] font-mono font-semibold text-[var(--accent)]">
              START YOUR PILOT CONVERSATION
            </h3>
            <p className="mt-1 text-[13px] leading-[1.5] text-[var(--text-secondary)] max-w-[38ch]">
              Tell us where you are and which workflows you want to connect. We reply from Palawan.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-border)] px-3 py-1 text-[11px] font-medium text-[var(--accent)]">
            <Sparkles className="w-3 h-3" />
            Response in 24h
          </span>
        </div>
      </div>

      {status.type === "success" ? (
        <div className="py-12 sm:py-14 text-center space-y-4 max-w-md mx-auto px-6">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Inquiry sent
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{status.message}</p>
          <button
            type="button"
            onClick={() => setStatus({ type: "idle", message: "" })}
            className="px-6 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold"
          >
            Submit another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-6 sm:py-7 space-y-6">
          {/* honeypot */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website_url_hp}
              onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
            />
          </div>

          {status.type === "error" && (
            <div className="rounded-xl bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2 border border-red-200 dark:border-red-900 px-3.5 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          {/* Top row — INDUSTRY + LOCATION — stacked on mobile, 2-col on md */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
                SELECT AN INDUSTRY
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full appearance-none rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-[11px] pr-9 text-[13px] font-medium text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                >
                  <option value="" disabled>
                    Select an industry
                  </option>
                  {industryOptions.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
                LOCATION
              </label>
              <input
                type="text"
                placeholder="El Nido, Palawan"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-[11px] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* Business / contact / email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
                BUSINESS / VENUE <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Bacuit Bay Eco Resort"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-[11px] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
                CONTACT PERSON <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Maria Santos"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-[11px] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
                EMAIL <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="operations@resort.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-[11px] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
                PHONE / WHATSAPP
              </label>
              <input
                type="tel"
                placeholder="+63 917 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-[11px] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* ── INTERESTED SOLUTIONS — the reworked part ── */}
          <div className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-page)] overflow-hidden">
            {/* solutions header */}
            <div className="px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-page)]">
              <div className="flex items-center gap-3">
                <h4 className="text-[11px] tracking-[0.13em] font-mono font-semibold text-[var(--text-primary)]">
                  INTERESTED SOLUTIONS
                </h4>
                <span className="rounded-full bg-[var(--accent)] text-white px-2.5 py-0.5 text-[11px] font-mono font-semibold">
                  {selectedSolutions.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedSolutions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSolutions([])}
                    className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] underline decoration-dotted underline-offset-4"
                  >
                    Clear all
                  </button>
                )}
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Filter…"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-[140px] rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-7 pr-3 py-1.5 text-[11px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            {/* selected summary chips - always visible */}
            {selectedSolutions.length > 0 && (
              <div className="px-4 sm:px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--accent-subtle)]/40 flex flex-wrap gap-1.5">
                {selectedSolutions.map((sol) => (
                  <span
                    key={sol}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] pl-2.5 pr-1 py-1 text-[11px] font-medium"
                  >
                    {sol}
                    <button
                      type="button"
                      onClick={() => toggleSolution(sol)}
                      className="rounded-full bg-white/15 p-0.5 hover:bg-white/25 transition-colors"
                      aria-label={`Remove ${sol}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* mobile filter (visible only < sm) */}
            <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] sm:hidden bg-[var(--bg-page)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Filter solutions…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-8 pr-3 py-2 text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* pills — mobile: preview + expand, desktop: grouped grid */}
            {/* Mobile wall — collapsed by default */}
            <div className="sm:hidden">
              {/* Preview wall */}
              {!showAll ? (
                <div className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(filter ? filteredGroups.flatMap((g) => g.items) : previewSolutions).map(
                      (sol) => {
                        const isSelected = selectedSolutions.includes(sol);
                        return (
                          <button
                            key={sol}
                            type="button"
                            onClick={() => toggleSolution(sol)}
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none transition-all active:scale-[0.98] ${
                              isSelected
                                ? "bg-[var(--text-primary)] text-[var(--bg-page)] border-[var(--text-primary)]"
                                : "bg-[var(--bg-page)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {sol}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* count + expand */}
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="mt-3 w-full rounded-full border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] flex items-center justify-center gap-1.5"
                  >
                    Show all {solutionOptions.length} solutions
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <p className="mt-2 text-center text-[10px] tracking-wide text-[var(--text-muted)]">
                    Grouped view opens on expand — uniform, scannable, not a wall.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)] max-h-[62vh] overflow-y-auto overscroll-contain">
                  {filteredGroups.map((group) => (
                    <div key={group.label} className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.label)}
                        className="w-full flex items-center justify-between gap-2 text-left"
                      >
                        <div>
                          <p className="text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">
                            {group.label}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">{group.hint}</p>
                        </div>
                        {expandedGroups[group.label] ? (
                          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                        )}
                      </button>

                      {(expandedGroups[group.label] ?? true) && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {group.items.map((sol) => {
                            const isSelected = selectedSolutions.includes(sol);
                            return (
                              <button
                                key={sol}
                                type="button"
                                onClick={() => toggleSolution(sol)}
                                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none transition-all ${
                                  isSelected
                                    ? "bg-[var(--text-primary)] text-[var(--bg-page)] border-[var(--text-primary)]"
                                    : "bg-white dark:bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
                                }`}
                              >
                                {sol}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="sticky bottom-0 bg-[var(--bg-page)] border-t border-[var(--border-subtle)] p-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAll(false)}
                      className="flex-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Collapse
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAll(false)}
                      className="flex-1 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] px-4 py-2 text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop / tablet — categorized grid — always uniform, never a wall */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
                <div className="lg:pr-0">
                  {filteredGroups.slice(0, Math.ceil(filteredGroups.length / 2)).map((group) => (
                    <div
                      key={group.label}
                      className="px-5 py-4 border-b border-[var(--border-subtle)] last:border-b-0"
                    >
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-primary)]">
                        {group.label}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mb-2.5">{group.hint}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((sol) => {
                          const isSelected = selectedSolutions.includes(sol);
                          return (
                            <button
                              key={sol}
                              type="button"
                              onClick={() => toggleSolution(sol)}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none transition-all ${
                                isSelected
                                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                                  : "bg-white dark:bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {sol}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {filteredGroups.slice(Math.ceil(filteredGroups.length / 2)).map((group) => (
                    <div
                      key={group.label}
                      className="px-5 py-4 border-b border-[var(--border-subtle)] last:border-b-0"
                    >
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text-primary)]">
                        {group.label}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mb-2.5">{group.hint}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((sol) => {
                          const isSelected = selectedSolutions.includes(sol);
                          return (
                            <button
                              key={sol}
                              type="button"
                              onClick={() => toggleSolution(sol)}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium leading-none transition-all ${
                                isSelected
                                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                                  : "bg-white dark:bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {sol}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* footer helper */}
              <div className="px-5 py-2.5 flex items-center justify-between bg-[var(--bg-surface)]">
                <p className="text-[10px] tracking-wide text-[var(--text-muted)]">
                  {filteredGroups.flatMap((g) => g.items).length} of {solutionOptions.length} shown
                  {filter && " · filtered"}
                </p>
                {filter && (
                  <button
                    type="button"
                    onClick={() => setFilter("")}
                    className="text-[11px] font-medium text-[var(--accent)] hover:underline underline-offset-4"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[11px] tracking-[0.12em] font-mono font-medium text-[var(--text-muted)] mb-1.5">
              MESSAGE
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your business, the workflows you want to connect, and your timeline."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-page)] px-4 py-3 text-[13px] leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none"
            />
          </div>

          <label className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--text-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentGiven}
              onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
              className="mt-0.5 rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <span>
              I consent to MerQato / Palawan Collective contacting me regarding this inquiry. Your details remain confidential and are never shared.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transmitting inquiry…</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit inquiry to Palawan team</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-[var(--text-muted)]">
            Avg reply in 1 business day · No spam
          </p>
        </form>
      )}
    </div>
  );
}
