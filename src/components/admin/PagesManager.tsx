"use client";

import { useState, useEffect } from "react";
import { Edit2, Plus, FileText, Check, X, Loader2, Globe, Sparkles } from "lucide-react";

interface PageItem {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  heroHeadline: string | null;
  heroSubheadline: string | null;
  heroDescription: string | null;
  status: string;
  sectionsContent: any;
  updatedAt: string;
}

export function PagesManager() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    heroHeadline: "",
    heroSubheadline: "",
    heroDescription: "",
    status: "published",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      if (!res.ok) throw new Error("Failed to load pages");
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openEdit = (p: PageItem) => {
    setEditingPage(p);
    setFormData({
      slug: p.slug,
      title: p.title,
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
      heroHeadline: p.heroHeadline || "",
      heroSubheadline: p.heroSubheadline || "",
      heroDescription: p.heroDescription || "",
      status: p.status,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update page");
      setMessage({ type: "success", text: `Updated ${formData.title} (${formData.slug}) successfully.` });
      setEditingPage(null);
      await fetchPages();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
          Website Pages & Section Content CMS
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Manage hero headlines, supporting descriptions, CTAs, and search engine optimization settings
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

      {editingPage && (
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent)] shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
                Editing Page: {editingPage.title} (/{editingPage.slug})
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Modifications reflect across public views on merqato.digital
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingPage(null)}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
              <p className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
                Hero Section Content
              </p>

              <div>
                <label className="block font-semibold mb-1">Main Hero Headline</label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm font-bold"
                  placeholder="e.g. Make Every Tap Count."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Supporting Headline</label>
                <input
                  type="text"
                  value={formData.heroSubheadline}
                  onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                  placeholder="e.g. Turn everyday objects into powerful business tools."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Hero Description</label>
                <textarea
                  rows={2}
                  value={formData.heroDescription}
                  onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] resize-none"
                  placeholder="Explaining physical-to-digital business experiences..."
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
              <p className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[11px]">
                Search Engine Optimization (SEO)
              </p>

              <div>
                <label className="block font-semibold mb-1">Meta Title Tag</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Meta Description Tag</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
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
                <span>Save Page Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pages table */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading pages...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[var(--text-primary)]">{p.title}</p>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        /{p.slug}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {p.heroHeadline || p.metaDescription || "Standard page"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">
                    {p.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]"
                    title="Edit Page"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
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
