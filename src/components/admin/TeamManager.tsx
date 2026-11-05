"use client";

import { useState, useEffect } from "react";
import { Shield, Plus, KeyRound, CheckCircle2, UserCheck, X, Loader2 } from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export function TeamManager() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/admins");
      if (!res.ok) throw new Error("Failed to load admins");
      const data = await res.json();
      setAdmins(data.admins || []);
      setCurrentUser(data.currentUser || null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create administrator");

      setMessage({ type: "success", text: `Administrator ${formData.name} created successfully with role '${formData.role}'.` });
      setIsAdding(false);
      setFormData({ name: "", email: "", password: "", role: "editor" });
      await fetchAdmins();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Administrator Roles & Permissions
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Owner, Admin, Editor, and Viewer role enforcement on server endpoints
          </p>
        </div>

        {currentUser?.role === "owner" && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Administrator Account</span>
          </button>
        )}
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
              Create New Administrator
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="e.g. Maria Clara"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="clara@merqato.digital"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Secure Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)]"
                >
                  <option value="editor">Editor (Can edit and publish content)</option>
                  <option value="admin">Admin (All CMS operations)</option>
                  <option value="viewer">Viewer (Read-only access)</option>
                </select>
              </div>
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
                <span>Create Administrator</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Role permission breakdown card */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h2 className="text-sm font-bold text-[var(--text-primary)] font-serif-editorial">
          Enforced Permission Hierarchy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-bold">
              OWNER
            </span>
            <p className="font-semibold text-[var(--text-primary)] mt-1">Full System Governance</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Can manage team accounts, site settings, deletions, and all content collections.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold">
              ADMIN
            </span>
            <p className="font-semibold text-[var(--text-primary)] mt-1">Operations & Content</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Can edit, publish, delete content, and manage leads. Cannot delete owner accounts.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              EDITOR
            </span>
            <p className="font-semibold text-[var(--text-primary)] mt-1">Publishing & Updates</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Can create, update, and publish content. Cannot delete records or alter site settings.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 font-bold">
              VIEWER
            </span>
            <p className="font-semibold text-[var(--text-primary)] mt-1">Read-Only Auditing</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Can inspect lead records, content previews, and audit logs with zero mutation rights.
            </p>
          </div>
        </div>
      </div>

      {/* Active Admins List */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
        <p className="text-xs uppercase font-semibold text-[var(--text-muted)] font-mono">
          Registered Administrators ({admins.length}):
        </p>

        {loading ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading admin accounts...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {admins.map((adm) => (
              <div
                key={adm.id}
                className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[var(--text-primary)]">{adm.name}</p>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[var(--tag-bg)] text-[var(--accent)] font-bold uppercase">
                      {adm.role}
                    </span>
                    {currentUser?.email === adm.email && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{adm.email}</p>
                </div>

                <div className="text-[10px] font-mono text-[var(--text-muted)] sm:text-right">
                  <p>Created: {new Date(adm.createdAt).toLocaleDateString()}</p>
                  <p>
                    {adm.lastLoginAt
                      ? `Last Login: ${new Date(adm.lastLoginAt).toLocaleString()}`
                      : "Never logged in"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
