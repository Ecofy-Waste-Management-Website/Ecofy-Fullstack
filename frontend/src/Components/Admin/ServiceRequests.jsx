import React, { useState, useEffect, useCallback } from "react";
import "./ServiceRequests.css";

// ── Config ─────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5001/service-monitoring";
const WS_URL   = "ws://localhost:5001";

const STAFF_LIST = [
  "Banuka J.", "Priyantha S.", "Amara K.", "Nimal R.",
  "Dilshan P.", "Sachini M.", "Roshan T.", "Chamara W.",
];

const STATUS_OPTIONS   = ["All", "Pending", "Assigned", "In Progress", "Completed", "Delayed"];
const TYPE_OPTIONS     = ["All", "Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"];
const LOCATION_OPTIONS = ["All", "Colombo 03", "Colombo 05", "Colombo 07",
  "Kandy", "Nugegoda", "Dehiwala", "Rajagiriya", "Moratuwa"];

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function statusClass(s) {
  return {
    Pending:      "pending",
    Assigned:     "assigned",
    "In Progress":"inprogress",
    Completed:    "completed",
    Delayed:      "delayed",
  }[s] || "";
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
    { label: "Total Requests", value: stats.total,      color: "blue",   icon: "📋", sub: "All service requests" },
    { label: "Pending",        value: stats.pending,    color: "amber",  icon: "⏳", sub: "Awaiting assignment" },
    { label: "In Progress",    value: stats.inProgress, color: "purple", icon: "🚛", sub: "Currently active" },
    { label: "Completed",      value: stats.completed,  color: "green",  icon: "✅", sub: "Successfully closed" },
    { label: "Delayed",        value: stats.delayed,    color: "red",    icon: "🚨", sub: "Requires attention" },
  ];

  return (
    <section className="sr-kpi-grid">
      {cards.map(c => (
        <article key={c.label} className="sr-kpi-card">
          <div className="sr-kpi-icon">{c.icon}</div>
          <p className="sr-kpi-label">{c.label}</p>
          <p className={`sr-kpi-value ${c.color}`}>{c.value ?? "—"}</p>
          <p className="sr-kpi-sub">{c.sub}</p>
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
    <div className="sr-modal-overlay" onClick={onClose}>
      <div className="sr-modal" onClick={e => e.stopPropagation()}>

        <div className="sr-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="sr-modal-id">{req.requestId}</span>
            <span className={`status ${statusClass(req.status)}`}>{req.status}</span>
          </div>
          <button className="sr-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="sr-modal-body">
          {/* Left column */}
          <div className="sr-modal-left">
            <div className="sr-modal-section">
              <h4>Customer Details</h4>
              <p><strong>Name:</strong> {req.customer}</p>
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Location:</strong> {req.location}</p>
            </div>

            <div className="sr-modal-section">
              <h4>Request Info</h4>
              <p>
                <strong>Service Type:</strong>
                <span className="sr-type-badge" style={{
                  background: typeColor(req.type) + "1a",
                  color: typeColor(req.type),
                  marginLeft: 6,
                }}>
                  {req.type}
                </span>
              </p>
              <p><strong>Waste Category:</strong> {req.wasteCategory}</p>
              <p><strong>Scheduled:</strong> {new Date(req.scheduledDate).toLocaleDateString()}</p>
              <p><strong>Submitted:</strong> {new Date(req.submittedAt).toLocaleString()}</p>
              {req.notes && <p><strong>Notes:</strong> {req.notes}</p>}
            </div>

            <div className="sr-modal-section">
              <h4>Update Request</h4>
              <label className="sr-label">Assign Staff</label>
              <select
                className="sr-select"
                value={selStaff}
                onChange={e => setSelStaff(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">— Unassigned —</option>
                {STAFF_LIST.map(s => <option key={s}>{s}</option>)}
              </select>

              <label className="sr-label">Status</label>
              <select
                className="sr-select"
                value={selStatus}
                onChange={e => setSelStatus(e.target.value)}
                style={{ width: "100%", marginBottom: 14 }}
              >
                {STATUS_OPTIONS.slice(1).map(s => <option key={s}>{s}</option>)}
              </select>

              <button className="sr-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Right column: Timeline */}
          <div className="sr-modal-right">
            <h4 className="sr-timeline-title">Status Timeline</h4>
            <div className="sr-timeline">
              {(req.timeline || []).length === 0 && (
                <p style={{ color: "#8895aa", fontSize: "0.85rem" }}>No timeline events yet.</p>
              )}
              {(req.timeline || []).map((ev, i) => {
                const isLast = i === req.timeline.length - 1;
                return (
                  <div key={i} className="sr-tl-item">
                    <div className={`sr-tl-dot${isLast ? " latest" : ""}`} />
                    {!isLast && <div className="sr-tl-line" />}
                    <div>
                      <p className="sr-tl-event">{ev.event}</p>
                      <p className="sr-tl-time">
                        {timeAgo(ev.time)} · {new Date(ev.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
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

  // ── Fetch requests from API ────────────────────────────────────────────────
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

  // ── Fetch KPI stats ────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/stats`);
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch { /* stats are non-critical */ }
  }, []);

  // Initial load + re-fetch when filters change
  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [fetchRequests, fetchStats]);

  // ── WebSocket — real-time updates ──────────────────────────────────────────
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);

        if (msg.type === "REQUEST_UPDATED") {
          setRequests(prev =>
            prev.map(r => r.id === msg.data.id ? msg.data : r)
          );
          fetchStats(); // refresh KPI counts
        }

        if (msg.type === "REQUEST_CREATED") {
          setRequests(prev => [msg.data, ...prev]);
          fetchStats();
        }

        if (msg.type === "REQUEST_DELETED") {
          setRequests(prev => prev.filter(r => r.id !== msg.requestId));
          fetchStats();
        }
      } catch { /* malformed message */ }
    };

    ws.onerror = () => console.warn("WebSocket unavailable — live updates off");

    return () => ws.close();
  }, [fetchStats]);

  // ── PATCH helpers ──────────────────────────────────────────────────────────
  async function handleStatusChange(id, newStatus) {
    await fetch(`${API_BASE}/${id}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: newStatus }),
    });
    // WebSocket broadcast will update the UI automatically
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
    <div className="sr-analytics">

      {/* Page header */}
      <div className="sr-page-header">
        <div>
          <p>Monitor, filter and manage all active waste pickup requests</p>
        </div>
        <div className="sr-live-badge">
          <span className="sr-live-dot" /> Live Updates
        </div>
      </div>

      {/* KPI cards */}
      <KPIGrid stats={stats} />

      {/* Filter bar */}
      <div className="sr-panel" style={{ marginBottom: 16, padding: "12px 16px" }}>
        <div className="sr-filter-bar">
          <input
            className="sr-search"
            placeholder="🔍  Search by customer, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="sr-select" value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="sr-select" value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
            {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="sr-select" value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
            {LOCATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <span className="sr-badge" style={{ marginLeft: "auto", whiteSpace: "nowrap" }}>
            {requests.length} requests
          </span>
        </div>
      </div>

      {/* Requests table */}
      <div className="sr-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div className="sr-panel-header" style={{ padding: "14px 16px 0" }}>
          <h3>Active Service Requests</h3>
          <span className="sr-badge">{requests.length} shown</span>
        </div>

        {/* Loading / error states */}
        {loading && (
          <p style={{ textAlign: "center", padding: 32, color: "#6f7b92" }}>
            Loading requests…
          </p>
        )}
        {error && (
          <p style={{ textAlign: "center", padding: 32, color: "#c9320f" }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="sr-table-wrap" style={{ border: "none", borderRadius: 0, marginTop: 12 }}>
            <table className="sr-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", color: "#6f7b92", padding: "28px 0" }}>
                      No requests match the selected filters.
                    </td>
                  </tr>
                )}
                {requests.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.requestId}</strong></td>
                    <td>{r.customer}</td>
                    <td>{r.location}</td>
                    <td>
                      <span
                        className="sr-type-badge"
                        style={{ background: typeColor(r.type) + "1a", color: typeColor(r.type) }}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${statusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      {r.assignedStaff
                        ? <span className="sr-staff-name">{r.assignedStaff}</span>
                        : <span className="sr-unassigned">Unassigned</span>}
                    </td>
                    <td style={{ color: "#6f7b92", fontSize: "0.82rem" }}>
                      {timeAgo(r.submittedAt)}
                    </td>
                    <td>
                      <button className="sr-view-btn" onClick={() => setSelected(r.id)}>
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
