"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  Loader2,
} from "lucide-react";

interface LeadItem {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phone: string | null;
  industry: string | null;
  location: string | null;
  interestedSolutions: any;
  productInquirySlug: string | null;
  message: string | null;
  sourceUrl: string | null;
  status: string;
  notes: any;
  createdAt: string;
}

export function LeadsManager() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter) query.set("status", statusFilter);

      const res = await fetch(`/api/admin/leads?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to load leads");
      const data = await res.json();
      setLeads(data.leads || []);
      if (selectedLead) {
        const refreshed = (data.leads || []).find((l: LeadItem) => l.id === selectedLead.id);
        if (refreshed) setSelectedLead(refreshed);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setActionMessage({ type: "success", text: `Lead status updated to ${newStatus}.` });
      await fetchLeads();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (id: number) => {
    if (!newNote.trim()) return;
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNote: newNote.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      setNewNote("");
      setActionMessage({ type: "success", text: "Internal note appended." });
      await fetchLeads();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead record? This action is recorded in audit logs.")) {
      return;
    }
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");
      setSelectedLead(null);
      setActionMessage({ type: "success", text: "Lead permanently removed." });
      await fetchLeads();
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCsv = () => {
    window.location.href = `/api/admin/leads?export=true${statusFilter ? `&status=${statusFilter}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] font-serif-editorial">
            Inquiries & Lead Management
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Incoming website demo requests and pilot applications
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] text-xs font-semibold hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {actionMessage && (
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
          actionMessage.type === "success"
            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
            : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900"
        }`}>
          <span>{actionMessage.text}</span>
          <button type="button" onClick={() => setActionMessage(null)} className="underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-7 relative">
          <input
            type="text"
            placeholder="Search by business name, contact, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
        </div>

        <div className="sm:col-span-5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          >
            <option value="">All Pipeline Statuses</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="pilot_offer">In Pilot Review</option>
            <option value="closed">Closed / Deployed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main split grid: list on left, details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leads Table / List */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex justify-between items-center text-xs text-[var(--text-muted)] font-mono pb-2 border-b border-[var(--border-subtle)]">
            <span>Inquiries ({leads.length})</span>
            <span>Click row to view details & notes</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)]">
              No leads match your filter.
            </div>
          ) : (
            <div className="space-y-2">
              {leads.map((l) => {
                const isSelected = selectedLead?.id === l.id;
                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLead(l)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-xs"
                        : "bg-[var(--bg-page)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-[var(--text-primary)] truncate">
                          {l.businessName}
                        </p>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--tag-bg)] text-[var(--text-secondary)]">
                          {l.industry}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
                        {l.contactName} &middot; {l.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        l.status === "pilot_offer"
                          ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                          : l.status === "new"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}>
                        {l.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Lead Details Drawer */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
          {selectedLead ? (
            <>
              <div className="flex items-start justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif-editorial">
                    {selectedLead.businessName}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Submitted {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Delete Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Pipeline Status
                </label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  disabled={updating}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-semibold text-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                >
                  <option value="new">NEW (Uncontacted)</option>
                  <option value="contacted">CONTACTED</option>
                  <option value="qualified">QUALIFIED</option>
                  <option value="pilot_offer">IN PILOT REVIEW</option>
                  <option value="closed">CLOSED / DEPLOYED</option>
                  <option value="archived">ARCHIVED</option>
                </select>
              </div>

              {/* Coordinates info */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Contact Person:</span>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedLead.contactName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Email & Phone:</span>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedLead.email} {selectedLead.phone ? `&middot; ${selectedLead.phone}` : ""}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Location & Sector:</span>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedLead.location || "Not specified"} ({selectedLead.industry})</p>
                </div>
                {selectedLead.sourceUrl && (
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Originating Webpage:</span>
                    <p className="font-mono text-[11px] text-[var(--text-muted)]">{selectedLead.sourceUrl}</p>
                  </div>
                )}
              </div>

              {/* Interested Solutions */}
              {Array.isArray(selectedLead.interestedSolutions) && selectedLead.interestedSolutions.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    Interested Solutions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.interestedSolutions.map((sol: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--tag-bg)] text-[var(--text-secondary)]"
                      >
                        {sol}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedLead.message && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    Client Message:
                  </p>
                  <p className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed italic">
                    &ldquo;{selectedLead.message}&rdquo;
                  </p>
                </div>
              )}

              {/* Internal Notes Thread */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Internal Staff Notes</span>
                </p>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {Array.isArray(selectedLead.notes) && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note: any, i: number) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-mono">
                          <span className="font-semibold text-[var(--text-primary)]">{note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-[var(--text-muted)] italic">No staff notes yet.</p>
                  )}
                </div>

                {/* Add Note Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Append staff note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNote(selectedLead.id)}
                    disabled={updating || !newNote.trim()}
                    className="px-3 py-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-page)] text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-[var(--text-muted)] space-y-2">
              <p>Select any lead from the list to view complete inquiry details, update pipeline status, or append internal staff notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
