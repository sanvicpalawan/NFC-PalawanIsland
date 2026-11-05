"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, FileText, ExternalLink } from "lucide-react";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  hint?: string;
  placeholder?: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  hint,
  placeholder = "Paste URL or upload from device…",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    // basic client validation
    if (f.size > 8 * 1024 * 1024) {
      setError("File too large (max 8MB)");
      return;
    }
    uploadFile(f);
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">{label}</label>}

      {/* preview */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-page)] group">
          <div className="relative w-full h-[160px]">
            {/* try to render as image; if not image (pdf) show file icon */}
            {value.match(/\.(pdf)$/i) ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
                <FileText className="w-8 h-8" />
                <span className="text-xs font-mono truncate max-w-[80%]">{value.split("/").pop()}</span>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-contain p-2"
                sizes="400px"
                unoptimized
              />
            )}
          </div>

          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-white text-xs font-medium hover:bg-black/80 transition-colors flex items-center gap-1.5"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-7 h-7 rounded-full bg-black/70 backdrop-blur text-white hover:bg-black/80 flex items-center justify-center"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-2.5 py-1.5 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-[var(--text-muted)] truncate">{value}</span>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[11px] text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFile(e.dataTransfer.files[0]);
          }}
          className={`rounded-xl border-2 border-dashed bg-[var(--bg-page)] px-4 py-5 flex flex-col items-center justify-center text-center gap-2 transition-colors ${
            dragOver ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : "border-[var(--border-subtle)]"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" /> : <ImageIcon className="w-4 h-4 text-[var(--text-muted)]" />}
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">Upload from device</p>
            <p className="text-[11px] text-[var(--text-muted)]">Drag & drop or click to browse · PNG, JPG, WEBP, PDF up to 8MB</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mt-1 px-4 py-1.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Browse files"}
          </button>
        </div>
      )}

      {/* URL fallback + upload */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-mono placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-semibold hover:bg-[var(--bg-elevated)] disabled:opacity-50 flex items-center gap-1.5"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Upload
        </button>
      </div>

      {hint && <p className="text-[11px] text-[var(--text-muted)]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}

export function GalleryUploadField({
  label,
  values,
  onChange,
}: {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of arr) {
        if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} too large (max 8MB)`);
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Upload failed for ${file.name}`);
        uploaded.push(data.url);
      }
      onChange([...values, ...uploaded]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) => {
    const n = [...values];
    const t = idx + dir;
    if (t < 0 || t >= n.length) return;
    [n[idx], n[t]] = [n[t], n[idx]];
    onChange(n);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">{label}</label>}

      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {values.map((url, idx) => (
            <div key={url + idx} className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-page)] group">
              <div className="relative w-full h-[110px]">
                <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" sizes="200px" unoptimized />
              </div>
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/80"
                  aria-label="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="px-1.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] disabled:opacity-40"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === values.length - 1}
                  className="px-1.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] disabled:opacity-40"
                >
                  ▶
                </button>
              </div>
              <div className="px-1.5 py-1 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
                <p className="text-[10px] font-mono truncate text-[var(--text-muted)]">{url}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading…" : values.length ? "Add more images" : "Upload images"}
        </button>
        <span className="text-[11px] text-[var(--text-muted)] self-center">PNG, JPG, WEBP · up to 8MB each · drag & drop supported via file picker</span>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
