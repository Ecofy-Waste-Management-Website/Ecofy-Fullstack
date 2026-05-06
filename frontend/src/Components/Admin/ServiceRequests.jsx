import React, { useState, useEffect, useCallback } from "react";

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
    Completed:    "bg-green-100 text-green-800",
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
function KPIGrid({ stats }) {
  const cards = [
    { label: "Total Requests", value: stats.total,      colorText: "text-blue-600",   colorBg: "bg-blue-50",   icon: "📋", sub: "All service requests" },
    { label: "Pending",        value: stats.pending,    colorText: "text-yellow-600", colorBg: "bg-yellow-50", icon: "⏳", sub: "Awaiting assignment" },
    { label: "In Progress",    value: stats.inProgress, colorText: "text-purple-600", colorBg: "bg-purple-50", icon: "🚛", sub: "Currently active" },
    { label: "Completed",      value: stats.completed,  colorText: "text-green-600",  colorBg: "bg-green-50",  icon: "✅", sub: "Successfully closed" },
    { label: "Delayed",        value: stats.delayed,    colorText: "text-red-600",    colorBg: "bg-red-50",    icon: "🚨", sub: "Requires attention" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
      {cards.map(c => (
        <article key={c.label} className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className={`mb-2 w-max rounded-lg ${c.colorBg} p-2 text-xl`}>{c.icon}</div>
          <p className="text-sm font-medium text-gray-500">{c.label}</p>
          <p className={`text-2xl font-bold ${c.colorText}`}>{c.value ?? "—"}</p>
          <p className="mt-1 text-xs text-gray-400">{c.sub}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#0f1d33]">{req.requestId}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTailwind(req.status)}`}>
              {req.status}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-800 border-b pb-1">Customer Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong className="text-gray-800">Name:</strong> {req.customer}</p>
                <p><strong className="text-gray-800">Email:</strong> {req.email}</p>
                <p><strong className="text-gray-800">Location:</strong> {req.location}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-800 border-b pb-1">Request Info</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <strong className="text-gray-800 mr-2">Service Type:</strong>
                  <span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: typeColor(req.type) + "1a", color: typeColor(req.type) }}>
                    {req.type}
                  </span>
                </p>
                <p><strong className="text-gray-800">Waste Category:</strong> {req.wasteCategory}</p>
                <p><strong className="text-gray-800">Scheduled:</strong> {new Date(req.scheduledDate).toLocaleDateString()}</p>
                <p><strong className="text-gray-800">Submitted:</strong> {new Date(req.submittedAt).toLocaleString()}</p>
                {req.notes && <p><strong className="text-gray-800">Notes:</strong> {req.notes}</p>}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <h4 className="mb-3 font-semibold text-gray-800">Update Request</h4>
              <label className="mb-1 block text-sm font-medium text-gray-700">Assign Staff</label>
              <select className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={selStaff} onChange={e => setSelStaff(e.target.value)}>
                <option value="">— Unassigned —</option>
                {STAFF_LIST.map(s => <option key={s}>{s}</option>)}
              </select>

              <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" value={selStatus} onChange={e => setSelStatus(e.target.value)}>
                {STATUS_OPTIONS.slice(1).map(s => <option key={s}>{s}</option>)}
              </select>

              <button className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Right column: Timeline */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-800 border-b pb-1">Status Timeline</h4>
            <div className="relative pl-4 border-l-2 border-gray-100 ml-2">
              {(req.timeline || []).length === 0 && (
                <p className="text-sm text-gray-500">No timeline events yet.</p>
              )}
              {(req.timeline || []).map((ev, i) => {
                const isLast = i === req.timeline.length - 1;
                return (
                  <div key={i} className="mb-6 relative">
                    <div className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full border-2 border-white ${isLast ? "bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]" : "bg-gray-300"}`} />
                    <p className="text-sm font-medium text-gray-800">{ev.event}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
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
    <div className="w-full text-[#0f1d33]">

      {/* Page header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-500 m-0">Monitor, filter and manage all active waste pickup requests</p>
        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Live Updates
        </div>
      </div>

      {/* KPI cards */}
      <KPIGrid stats={stats} />

      {/* Filter bar */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            placeholder="🔍  Search by customer, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
            {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
            {LOCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <span className="ml-auto whitespace-nowrap rounded-md bg-gray-100 px-2.5 py-1 text-sm font-semibold text-gray-600">
            {requests.length} requests
          </span>
        </div>
      </div>

      {/* Requests table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h3 className="m-0 text-lg font-bold text-gray-800">Active Service Requests</h3>
        </div>

        {/* Loading / error states */}
        {loading && <p className="p-8 text-center text-gray-500">Loading requests…</p>}
        {error && <p className="p-8 text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-white border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Request ID</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Service Type</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Assigned Staff</th>
                  <th className="px-6 py-3 font-semibold">Submitted</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500">No requests match the selected filters.</td>
                  </tr>
                )}
                {requests.map(r => (
                  <tr key={r.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-bold text-gray-900">{r.requestId}</td>
                    <td className="px-6 py-4">{r.customer}</td>
                    <td className="px-6 py-4">{r.location}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-md px-2 py-1 text-xs font-bold" style={{ background: typeColor(r.type) + "1a", color: typeColor(r.type) }}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTailwind(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.assignedStaff
                        ? <span className="font-medium text-gray-800">{r.assignedStaff}</span>
                        : <span className="text-gray-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {timeAgo(r.submittedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100" 
                        onClick={() => setSelected(r.id)}
                      >
                        View Details
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