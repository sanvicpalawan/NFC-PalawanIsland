"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center font-bold text-base shadow-sm">
            M
          </div>
          <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            NFC Palawan Island Admin
          </span>
        </Link>
        <p className="text-xs text-[var(--text-muted)] font-mono">
          Palawan Collective Content Management & Operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Authorized Session Login
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 text-xs flex items-center gap-2 border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder="you@merqato.digital"
                />
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            &larr; Return to Public Website (merqato.digital)
          </Link>
        </div>
      </div>
    </div>
  );
}
