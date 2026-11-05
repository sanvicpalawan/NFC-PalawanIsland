"use client";

import { useState, useEffect } from "react";
import { Settings, Sparkles, Check, Loader2, Save, MapPin } from "lucide-react";

export function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [pilotOffer, setPilotOffer] = useState({
    title: "Palawan Hospitality Connected Experience Pilot",
    badge: "Limited to 20 Palawan Hospitality Venues",
    durationDays: 90,
    setupCommitmentPhp: 1000,
    regularValuePhp: 12500,
    spotsRemaining: 7,
    maxSpots: 20,
    eligibility: "Open to licensed boutique resorts, eco-lodges, beachfront restaurants, cafes, and island tour operators operating in Palawan.",
    inclusionsText: "",
  });

  const [brand, setBrand] = useState({
    siteName: "MerQato",
    headline: "Make Every Tap Count.",
    subheadline: "Turn everyday objects into powerful business tools.",
    contactEmail: "hello@merqato.digital",
    contactPhone: "+63 (048) 433-2890",
    address: "Palawan Collective Technology Hub, Rizal Avenue, Puerto Princesa, Palawan 5300, Philippines",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings(data.settings || {});

      if (data.settings?.pilot_offer) {
        const po = data.settings.pilot_offer;
        const inclusions = (po.inclusions as string[]) || [];
        setPilotOffer({
          title: po.title || "",
          badge: po.badge || "",
          durationDays: po.durationDays || 90,
          setupCommitmentPhp: po.setupCommitmentPhp || 1000,
          regularValuePhp: po.regularValuePhp || 12500,
          spotsRemaining: po.spotsRemaining !== undefined ? po.spotsRemaining : 7,
          maxSpots: po.maxSpots || 20,
          eligibility: po.eligibility || "",
          inclusionsText: inclusions.join("\n"),
        });
      }

      if (data.settings?.brand) {
        const b = data.settings.brand;
        setBrand({
          siteName: b.siteName || "MerQato",
          headline: b.headline || "Make Every Tap Count.",
          subheadline: b.subheadline || "Turn everyday objects into powerful business tools.",
          contactEmail: b.contactEmail || "hello@merqato.digital",
          contactPhone: b.contactPhone || "+63 (048) 433-2890",
          address: b.address || "",
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSetting = async (key: string, value: any) => {
    try {
      setSavingKey(key);
      setMessage(null);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) throw new Error(`Failed to save ${key}`);
      setMessage({ type: "success", text: `Updated ${key.replace("_", " ")} configuration successfully.` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSavingKey(null);
    }
  };

  const handleSavePilot = (e: React.FormEvent) => {
    e.preventDefault();
    const inclusions = pilotOffer.inclusionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    saveSetting("pilot_offer", {
      ...pilotOffer,
      inclusions,
    });
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    saveSetting("brand", brand);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
          Website Settings & Commercial Pilot Offer
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Update pilot pricing, duration, spot availability, and corporate brand coordinates
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
          message.type === "success"
            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
            : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900"
        }`}>
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading settings...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Card 1: Pilot Program Configuration */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
                Hospitality Pilot Offer Configuration
              </h2>
            </div>

            <form onSubmit={handleSavePilot} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Pilot Offer Title</label>
                <input
                  type="text"
                  value={pilotOffer.title}
                  onChange={(e) => setPilotOffer({ ...pilotOffer, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Badge Text</label>
                <input
                  type="text"
                  value={pilotOffer.badge}
                  onChange={(e) => setPilotOffer({ ...pilotOffer, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Setup (₱)</label>
                  <input
                    type="number"
                    value={pilotOffer.setupCommitmentPhp}
                    onChange={(e) => setPilotOffer({ ...pilotOffer, setupCommitmentPhp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Regular Value (₱)</label>
                  <input
                    type="number"
                    value={pilotOffer.regularValuePhp}
                    onChange={(e) => setPilotOffer({ ...pilotOffer, regularValuePhp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Trial Days</label>
                  <input
                    type="number"
                    value={pilotOffer.durationDays}
                    onChange={(e) => setPilotOffer({ ...pilotOffer, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Spots Left</label>
                  <input
                    type="number"
                    value={pilotOffer.spotsRemaining}
                    onChange={(e) => setPilotOffer({ ...pilotOffer, spotsRemaining: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] font-mono text-[var(--accent)] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={pilotOffer.eligibility}
                  onChange={(e) => setPilotOffer({ ...pilotOffer, eligibility: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Package Inclusions (One line per bullet point)
                </label>
                <textarea
                  rows={5}
                  value={pilotOffer.inclusionsText}
                  onChange={(e) => setPilotOffer({ ...pilotOffer, inclusionsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingKey === "pilot_offer"}
                className="w-full py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {savingKey === "pilot_offer" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Update Pilot Program Offer</span>
              </button>
            </form>
          </div>

          {/* Card 2: Brand Information & Coordinates */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <MapPin className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
                Brand & Contact Coordinates
              </h2>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Platform Brand Name</label>
                <input
                  type="text"
                  value={brand.siteName}
                  onChange={(e) => setBrand({ ...brand, siteName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Primary Tagline</label>
                <input
                  type="text"
                  value={brand.headline}
                  onChange={(e) => setBrand({ ...brand, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Supporting Tagline</label>
                <input
                  type="text"
                  value={brand.subheadline}
                  onChange={(e) => setBrand({ ...brand, subheadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={brand.contactEmail}
                    onChange={(e) => setBrand({ ...brand, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={brand.contactPhone}
                    onChange={(e) => setBrand({ ...brand, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Physical Address / Headquarters</label>
                <textarea
                  rows={3}
                  value={brand.address}
                  onChange={(e) => setBrand({ ...brand, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingKey === "brand"}
                className="w-full py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {savingKey === "brand" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Update Brand Coordinates</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
