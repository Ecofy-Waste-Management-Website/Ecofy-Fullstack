import React, { useState, useEffect, useCallback } from "react";
import { FileText, Clock, Zap, CheckCircle, AlertTriangle, Search, X } from 'lucide-react';
import { Button, Badge } from './UIComponents';

// ── Icons ──────────────────────────────────────────────────────────────────

// ── Config ─────────────────────────────────────────────────────────────────────
const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = `${API_ORIGIN}/service-monitoring`;
const WS_URL = API_ORIGIN.replace(/^http/, "ws");

const STAFF_LIST = [
  "Banuka J.", "Priyantha S.", "Amara K.", "Nimal R.",
  "Dilshan P.", "Sachini M.", "Roshan T.", "Chamara W.",
];

const STATUS_OPTIONS   = ["All", "Pending", "Assigned", "In Progress", "Completed", "Delayed"];
const TYPE_OPTIONS     = ["All", "Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"];
const LOCATION_OPTIONS = ["All", "Colombo 03", "Colombo 05", "Colombo 07", "Kandy", "Nugegoda", "Dehiwala", "Rajagiriya", "Moratuwa"];

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function statusTailwind(s) {
  return {
    Pending:      "bg-yellow-100 text-yellow-800",
    Assigned:     "bg-blue-100 text-blue-800",
    "In Progress":"bg-purple-100 text-purple-800",
    Completed:    "bg-green-100 text-[#397239]",
    Delayed:      "bg-red-100 text-red-800",
  }[s] || "bg-gray-100 text-gray-800";
}

function typeColor(t) {
  return {
    Household:       "#0b6ca8",
    Commercial:      "#5b35b5",
    Bulk:            "#856800",
    Garden:          "#1a7c4b",
    "Drain Cleaning":"#c9320f",
  }[t] || "#444";
}

function formatAssignedStaff(value) {
  if (!value) return null;
  if (STAFF_LIST.includes(value)) return value;
  return "Assigned Staff";
}

// ── KPI Cards ──────────────────────────────────────────────────────────────────
// ── KPI Cards ──────────────────────────────────────────────────────────────────
function KPIGrid({ stats }) {
  const cards = [
    { label: "Total Requests", value: stats.total,      colorText: "text-blue-400",   icon: <FileText size={20} />, sub: "All requests" },
    { label: "Pending",        value: stats.pending,    colorText: "text-amber-400",  icon: <Clock size={20} />, sub: "Awaiting" },
    { label: "In Progress",    value: stats.inProgress, colorText: "text-purple-400", icon: <Zap size={20} />, sub: "Active" },
    { label: "Completed",      value: stats.completed,  colorText: "text-[#66c45e]",  icon: <CheckCircle size={20} />, sub: "Closed" },
    { label: "Delayed",        value: stats.delayed,    colorText: "text-red-400",    icon: <AlertTriangle size={20} />, sub: "Critical" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
      {cards.map(c => (
        <article key={c.label} className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-5 rounded-2xl shadow-sm border border-[#397234]/20">
          <div className={`mb-3 w-max rounded-lg bg-[#397234]/10 p-2 ${c.colorText.replace('text-blue-400', 'text-blue-600').replace('text-amber-400', 'text-amber-600').replace('text-[#66c45e]', 'text-[#397239]').replace('text-red-400', 'text-red-600')}`}>{c.icon}</div>
          <p className="text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest">{c.label}</p>
          <p className={`text-3xl font-extrabold mt-1 ${c.colorText.replace('text-blue-400', 'text-blue-600').replace('text-amber-400', 'text-amber-600').replace('text-[#66c45e]', 'text-[#397239]').replace('text-red-400', 'text-red-600')}`}>{c.value ?? "—"}</p>
          <p className="text-[9px] text-[#397239]/40 uppercase font-bold mt-1">{c.sub}</p>
        </article>
      ))}
    </section>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────────
function RequestModal({ req, onClose, onStatusChange, onAssign }) {
  const [selStaff,  setSelStaff]  = useState(req.assignedStaff || "");
  const [selStatus, setSelStatus] = useState(req.status);
  const [saving,    setSaving]    = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      if (selStaff  !== (req.assignedStaff || "")) await onAssign(req.id, selStaff || null);
      if (selStatus !== req.status)                await onStatusChange(req.id, selStatus);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white border border-[#112A0F]/20 shadow-2xl" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between border-b border-[#397234]/10 bg-[#D6E9CA]/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-[#244c21] tracking-tight">{req.requestId}</span>
            <Badge variant="primary">{req.status}</Badge>
          </div>
          <button className="text-[#397239]/40 hover:text-[#397239]" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#D6E9CA]/50 p-5 rounded-2xl border border-[#397234]/5">
              <h4 className="mb-4 font-bold text-[#397239]/60 text-xs uppercase tracking-widest border-b border-[#397234]/10 pb-2">Customer Details</h4>
              <div className="space-y-2 text-sm text-[#244c21]">
                <p><strong className="text-[#397239] font-bold">Name:</strong> {req.customer}</p>
                <p><strong className="text-[#397239] font-bold">Email:</strong> {req.email}</p>
                <p><strong className="text-[#397239] font-bold">Location:</strong> {req.location}</p>
              </div>
            </div>

            <div className="bg-[#112A0F]/5 p-5 rounded-2xl border border-[#397239]/5">
              <h4 className="mb-4 font-bold text-[#397239]/60 text-xs uppercase tracking-widest border-b border-[#112A0F]/10 pb-2">Request Info</h4>
              <div className="space-y-3 text-sm text-[#244c21]">
                <p className="flex items-center">
                  <strong className="text-[#397239] font-bold mr-2">Service Type:</strong>
                  <span className="rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest" style={{ background: typeColor(req.type) + "20", color: typeColor(req.type), border: `1px solid ${typeColor(req.type)}30` }}>
                    {req.type}
                  </span>
                </p>
                <p><strong className="text-[#397239] font-bold">Waste Category:</strong> {req.wasteCategory}</p>
                <p><strong className="text-[#397239] font-bold">Scheduled:</strong> {new Date(req.scheduledDate).toLocaleDateString()}</p>
                <p><strong className="text-[#397239] font-bold">Submitted:</strong> {new Date(req.submittedAt).toLocaleString()}</p>
                {req.notes && <p><strong className="text-[#397239] font-bold">Notes:</strong> {req.notes}</p>}
              </div>
            </div>

            <div className="rounded-2xl bg-[#D6E9CA]/50 p-6 border border-[#397234]/10 shadow-inner">
              <h4 className="mb-4 font-black text-[#244c21] text-sm uppercase tracking-widest">Update Management</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest">Assign Staff</label>
                  <select className="w-full rounded-xl bg-white border border-[#112A0F]/10 px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all" value={selStaff} onChange={e => setSelStaff(e.target.value)}>
                    <option value="" className="bg-white">— Unassigned —</option>
                    {STAFF_LIST.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-[#397239]/70 uppercase tracking-widest">Status</label>
                  <select className="w-full rounded-xl bg-white border border-[#112A0F]/10 px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all" value={selStatus} onChange={e => setSelStatus(e.target.value)}>
                    {STATUS_OPTIONS.slice(1).map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
                  </select>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Confirm Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right column: Timeline */}
          <div className="bg-[#D6E9CA]/50 p-6 rounded-2xl border border-[#397234]/5 flex flex-col">
            <h4 className="mb-6 font-bold text-[#397239]/60 text-xs uppercase tracking-widest border-b border-[#397234]/10 pb-2">Status Timeline</h4>
            <div className="relative pl-6 border-l border-[#112A0F]/10 ml-2 flex-1">
              {(req.timeline || []).length === 0 && (
                <p className="text-sm text-[#397239]/30 italic">No timeline events yet.</p>
              )}
              {(req.timeline || []).map((ev, i) => {
                const isLast = i === req.timeline.length - 1;
                return (
                  <div key={i} className="mb-8 relative">
                    <div className={`absolute -left-[30px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${isLast ? "bg-[#397239] shadow-[0_0_12px_rgba(57,114,57,0.4)]" : "bg-[#397239]/20"}`} />
                    <p className="text-sm font-black text-[#244c21]">{ev.event}</p>
                    <p className="text-[10px] font-bold text-[#397239]/60 mt-1 uppercase tracking-tighter">
                      {timeAgo(ev.time)} · {new Date(ev.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [stats,    setStats]    = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, delayed: 0 });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [filters,  setFilters]  = useState({ status: "All", type: "All", location: "All" });
  const [selected, setSelected] = useState(null);
  const [, setTick] = useState(0);

  // Refresh relative timestamps every 30s
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status   !== "All") params.set("status",   filters.status);
      if (filters.type     !== "All") params.set("type",     filters.type);
      if (filters.location !== "All") params.set("location", filters.location);
      if (search)                     params.set("search",   search);

      const res  = await fetch(`${API_BASE}?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setRequests(json.data);
      setError(null);
    } catch (err) {
      setError("Failed to load requests. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/stats`);
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch { /* stats are non-critical */ }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [fetchRequests, fetchStats]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "REQUEST_UPDATED") {
          setRequests(prev => prev.map(r => r.id === msg.data.id ? msg.data : r));
          fetchStats();
        }
        if (msg.type === "REQUEST_CREATED") {
          setRequests(prev => [msg.data, ...prev]);
          fetchStats();
        }
        if (msg.type === "REQUEST_DELETED") {
          setRequests(prev => prev.filter(r => r.id !== msg.requestId));
          fetchStats();
        }
      } catch { }
    };
    ws.onerror = () => console.warn("WebSocket unavailable — live updates off");
    return () => ws.close();
  }, [fetchStats]);

  async function handleStatusChange(id, newStatus) {
    await fetch(`${API_BASE}/${id}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: newStatus }),
    });
  }

  async function handleAssign(id, staff) {
    await fetch(`${API_BASE}/${id}/assign`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ assignedStaff: staff }),
    });
  }

  const selReq = selected ? requests.find(r => r.id === selected) : null;

  return (
    <div className="w-full">

      {/* Page header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-[#397239]/80 m-0 font-bold">Monitor, filter and manage all active waste pickup requests</p>
        <div className="flex items-center gap-2 rounded-full border border-[#397234]/10 bg-[#D6E9CA]/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#397239] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#397239] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#397239]"></span>
          </span>
          Live Updates Active
        </div>
      </div>

      {/* KPI cards */}
      <KPIGrid stats={stats} />

      {/* Filter bar */}
      <div className="mb-6 rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#397239]/60">
              <Search size={16} />
            </span>
            <input
              className="w-full rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 pl-11 pr-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] focus:bg-white transition-all placeholder:text-[#397239]/60"
              placeholder="Search customer, location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select className="rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all cursor-pointer font-bold" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
              {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-white">{o}</option>)}
            </select>
            <select className="rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all cursor-pointer font-bold" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              {TYPE_OPTIONS.map(o => <option key={o} value={o} className="bg-white">{o}</option>)}
            </select>
            <select className="rounded-xl border border-[#397234]/10 bg-white/40 px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all cursor-pointer font-bold" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
              {LOCATION_OPTIONS.map(o => <option key={o} value={o} className="bg-white">{o}</option>)}
            </select>
          </div>
          <span className="ml-auto whitespace-nowrap rounded-lg bg-[#397234]/10 px-3 py-1.5 text-[10px] font-bold text-[#397239] uppercase tracking-widest border border-[#397234]/10">
            {requests.length} results
          </span>
        </div>
      </div>

      {/* Requests table */}
      <div className="overflow-hidden rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#397234]/10 bg-[#D6E9CA]/50 px-8 py-5">
          <h3 className="m-0 text-lg font-black text-[#244c21]">Active Service Requests</h3>
        </div>

        {/* Loading / error states */}
        {loading && <p className="p-12 text-center text-white/40 font-bold uppercase tracking-widest text-xs animate-pulse">Loading requests…</p>}
        {error && <p className="p-12 text-center text-red-400 font-bold">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#244c21]">
              <thead className="bg-[#397234]/10 border-b border-[#397234]/10 text-[#397239] uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-4">Request ID</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4 pl-10">Status</th>
                  <th className="px-4 py-4 pl-10">Staff</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-4 py-4 pl-10">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-white/30 font-medium italic">No requests match your current filters.</td>
                  </tr>
                )}
                {requests.map(r => (
                  <tr key={r.id} className="transition-colors hover:bg-[#112A0F]/5">
                    <td className="px-4 py-5 font-black text-[#244c21]">{r.requestId}</td>
                    <td className="px-4 py-5 font-bold text-[#244c21]">{r.customer}</td>
                    <td className="px-4 py-5 text-[#397239]/80 font-medium">{r.location}</td>
                    <td className="px-4 py-5">
                      <span className="rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest" style={{ background: typeColor(r.type) + "20", color: typeColor(r.type), border: `1px solid ${typeColor(r.type)}40` }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="primary">{r.status}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      {r.assignedStaff
                        ? <span className="font-bold text-[#397239]">{formatAssignedStaff(r.assignedStaff)}</span>
                        : <span className="text-[#397239]/20 italic font-medium">Unassigned</span>}
                    </td>
                  <td className="px-8 py-5">
  <div className="flex flex-col">

    <span className="text-xs font-bold text-[#244c21]">
      {new Date(r.submittedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
    </span>

    <span className="text-[10px] text-[#397239]/50 font-medium">
      {new Date(r.submittedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>

  </div>
</td>
                    <td className="px-8 py-5 text-right">
<<<<<<< HEAD
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelected(r.id)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selReq && (
        <RequestModal
          req={selReq}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
}