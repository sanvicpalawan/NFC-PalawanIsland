"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  Zap,
  Package,
  FileText,
  Settings,
  Image as ImageIcon,
  History,
  ShieldCheck,
  Compass,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: "owner" | "admin" | "editor" | "viewer";
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Lead Pipeline", href: "/admin/leads", icon: Users },
  { label: "Industries", href: "/admin/industries", icon: Layers },
  { label: "Use Cases", href: "/admin/use-cases", icon: Zap },
  { label: "Physical Hardware", href: "/admin/products", icon: Package },
  { label: "Page Content", href: "/admin/pages", icon: FileText },
  { label: "Site & Pilot Settings", href: "/admin/settings", icon: Settings },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
  { label: "Team & Permissions", href: "/admin/team", icon: ShieldCheck },
  { label: "Future Platform Roadmap", href: "/admin/platform-roadmap", icon: Compass },
];

export function AdminNav({
  initialAdmin,
  authBypassed = false,
}: {
  initialAdmin: UserProfile | null;
  authBypassed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, hide admin sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <>
      {/* Mobile top header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center font-bold text-xs">
            M
          </div>
          <span className="font-bold text-base font-serif-editorial">
            NFC Palawan Island Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`w-64 shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col justify-between p-4 md:sticky md:top-0 md:h-screen z-30 transition-all ${
          mobileOpen ? "block fixed inset-0 z-50 bg-[var(--bg-surface)]" : "hidden md:flex"
        }`}
      >
        <div className="space-y-6">
          {/* Top Brand */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] flex items-center justify-center font-bold text-sm shadow-xs">
                M
              </div>
              <div>
                <span className="font-bold text-base font-serif-editorial text-[var(--text-primary)] block leading-none">
                  NFC Palawan Island
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider">
                  Admin CMS
                </span>
              </div>
            </Link>

            {mobileOpen && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Links list */}
          <nav className="space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-[var(--text-primary)] text-[var(--bg-page)] font-semibold shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Actions */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
          {/* User profile card */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <div className="overflow-hidden pr-2">
              <p className="font-semibold text-[var(--text-primary)] truncate">
                {initialAdmin?.name || "Administrator"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold">
                  {initialAdmin?.role || "Admin"}
                </span>
              </div>
            </div>
            <ThemeToggle className="shrink-0" />
          </div>

          <div className="flex items-center justify-between px-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 text-[11px]"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {authBypassed ? (
              <span
                title="ADMIN_AUTH_DISABLED=true — login is skipped during development"
                className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]"
              >
                Dev bypass
              </span>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
