import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { desc } from "drizzle-orm";
import { History, Shield, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const logs = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Security & Content Audit Trail
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Immutable log of all create, update, delete, publish, archive, and export operations
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Server Enforced Logging Active</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    log.action === "delete"
                      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      : log.action === "create"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-[var(--accent-subtle)] text-[var(--accent)]"
                  }`}>
                    {log.action}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    [{log.entityType}]
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {log.adminName}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    ({log.adminEmail})
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] pl-1">
                  {log.details}
                </p>
              </div>

              <div className="font-mono text-[10px] text-[var(--text-muted)] shrink-0 sm:text-right">
                <p>{new Date(log.createdAt).toLocaleDateString()}</p>
                <p>{new Date(log.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
