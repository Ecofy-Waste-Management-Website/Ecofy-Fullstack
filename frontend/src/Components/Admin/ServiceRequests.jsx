import React, { useState, useEffect, useCallback } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Total: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Pending: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  InProgress: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Completed: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Delayed: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Search: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

// ── Config ─────────────────────────────────────────────────────────────────────
const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5001";
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

// ── KPI Cards ──────────────────────────────────────────────────────────────────
// ── KPI Cards ──────────────────────────────────────────────────────────────────
function KPIGrid({ stats }) {
  const cards = [
    { label: "Total Requests", value: stats.total,      colorText: "text-blue-400",   icon: <Icons.Total />, sub: "All requests" },
    { label: "Pending",        value: stats.pending,    colorText: "text-amber-400",  icon: <Icons.Pending />, sub: "Awaiting" },
    { label: "In Progress",    value: stats.inProgress, colorText: "text-purple-400", icon: <Icons.InProgress />, sub: "Active" },
    { label: "Completed",      value: stats.completed,  colorText: "text-[#66c45e]",  icon: <Icons.Completed />, sub: "Closed" },
    { label: "Delayed",        value: stats.delayed,    colorText: "text-red-400",    icon: <Icons.Delayed />, sub: "Critical" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
      {cards.map(c => (
        <article key={c.label} className="bg-white/10 backdrop-blur-[50px] p-5 rounded-2xl shadow-xl border border-white/20">
          <div className={`mb-3 w-max rounded-lg bg-white/10 p-2 ${c.colorText}`}>{c.icon}</div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{c.label}</p>
          <p className={`text-3xl font-extrabold mt-1 ${c.colorText}`}>{c.value ?? "—"}</p>
          <p className="text-[9px] text-white/20 uppercase font-bold mt-1">{c.sub}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-[#244c21] border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold text-white">{req.requestId}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${statusTailwind(req.status)}`}>
              {req.status}
            </span>
          </div>
          <button className="text-white/40 hover:text-white" onClick={onClose}><Icons.Close /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <h4 className="mb-4 font-bold text-white/60 text-xs uppercase tracking-widest border-b border-white/5 pb-2">Customer Details</h4>
              <div className="space-y-2 text-sm text-white/80">
                <p><strong className="text-white font-bold">Name:</strong> {req.customer}</p>
                <p><strong className="text-white font-bold">Email:</strong> {req.email}</p>
                <p><strong className="text-white font-bold">Location:</strong> {req.location}</p>
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <h4 className="mb-4 font-bold text-white/60 text-xs uppercase tracking-widest border-b border-white/5 pb-2">Request Info</h4>
              <div className="space-y-3 text-sm text-white/80">
                <p className="flex items-center">
                  <strong className="text-white font-bold mr-2">Service Type:</strong>
                  <span className="rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest" style={{ background: typeColor(req.type) + "40", color: "#fff", border: `1px solid ${typeColor(req.type)}` }}>
                    {req.type}
                  </span>
                </p>
                <p><strong className="text-white font-bold">Waste Category:</strong> {req.wasteCategory}</p>
                <p><strong className="text-white font-bold">Scheduled:</strong> {new Date(req.scheduledDate).toLocaleDateString()}</p>
                <p><strong className="text-white font-bold">Submitted:</strong> {new Date(req.submittedAt).toLocaleString()}</p>
                {req.notes && <p><strong className="text-white font-bold">Notes:</strong> {req.notes}</p>}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 border border-white/10 shadow-inner">
              <h4 className="mb-4 font-bold text-white text-sm uppercase tracking-widest">Update Management</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Assign Staff</label>
                  <select className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all" value={selStaff} onChange={e => setSelStaff(e.target.value)}>
                    <option value="" className="bg-[#244c21]">— Unassigned —</option>
                    {STAFF_LIST.map(s => <option key={s} value={s} className="bg-[#244c21]">{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</label>
                  <select className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all" value={selStatus} onChange={e => setSelStatus(e.target.value)}>
                    {STATUS_OPTIONS.slice(1).map(s => <option key={s} value={s} className="bg-[#244c21]">{s}</option>)}
                  </select>
                </div>

                <button className="w-full rounded-xl bg-[#66c45e] py-3 font-extrabold text-[#051F10] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-[#66c45e]/20" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Confirm Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Timeline */}
          <div className="bg-black/10 p-6 rounded-2xl border border-white/5 flex flex-col">
            <h4 className="mb-6 font-bold text-white/60 text-xs uppercase tracking-widest border-b border-white/5 pb-2">Status Timeline</h4>
            <div className="relative pl-6 border-l border-white/10 ml-2 flex-1">
              {(req.timeline || []).length === 0 && (
                <p className="text-sm text-white/30 italic">No timeline events yet.</p>
              )}
              {(req.timeline || []).map((ev, i) => {
                const isLast = i === req.timeline.length - 1;
                return (
                  <div key={i} className="mb-8 relative">
                    <div className={`absolute -left-[30px] top-1.5 h-4 w-4 rounded-full border-2 border-[#244c21] ${isLast ? "bg-[#66c45e] shadow-[0_0_12px_rgba(102,196,94,0.6)]" : "bg-white/20"}`} />
                    <p className="text-sm font-extrabold text-white">{ev.event}</p>
                    <p className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-tighter">
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
        <p className="text-sm text-white/50 m-0">Monitor, filter and manage all active waste pickup requests</p>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#66c45e] backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#66c45e] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#66c45e]"></span>
          </span>
          Live Updates Active
        </div>
      </div>

      {/* KPI cards */}
      <KPIGrid stats={stats} />

      {/* Filter bar */}
      <div className="mb-6 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-[50px] p-5 shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              <Icons.Search />
            </span>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] focus:bg-black/30 transition-all placeholder:text-white/30"
              placeholder="Search customer, location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all cursor-pointer" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
              {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-[#244c21]">{o}</option>)}
            </select>
            <select className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all cursor-pointer" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              {TYPE_OPTIONS.map(o => <option key={o} value={o} className="bg-[#244c21]">{o}</option>)}
            </select>
            <select className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-[#66c45e] transition-all cursor-pointer" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
              {LOCATION_OPTIONS.map(o => <option key={o} value={o} className="bg-[#244c21]">{o}</option>)}
            </select>
          </div>
          <span className="ml-auto whitespace-nowrap rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/60 uppercase tracking-widest border border-white/5">
            {requests.length} results
          </span>
        </div>
      </div>

      {/* Requests table */}
      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-[50px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-8 py-5">
          <h3 className="m-0 text-lg font-bold text-white">Active Service Requests</h3>
        </div>

        {/* Loading / error states */}
        {loading && <p className="p-12 text-center text-white/40 font-bold uppercase tracking-widest text-xs animate-pulse">Loading requests…</p>}
        {error && <p className="p-12 text-center text-red-400 font-bold">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/5 border-b border-white/5 text-white/40 uppercase tracking-widest text-[10px] font-bold">
                <tr>
                  <th className="px-8 py-4">Request ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Location</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Staff</th>
                  <th className="px-8 py-4">Time</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-white/30 font-medium italic">No requests match your current filters.</td>
                  </tr>
                )}
                {requests.map(r => (
                  <tr key={r.id} className="transition-colors hover:bg-white/5">
                    <td className="px-8 py-5 font-extrabold text-white">{r.requestId}</td>
                    <td className="px-8 py-5 font-bold text-white/90">{r.customer}</td>
                    <td className="px-8 py-5 text-white/70">{r.location}</td>
                    <td className="px-8 py-5">
                      <span className="rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest" style={{ background: typeColor(r.type) + "40", color: "#fff", border: `1px solid ${typeColor(r.type)}` }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${statusTailwind(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {r.assignedStaff
                        ? <span className="font-bold text-[#66c45e]">{r.assignedStaff}</span>
                        : <span className="text-white/20 italic">Unassigned</span>}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                      {timeAgo(r.submittedAt)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold text-white uppercase tracking-widest transition hover:bg-white/20 hover:border-white/30 active:scale-95" 
                        onClick={() => setSelected(r.id)}
                      >
                        Details
                      </button>
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