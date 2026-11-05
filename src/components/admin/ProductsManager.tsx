"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Loader2, Package, Star, Grip, Trash } from "lucide-react";
import { ImageUploadField, GalleryUploadField } from "./ImageUploadField";

interface ProductVariant {
  name: string;
  finish?: string;
  dimensions?: string;
  minOrder?: string;
  estPrice?: string;
}

interface ProductItem {
  id: number;
  slug: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string;
  imageUrl: string | null;
  galleryUrls: any;
  dimensions: string | null;
  materials: string | null;
  operatingRange: string | null;
  chipType: string | null;
  waterproofRating: string | null;
  applications: any;
  variants: any;
  specSheetUrl: string | null;
  isFeatured: boolean | null;
  status: string;
}

export function ProductsManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "stickers",
    tagline: "",
    description: "",
    imageUrl: "/images/merqato-product-tags.jpg",
    galleryUrls: [] as string[],
    dimensions: "30mm Ø",
    materials: "Matte PET with 3M 300LSE adhesive",
    operatingRange: "20mm - 40mm",
    chipType: "NXP NTAG213",
    waterproofRating: "IP67",
    specSheetUrl: "",
    isFeatured: false,
    status: "published",
    applicationsText: "Restaurant dining tables\nBar counters\nIn-room directories",
    sortOrder: 0,
  });
  const [variants, setVariants] = useState<ProductVariant[]>([
    { name: "Standard 30mm", finish: "Matte White", dimensions: "30mm Ø", minOrder: "50 units", estPrice: "₱65 / unit" },
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      category: "stickers",
      tagline: "",
      description: "",
      imageUrl: "/images/merqato-product-tags.jpg",
      galleryUrls: [],
      dimensions: "30mm Ø",
      materials: "Matte PET with 3M 300LSE adhesive",
      operatingRange: "20mm - 40mm",
      chipType: "NXP NTAG213",
      waterproofRating: "IP67",
      specSheetUrl: "",
      isFeatured: false,
      status: "published",
      applicationsText: "Restaurant dining tables\nBar counters\nIn-room directories",
      sortOrder: 0,
    });
    setVariants([
      { name: "Standard", finish: "Matte", dimensions: "30mm Ø", minOrder: "50 units", estPrice: "₱65 / unit" },
    ]);
    setIsCreating(true);
  };

  const openEdit = (prod: ProductItem) => {
    setEditingItem(prod);
    const apps = (prod.applications as string[]) || [];
    const g = (prod.galleryUrls as string[]) || [];
    const v = (prod.variants as ProductVariant[]) || [];
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      tagline: prod.tagline || "",
      description: prod.description,
      imageUrl: prod.imageUrl || "/images/merqato-product-tags.jpg",
      galleryUrls: Array.isArray(g) ? g : [],
      dimensions: prod.dimensions || "30mm Ø",
      materials: prod.materials || "Solid Teak / PET",
      operatingRange: prod.operatingRange || "20mm - 40mm",
      chipType: prod.chipType || "NXP NTAG213",
      waterproofRating: prod.waterproofRating || "IP67",
      specSheetUrl: prod.specSheetUrl || "",
      isFeatured: Boolean(prod.isFeatured),
      status: prod.status,
      applicationsText: apps.join("\n"),
      sortOrder: (prod as any).sortOrder || 0,
    });
    setVariants(
      v.length
        ? v
        : [{ name: "Standard", finish: "Matte", dimensions: "30mm Ø", minOrder: "50 units", estPrice: "₱65 / unit" }]
    );
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const appsArray = formData.applicationsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    // filter variants: remove empty name
    const cleanVariants = variants.filter((v) => v.name.trim());

    try {
      if (editingItem) {
        const res = await fetch(`/api/admin/products/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            tagline: formData.tagline,
            description: formData.description,
            imageUrl: formData.imageUrl,
            galleryUrls: formData.galleryUrls,
            dimensions: formData.dimensions,
            materials: formData.materials,
            operatingRange: formData.operatingRange,
            chipType: formData.chipType,
            waterproofRating: formData.waterproofRating,
            specSheetUrl: formData.specSheetUrl,
            isFeatured: formData.isFeatured,
            status: formData.status,
            sortOrder: formData.sortOrder,
            applications: appsArray,
            variants: cleanVariants,
          }),
        });
        if (!res.ok) throw new Error("Failed to update product");
        setMessage({ type: "success", text: `Updated ${formData.name}.` });
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            slug: formData.slug,
            category: formData.category,
            tagline: formData.tagline,
            description: formData.description,
            imageUrl: formData.imageUrl,
            galleryUrls: formData.galleryUrls,
            dimensions: formData.dimensions,
            materials: formData.materials,
            operatingRange: formData.operatingRange,
            chipType: formData.chipType,
            waterproofRating: formData.waterproofRating,
            specSheetUrl: formData.specSheetUrl,
            isFeatured: formData.isFeatured,
            status: formData.status,
            sortOrder: formData.sortOrder,
            applications: appsArray,
            variants: cleanVariants,
          }),
        });
        if (!res.ok) throw new Error("Failed to create product");
        setMessage({ type: "success", text: `Created ${formData.name}.` });
      }

      setIsCreating(false);
      setEditingItem(null);
      await fetchProducts();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete '${name}'? This action will be logged.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setMessage({ type: "success", text: `Deleted ${name}.` });
      await fetchProducts();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", finish: "", dimensions: "", minOrder: "", estPrice: "" }]);
  };
  const updateVariant = (idx: number, patch: Partial<ProductVariant>) => {
    const n = [...variants];
    n[idx] = { ...n[idx], ...patch };
    setVariants(n);
  };
  const removeVariant = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Physical Hardware Catalog CMS
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Manage smart NFC stickers, teak tabletop discs, aluminum standups, and industrial labels — all images uploadable from device
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Hardware Item</span>
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
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--accent)] shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
              {editingItem ? `Edit Product: ${editingItem.name}` : "Create New Physical Hardware"}
            </h2>
            <button type="button" onClick={() => setIsCreating(false)} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Basic */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 space-y-4">
              <p className="text-[11px] tracking-[0.1em] font-mono font-semibold text-[var(--text-muted)] uppercase">Basic information</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Product Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="e.g. QR Stickers" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]">
                    <option value="stickers">Smart Stickers</option>
                    <option value="tabletop">Tabletop Standups & Discs</option>
                    <option value="cards">Hotel Keycards</option>
                    <option value="wristbands">Marine Wristbands</option>
                    <option value="asset_labels">Asset & Solar Labels</option>
                    <option value="secure_tags">Cryptographic DNA Tags</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">URL Slug{editingItem && " (locked)"}</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} disabled={!!editingItem} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] disabled:opacity-60" placeholder="auto-generated-if-empty" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="Short hardware description" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Full Technical Description *</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none" placeholder="Materials, encapsulation, temperature limits, reading experience..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="rounded" />
                  <label htmlFor="isFeatured" className="font-semibold cursor-pointer">Flagship on homepage</label>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sort order</label>
                  <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" />
                </div>
              </div>
            </div>

            {/* Imagery */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 space-y-4">
              <p className="text-[11px] tracking-[0.1em] font-mono font-semibold text-[var(--text-muted)] uppercase">Imagery — upload from device</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImageUploadField
                  label="Main product image * (click to replace, click main image on storefront to enlarge)"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  hint="This is the hero image shown on cards and at top of detail page. Tap uploads from your device."
                />
                <GalleryUploadField label="Gallery thumbnails (click to switch on storefront)" values={formData.galleryUrls} onChange={(urls) => setFormData({ ...formData, galleryUrls: urls })} />
              </div>
            </div>

            {/* Specs */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 space-y-4">
              <p className="text-[11px] tracking-[0.1em] font-mono font-semibold text-[var(--text-muted)] uppercase">Specifications — editable pills & code</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold mb-1">Dimensions (creates AVAILABLE SIZES pills)</label>
                  <input type="text" value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="35mm x 35mm / 50mm x 50mm" />
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">Use “ / ” to split into pills: 40 × 40 MM, 70 × 70 MM</p>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Materials (MATERIALS pills)</label>
                  <input type="text" value={formData.materials} onChange={(e) => setFormData({ ...formData, materials: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="MATT VINYL / WEATHERPROOF POLY" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Operating Range</label>
                  <input type="text" value={formData.operatingRange} onChange={(e) => setFormData({ ...formData, operatingRange: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="10cm - 150cm" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Chip / Code (CODE row)</label>
                  <input type="text" value={formData.chipType} onChange={(e) => setFormData({ ...formData, chipType: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="Cloud-Redirected Dynamic QR" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waterproof Rating</label>
                  <input type="text" value={formData.waterproofRating} onChange={(e) => setFormData({ ...formData, waterproofRating: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]" placeholder="IP68 Submersible" />
                </div>
                <div className="sm:col-span-1">
                  <ImageUploadField
                    label="Spec sheet PDF"
                    value={formData.specSheetUrl}
                    onChange={(url) => setFormData({ ...formData, specSheetUrl: url })}
                    accept="application/pdf,.pdf"
                    hint="Upload PDF from device. Shown as Download spec sheet."
                    placeholder="/docs/spec.pdf or upload…"
                  />
                </div>
              </div>
            </div>

            {/* Applications & Variants */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 space-y-4">
              <p className="text-[11px] tracking-[0.1em] font-mono font-semibold text-[var(--text-muted)] uppercase">Applications & variants</p>
              <div>
                <label className="block font-semibold mb-1">Applications — APPLICATIONS pills (one per line)</label>
                <textarea rows={3} value={formData.applicationsText} onChange={(e) => setFormData({ ...formData, applicationsText: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] resize-none" placeholder="MENUS&#10;SIGNAGE&#10;PACKAGING" />
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Each line becomes a pill: MENUS, SIGNAGE, PACKAGING, etc.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold">Variants — AVAILABLE SIZES / finish / pricing</label>
                  <button type="button" onClick={addVariant} className="px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add variant
                  </button>
                </div>
                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <input placeholder="Variant name" value={v.name} onChange={(e) => updateVariant(idx, { name: e.target.value })} className="sm:col-span-3 px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)]" />
                      <input placeholder="Dimensions e.g. 40x40mm" value={v.dimensions || ""} onChange={(e) => updateVariant(idx, { dimensions: e.target.value })} className="sm:col-span-3 px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)]" />
                      <input placeholder="Finish e.g. Matte Vinyl" value={v.finish || ""} onChange={(e) => updateVariant(idx, { finish: e.target.value })} className="sm:col-span-2 px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)]" />
                      <input placeholder="MOQ" value={v.minOrder || ""} onChange={(e) => updateVariant(idx, { minOrder: e.target.value })} className="sm:col-span-2 px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)]" />
                      <input placeholder="Price e.g. ₱45 / unit" value={v.estPrice || ""} onChange={(e) => updateVariant(idx, { estPrice: e.target.value })} className="sm:col-span-1 px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)]" />
                      <button type="button" onClick={() => removeVariant(idx)} className="sm:col-span-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center gap-1 text-xs">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ))}
                  {variants.length === 0 && <p className="text-xs text-[var(--text-muted)]">No variants — add at least one to generate Available Sizes pills.</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] font-medium">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] font-bold flex items-center gap-1.5">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingItem ? "Save all changes" : "Create product"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products list */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading products...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((prod) => (
              <div key={prod.id} className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden relative shrink-0">
                    <Image src={(prod as any).imageUrl || "/images/merqato-product-tags.jpg"} alt={prod.name} fill className="object-cover" sizes="44px" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-[var(--text-primary)] truncate">{prod.name}</p>
                      {(prod as any).isFeatured && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Flagship
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[var(--text-muted)] truncate">/{prod.category}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5 truncate">
                      {(prod as any).chipType} · {prod.dimensions} · {(prod as any).waterproofRating}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">{prod.status}</span>
                  <button type="button" onClick={() => openEdit(prod)} className="p-1.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]" title="Edit Product">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(prod.id, prod.name)} className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" title="Delete Product">
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
