"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Loader2, Zap } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface UseCaseItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  icon: string | null;
  imageUrl: string | null;
  industrySlugs: any;
  features: any;
  benefits: any;
  demoType: string | null;
  isHospitalityFeature: boolean | null;
  status: string;
}

export function UseCasesManager() {
  const [useCases, setUseCases] = useState<UseCaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<UseCaseItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    imageUrl: "/images/merqato-hospitality-portal.jpg",
    demoType: "portal",
    isHospitalityFeature: true,
    status: "published",
    featuresText: "",
    industrySlugsText: "hospitality, restaurants-and-cafes",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUseCases = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/use-cases");
      if (!res.ok) throw new Error("Failed to load use cases");
      const data = await res.json();
      setUseCases(data.useCases || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUseCases();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      description: "",
      imageUrl: "/images/merqato-hospitality-portal.jpg",
      demoType: "portal",
      isHospitalityFeature: true,
      status: "published",
      featuresText: "Sub-600ms load time\nAutomatic multilingual conversion\nDirect staff notification",
      industrySlugsText: "hospitality, restaurants-and-cafes",
    });
    setIsCreating(true);
  };

  const openEdit = (uc: UseCaseItem) => {
    setEditingItem(uc);
    const features = (uc.features as string[]) || [];
    const indSlugs = (uc.industrySlugs as string[]) || [];
    setFormData({
      title: uc.title,
      slug: uc.slug,
      subtitle: uc.subtitle || "",
      description: uc.description,
      imageUrl: uc.imageUrl || "/images/merqato-hospitality-portal.jpg",
      demoType: uc.demoType || "portal",
      isHospitalityFeature: Boolean(uc.isHospitalityFeature),
      status: uc.status,
      featuresText: features.join("\n"),
      industrySlugsText: indSlugs.join(", "),
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const featuresArray = formData.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const industrySlugsArray = formData.industrySlugsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/use-cases/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            subtitle: formData.subtitle,
            description: formData.description,
            imageUrl: formData.imageUrl,
            demoType: formData.demoType,
            isHospitalityFeature: formData.isHospitalityFeature,
            status: formData.status,
            features: featuresArray,
            industrySlugs: industrySlugsArray,
          }),
        });
        if (!res.ok) throw new Error("Failed to update use case");
        setMessage({ type: "success", text: `Updated ${formData.title}.` });
      } else {
        const res = await fetch("/api/admin/use-cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            slug: formData.slug,
            subtitle: formData.subtitle,
            description: formData.description,
            imageUrl: formData.imageUrl,
            demoType: formData.demoType,
            isHospitalityFeature: formData.isHospitalityFeature,
            status: formData.status,
            features: featuresArray,
            industrySlugs: industrySlugsArray,
          }),
        });
        if (!res.ok) throw new Error("Failed to create use case");
        setMessage({ type: "success", text: `Created ${formData.title}.` });
      }

      setIsCreating(false);
      setEditingItem(null);
      await fetchUseCases();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete '${title}'? This action will be logged.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/use-cases/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete use case");
      setMessage({ type: "success", text: `Deleted ${title}.` });
      await fetchUseCases();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Digital Use Cases CMS
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Manage interactive software modules, features, and multi-industry assignments — all images uploadable from device
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Use Case</span>
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${message.type === "success" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900" : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900"}`}>
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {isCreating && (
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent)] shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
              {editingItem ? `Edit Use Case: ${editingItem.title}` : "Create New Digital Use Case"}
            </h2>
            <button type="button" onClick={() => setIsCreating(false)} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Use Case Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="e.g. Poolside Cabana Ordering" />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} disabled={!!editingItem} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] disabled:opacity-60" placeholder="auto-generated-if-empty" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Subtitle / Short Tagline</label>
              <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="High-level solution summary" />
            </div>

            <div>
              <ImageUploadField label="Use case cover image (upload from device)" value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url })} hint="Shown on solution cards and detail pages. Upload JPG/PNG/WEBP from your device." />
            </div>

            <div>
              <label className="block font-semibold mb-1">Detailed Description *</label>
              <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none" placeholder="Explain the physical tap workflow and guest mobile web experience..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Simulator Demo Type</label>
                <select value={formData.demoType} onChange={(e) => setFormData({ ...formData, demoType: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]">
                  <option value="portal">Guest Portal</option>
                  <option value="menu">Digital Menu</option>
                  <option value="review">Google Review</option>
                  <option value="concierge">Concierge / Room Service</option>
                  <option value="booking">Tour Booking</option>
                  <option value="tracking">Equipment Tracking</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Industry Slugs (comma separated)</label>
                <input type="text" value={formData.industrySlugsText} onChange={(e) => setFormData({ ...formData, industrySlugsText: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="hospitality, tourism-and-marine" />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="isHosp" checked={formData.isHospitalityFeature} onChange={(e) => setFormData({ ...formData, isHospitalityFeature: e.target.checked })} className="rounded" />
                <label htmlFor="isHosp" className="font-semibold cursor-pointer">
                  Feature in Core Hospitality Grid
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Technical Features List (One per line)</label>
              <textarea rows={3} value={formData.featuresText} onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none" placeholder="One feature per line..." />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] font-bold flex items-center gap-1.5">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingItem ? "Save Changes" : "Create Use Case"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading use cases...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {useCases.map((uc) => (
              <div key={uc.id} className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] font-bold overflow-hidden">
                    {uc.imageUrl ? <img src={uc.imageUrl} alt="" className="w-full h-full object-cover" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[var(--text-primary)]">{uc.title}</p>
                      {uc.isHospitalityFeature && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-semibold">Hospitality Feature</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{uc.subtitle || uc.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">{uc.demoType}</span>
                  <button type="button" onClick={() => openEdit(uc)} className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(uc.id, uc.title)} className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
