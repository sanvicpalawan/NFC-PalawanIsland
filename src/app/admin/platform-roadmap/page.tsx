import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { Compass, ShieldCheck, Radio, Server, Key, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPlatformRoadmapPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const integrationPoints = [
    {
      title: "1. QR / NFC Tag Serial Registry",
      status: "Ready for Platform Mount",
      description: "Cryptographic batch registration for physical NXP NTAG213/215/424 DNA tags with factory UID validation and venue allocation mapping.",
      endpoint: "POST /api/v1/registry/tags/batch",
    },
    {
      title: "2. Edge Cloud Redirect Service",
      status: "Ready for Platform Mount",
      description: "Sub-50ms regional DNS resolution routing tag UIDs to dynamic destination URLs (menus, reviews, portals) without altering physical chips.",
      endpoint: "GET /r/:tagUid (302 Dynamic Cloud Redirect)",
    },
    {
      title: "3. Venue & Location Multi-Tenant Management",
      status: "Schema Ready",
      description: "Client portal organization allowing resort managers to bind room numbers, beach cabanas, sunbed zones, and boat vessels to specific hardware tags.",
      endpoint: "POST /api/v1/venues/:venueId/locations",
    },
    {
      title: "4. Device Interaction Analytics Engine",
      status: "Awaiting Live Ingestion Cluster",
      description: "Real-time telemetry logging: tap volume by table, peak meal hours, mobile OS breakdown, and guest language selections. (Mock data strictly avoided until live stream ingestion is active).",
      endpoint: "POST /api/v1/telemetry/event",
    },
    {
      title: "5. Client Self-Serve Dashboard & Orders Dispatch",
      status: "Architecture Defined",
      description: "Venue tablet interface for kitchen order reception, housekeeping status toggle, and late-checkout approvals.",
      endpoint: "WSS /ws/venues/:venueId/dispatch",
    },
    {
      title: "6. Customer Subscription & Hardware Re-Order Billing",
      status: "Integration Ready",
      description: "Philippine Peso (Maya / GCash / Card) recurring billing for post-pilot subscriptions and physical replacement disc orders.",
      endpoint: "POST /api/v1/billing/subscriptions",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--accent)]">
          <Compass className="w-3.5 h-3.5" />
          <span>Operational Architecture Specifications</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
          Future MerQato Platform Integration Points
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-2xl">
          Clean integration boundary separating the marketing CMS from the future MerQato QR/NFC operational redirect platform. Per engineering principles, mock analytics are avoided until live hardware telemetry is connected.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-2 text-xs flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--text-primary)] text-sm">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)] font-semibold">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <span className="font-mono text-[11px] text-[var(--accent)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-md block truncate">
                  {item.endpoint}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
