"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Copy, Check, Image as ImageIcon, Loader2, X } from "lucide-react";

interface MediaItem {
  id: number;
  fileName: string;
  url: string;
  fileSize: number | null;
  mimeType: string | null;
  altText: string | null;
  category: string | null;
  createdAt: string;
}

export function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fileName: "",
    url: "",
    altText: "",
    category: "product",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media");
      if (!res.ok) throw new Error("Failed to load media");
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to register media item");
      setMessage({ type: "success", text: `Added ${formData.fileName} to media library.` });
      setIsAdding(false);
      setFormData({ fileName: "", url: "", altText: "", category: "product" });
      await fetchMedia();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete media asset '${name}'?`)) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete media");
      setMessage({ type: "success", text: `Deleted ${name}.` });
      await fetchMedia();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Media Library & Hardware Assets
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Product photography, mockups, CAD spec diagrams, and web photography
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Media Asset</span>
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

      {isAdding && (
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent)] shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
              Register New Media Asset
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddMedia} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Asset File Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="e.g. nfc-palawan-island-teak-macro.jpg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                >
                  <option value="product">Hardware Product</option>
                  <option value="hospitality">Hospitality Setting</option>
                  <option value="industrial">Industrial / Marine</option>
                  <option value="spec">Technical Document</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Accessible URL Path *</label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                placeholder="e.g. /images/nfc-palawan-island-hero-tap.jpg or external HTTPS URL"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Accessibility Alt Text</label>
              <input
                type="text"
                value={formData.altText}
                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                placeholder="Descriptive alt text for screen readers"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
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
                <span>Add Media</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of media items */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading media library...</span>
          </div>
        ) : media.length === 0 ? (
          <div className="space-y-4 text-center py-8">
            <p className="text-xs text-[var(--text-muted)]">
              Core platform images are active in /public/images/. You can register items into the media manager above.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[
                { name: "Hero Tap Photo", url: "/images/nfc-palawan-island-hero-tap.jpg" },
                { name: "Product Tags Studio", url: "/images/nfc-palawan-island-product-tags.jpg" },
                { name: "Teak Standup Macro", url: "/images/nfc-palawan-island-standup-teak.jpg" },
                { name: "NFC Stickers Macro", url: "/images/nfc-palawan-island-nfc-stickers-macro.jpg" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
                    <Image src={item.url} alt={item.name} fill className="object-cover" />
                  </div>
                  <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">{item.name}</p>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">{item.url}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-subtle)]">
                    <Image src={item.url} alt={item.altText || item.fileName} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">{item.fileName}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">{item.url}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    className="p-1 rounded-lg hover:bg-[var(--bg-surface)] text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-1"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.fileName)}
                    className="p-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
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
