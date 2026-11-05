"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Copy, Check, Image as ImageIcon, Loader2, X } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

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

    // Name is optional: fall back to the last URL segment so an upload that
    // already produced a URL is never blocked by a missing label.
    const fileName =
      formData.fileName.trim() ||
      formData.url.split("/").filter(Boolean).pop() ||
      "media-asset";

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, fileName }),
      });

      if (!res.ok) throw new Error("Failed to register media item");
      setMessage({ type: "success", text: `Added ${fileName} to media library.` });
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
                <label className="block font-semibold mb-1">Asset Name</label>
                <input
                  type="text"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="Optional — e.g. teak-table-macro.jpg"
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

            <ImageUploadField
              label="Asset image"
              value={formData.url}
              onChange={(url) => setFormData({ ...formData, url })}
              hint="Upload an image from your device, or paste an existing URL. Uploads are stored automatically and are also added to this library."
              placeholder="e.g. /images/hero.jpg or an external HTTPS URL"
            />

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
          <div className="space-y-4 text-center py-10">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-[var(--text-muted)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">No media yet</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Upload your product photography and site imagery, then copy each URL into the relevant
                admin section — products, industries or use cases.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload your first image</span>
            </button>
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
