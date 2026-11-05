import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/db";
import { leads, products, industries, useCases, pages, auditLogs } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import {
  Users,
  Package,
  Layers,
  Zap,
  FileText,
  History,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [leadsCount] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const [productsCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [industriesCount] = await db.select({ count: sql<number>`count(*)` }).from(industries);
  const [useCasesCount] = await db.select({ count: sql<number>`count(*)` }).from(useCases);
  const [pagesCount] = await db.select({ count: sql<number>`count(*)` }).from(pages);

  const recentLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(5);

  const recentLogs = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(6);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--accent)] mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>NFC Palawan Island Connected CMS &middot; {admin.role.toUpperCase()} MODE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Welcome, {admin.name}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Connected business content and lead operations for Palawan & expansion markets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="px-4 py-2 rounded-full bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 shadow-xs"
          >
            Review Leads Pipeline
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded-full border border-[var(--border-strong)] text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)]"
          >
            Pilot Offer Settings
          </Link>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Link
          href="/admin/leads"
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Inquiries / Leads</span>
            <Users className="w-4 h-4 group-hover:text-[var(--accent)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {Number(leadsCount?.count || 0)}
          </p>
          <p className="text-[11px] text-[var(--accent)]">Live CRM pipeline</p>
        </Link>

        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Physical Hardware</span>
            <Package className="w-4 h-4 group-hover:text-[var(--accent)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {Number(productsCount?.count || 0)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">NFC & QR items</p>
        </Link>

        <Link
          href="/admin/industries"
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Active Industries</span>
            <Layers className="w-4 h-4 group-hover:text-[var(--accent)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {Number(industriesCount?.count || 0)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">Dynamic sectors</p>
        </Link>

        <Link
          href="/admin/use-cases"
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all space-y-1 block group"
        >
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">Digital Use Cases</span>
            <Zap className="w-4 h-4 group-hover:text-[var(--accent)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {Number(useCasesCount?.count || 0)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">Interactive modules</p>
        </Link>

        <Link
          href="/admin/pages"
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all space-y-1 block group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">CMS Pages</span>
            <FileText className="w-4 h-4 group-hover:text-[var(--accent)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {Number(pagesCount?.count || 0)}
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">Editable sections</p>
        </Link>
      </div>

      {/* Dual Column: Recent Leads & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
                Recent Inquiries & Pilot Applications
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Latest submissions from website lead forms
              </p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)]">
                      {lead.businessName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">
                      {lead.industry}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {lead.contactName} &middot; {lead.email} {lead.location ? `&middot; ${lead.location}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    lead.status === "pilot_offer"
                      ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                      : lead.status === "new"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Activity Stream */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] font-serif-editorial">
                Audit Trail Log
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Server-enforced action records
              </p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>Full Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs space-y-1"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {log.adminName}
                  </span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--accent)] uppercase font-mono text-[10px] mr-1.5">
                    [{log.action}]
                  </span>
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
