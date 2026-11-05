"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Loader2, Layers, Star } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface IndustryItem {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  icon: string | null;
  imageUrl: string | null;
  isPrimary: boolean | null;
  sortOrder: number | null;
  status: string;
  benefits: any;
  exampleDeployments: any;
}

export function IndustriesManager() {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<IndustryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    icon: "Layers",
    imageUrl: "/images/nfc-palawan-island-hero-tap.jpg",
    isPrimary: false,
    status: "published",
    benefitsText: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/industries");
      if (!res.ok) throw new Error("Failed to load industries");
      const data = await res.json();
      setIndustries(data.industries || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      icon: "Layers",
      imageUrl: "/images/nfc-palawan-island-hero-tap.jpg",
      isPrimary: false,
      status: "published",
      benefitsText: "Faster operational turnaround\nDirect mobile access\nZero paper waste",
    });
    setIsCreating(true);
  };

  const openEdit = (ind: IndustryItem) => {
    setEditingItem(ind);
    const benefits = (ind.benefits as string[]) || [];
    setFormData({
      name: ind.name,
      slug: ind.slug,
      tagline: ind.tagline || "",
      description: ind.description,
      icon: ind.icon || "Layers",
      imageUrl: ind.imageUrl || "/images/nfc-palawan-island-hero-tap.jpg",
      isPrimary: Boolean(ind.isPrimary),
      status: ind.status,
      benefitsText: benefits.join("\n"),
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const benefitsArray = formData.benefitsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingItem) {
        // Update
        const res = await fetch(`/api/admin/industries/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            tagline: formData.tagline,
            description: formData.description,
            icon: formData.icon,
            imageUrl: formData.imageUrl,
            isPrimary: formData.isPrimary,
            status: formData.status,
            benefits: benefitsArray,
          }),
        });
        if (!res.ok) throw new Error("Failed to update industry");
        setMessage({ type: "success", text: `Updated ${formData.name} successfully.` });
      } else {
        // Create
        const res = await fetch("/api/admin/industries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            tagline: formData.tagline,
            description: formData.description,
            icon: formData.icon,
            imageUrl: formData.imageUrl,
            isPrimary: formData.isPrimary,
            status: formData.status,
            benefits: benefitsArray,
          }),
        });
        if (!res.ok) throw new Error("Failed to create industry");
        setMessage({ type: "success", text: `Created ${formData.name} successfully.` });
      }

      setIsCreating(false);
      setEditingItem(null);
      await fetchIndustries();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete '${name}'? This action will be logged.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/industries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete industry");
      setMessage({ type: "success", text: `Deleted ${name}.` });
      await fetchIndustries();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Industry Sectors CMS
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Configure dynamic industry tabs, descriptions, and operational benefits
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Industry</span>
        </button>
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

      {/* Modal / Form */}
      {isCreating && (
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent)] shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
              {editingItem ? `Edit Industry: ${editingItem.name}` : "Create New Industry Sector"}
            </h2>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Industry Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="e.g. Agriculture & Cold Chain"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  disabled={!!editingItem}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] disabled:opacity-60"
                  placeholder="auto-generated-if-empty"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                placeholder="Brief value proposition headline"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none"
                placeholder="Explain how NFC Palawan Island connects physical equipment, facilities, or venues in this sector..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="Hotel, Ship, SunMedium, etc."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Publication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isPrimary" className="font-semibold cursor-pointer">
                  Primary Market (Highlight as Core)
                </label>
              </div>
            </div>

            <div>
              <ImageUploadField
                label="Industry cover image (upload from device)"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                hint="This image appears on the industry selector and detail page. Upload from your device or paste a URL."
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Operational Benefits (One benefit per line)
              </label>
              <textarea
                rows={3}
                value={formData.benefitsText}
                onChange={(e) => setFormData({ ...formData, benefitsText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none"
                placeholder="One benefit per line..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] font-bold flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingItem ? "Save Changes" : "Create Industry"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Industries Table */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading industries...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[var(--text-primary)]">{ind.name}</p>
                      {ind.isPrimary && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Core
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        /{ind.slug}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {ind.tagline || ind.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">
                    {ind.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(ind)}
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]"
                    title="Edit Industry"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ind.id, ind.name)}
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete Industry"
                  >
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
