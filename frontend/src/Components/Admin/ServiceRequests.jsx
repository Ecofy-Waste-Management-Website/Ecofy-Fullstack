import React, { useState, useEffect } from "react";
import "./ServiceRequests.css";

// ── Sample data ────────────────────────────────────────────────────────────────
const STAFF_LIST = [
  "Banuka J.", "Priyantha S.", "Amara K.", "Nimal R.",
  "Dilshan P.", "Sachini M.", "Roshan T.", "Chamara W.",
];

const INITIAL_REQUESTS = [
  {
    id: "#REQ108", customer: "Gunawardena T.", phone: "077-123-4567",
    location: "Kandy", address: "45 Peradeniya Rd, Kandy",
    type: "Household", status: "Pending",
    assignedStaff: null, submittedAt: new Date(Date.now() - 2 * 60000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 2 * 60000) },
    ],
    notes: "Large bin overflow near gate.",
  },
  {
    id: "#REQ107", customer: "Perera L.", phone: "071-987-6543",
    location: "Colombo 03", address: "12 Galle Rd, Colombo 03",
    type: "Industrial", status: "In-Progress",
    assignedStaff: "Banuka J.", submittedAt: new Date(Date.now() - 28 * 60000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 28 * 60000) },
      { event: "Assigned to Banuka J.", time: new Date(Date.now() - 25 * 60000) },
      { event: "Staff en route", time: new Date(Date.now() - 10 * 60000) },
    ],
    notes: "Industrial waste pickup — requires protective gear.",
  },
  {
    id: "#REQ106", customer: "Bandara Y.", phone: "076-456-7890",
    location: "Nugegoda", address: "88 High Level Rd, Nugegoda",
    type: "Household", status: "Pending",
    assignedStaff: null, submittedAt: new Date(Date.now() - 45 * 60000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 45 * 60000) },
    ],
    notes: "",
  },
  {
    id: "#REQ105", customer: "Pathirana P.", phone: "070-321-0987",
    location: "Colombo 07", address: "5 Ward Place, Colombo 07",
    type: "Recyclable", status: "Completed",
    assignedStaff: "Priyantha S.", submittedAt: new Date(Date.now() - 3 * 3600000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 3 * 3600000) },
      { event: "Assigned to Priyantha S.", time: new Date(Date.now() - 2.8 * 3600000) },
      { event: "Staff en route", time: new Date(Date.now() - 2.5 * 3600000) },
      { event: "Pickup completed", time: new Date(Date.now() - 2 * 3600000) },
    ],
    notes: "Paper and plastics only.",
  },
  {
    id: "#REQ104", customer: "Mohamed A.", phone: "075-654-3210",
    location: "Dehiwala", address: "22 Galle Rd, Dehiwala",
    type: "Hazardous", status: "Escalated",
    assignedStaff: "Amara K.", submittedAt: new Date(Date.now() - 5 * 3600000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 5 * 3600000) },
      { event: "Assigned to Amara K.", time: new Date(Date.now() - 4.8 * 3600000) },
      { event: "Escalated — chemical waste detected", time: new Date(Date.now() - 4 * 3600000) },
    ],
    notes: "⚠ Chemical waste. Requires special disposal.",
  },
  {
    id: "#REQ103", customer: "Silva R.", phone: "072-111-2222",
    location: "Rajagiriya", address: "3 Parliament Rd, Rajagiriya",
    type: "Bulky", status: "Completed",
    assignedStaff: "Nimal R.", submittedAt: new Date(Date.now() - 8 * 3600000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 8 * 3600000) },
      { event: "Assigned to Nimal R.", time: new Date(Date.now() - 7.8 * 3600000) },
      { event: "Pickup completed", time: new Date(Date.now() - 7 * 3600000) },
    ],
    notes: "Old sofa and mattress.",
  },
  {
    id: "#REQ102", customer: "Fernando C.", phone: "078-333-4444",
    location: "Moratuwa", address: "60 Station Rd, Moratuwa",
    type: "Household", status: "In-Progress",
    assignedStaff: "Dilshan P.", submittedAt: new Date(Date.now() - 90 * 60000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 90 * 60000) },
      { event: "Assigned to Dilshan P.", time: new Date(Date.now() - 80 * 60000) },
      { event: "Staff en route", time: new Date(Date.now() - 60 * 60000) },
    ],
    notes: "",
  },
  {
    id: "#REQ101", customer: "Wickrama S.", phone: "077-555-6666",
    location: "Colombo 05", address: "18 Havelock Rd, Colombo 05",
    type: "Recyclable", status: "Pending",
    assignedStaff: null, submittedAt: new Date(Date.now() - 20 * 60000),
    timeline: [
      { event: "Request submitted", time: new Date(Date.now() - 20 * 60000) },
    ],
    notes: "Glass bottles and cardboard.",
  },
];

const STATUS_OPTIONS   = ["All", "Pending", "In-Progress", "Completed", "Escalated"];
const TYPE_OPTIONS     = ["All", "Household", "Industrial", "Recyclable", "Hazardous", "Bulky"];
const LOCATION_OPTIONS = ["All", "Colombo 03", "Colombo 05", "Colombo 07",
  "Kandy", "Nugegoda", "Dehiwala", "Rajagiriya", "Moratuwa"];

// ── Helpers ────────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function statusClass(s) {
  return { Pending: "pending", "In-Progress": "inprogress", Completed: "completed", Escalated: "escalated" }[s] || "";
}

function typeColor(t) {
  return {
    Household: "#0b6ca8", Industrial: "#5b35b5",
    Recyclable: "#1a7c4b", Hazardous: "#c9320f", Bulky: "#856800",
  }[t] || "#444";
}

// ── KPI Cards ──────────────────────────────────────────────────────────────────
function KPIGrid({ requests }) {
  const total      = requests.length;
  const pending    = requests.filter(r => r.status === "Pending").length;
  const inProgress = requests.filter(r => r.status === "In-Progress").length;
  const completed  = requests.filter(r => r.status === "Completed").length;
  const escalated  = requests.filter(r => r.status === "Escalated").length;

  const cards = [
    { label: "Total Requests", value: total,      color: "blue",   icon: "📋", sub: "All service requests" },
    { label: "Pending",        value: pending,    color: "amber",  icon: "⏳", sub: "Awaiting assignment" },
    { label: "In Progress",    value: inProgress, color: "purple", icon: "🚛", sub: "Currently active" },
    { label: "Completed",      value: completed,  color: "green",  icon: "✅", sub: "Successfully closed" },
    { label: "Escalated",      value: escalated,  color: "red",    icon: "🚨", sub: "Requires attention" },
  ];

  return (
    <section className="sr-kpi-grid">
      {cards.map(c => (
        <article key={c.label} className="sr-kpi-card">
          <div className="sr-kpi-icon">{c.icon}</div>
          <p className="sr-kpi-label">{c.label}</p>
          <p className={`sr-kpi-value ${c.color}`}>{c.value}</p>
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
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  function handleSave() {
    if (selStaff  !== req.assignedStaff) onAssign(req.id, selStaff || null);
    if (selStatus !== req.status)        onStatusChange(req.id, selStatus);
    onClose();
  }

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div className="sr-modal" onClick={e => e.stopPropagation()}>

        <div className="sr-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="sr-modal-id">{req.id}</span>
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
              <p><strong>Phone:</strong> {req.phone}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Address:</strong> {req.address}</p>
            </div>

            <div className="sr-modal-section">
              <h4>Request Info</h4>
              <p>
                <strong>Type:</strong>
                <span className="sr-type-badge" style={{
                  background: typeColor(req.type) + "1a",
                  color: typeColor(req.type),
                  marginLeft: 6,
                }}>
                  {req.type}
                </span>
              </p>
              <p><strong>Submitted:</strong> {req.submittedAt.toLocaleString()}</p>
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

              <button className="sr-save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>

          {/* Right column: Timeline */}
          <div className="sr-modal-right">
            <h4 className="sr-timeline-title">Status Timeline</h4>
            <div className="sr-timeline">
              {req.timeline.map((ev, i) => {
                const isLast = i === req.timeline.length - 1;
                return (
                  <div key={i} className="sr-tl-item">
                    <div className={`sr-tl-dot${isLast ? " latest" : ""}`} />
                    {!isLast && <div className="sr-tl-line" />}
                    <div>
                      <p className="sr-tl-event">{ev.event}</p>
                      <p className="sr-tl-time">
                        {timeAgo(ev.time)} · {ev.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search,   setSearch]   = useState("");
  const [filters,  setFilters]  = useState({ status: "All", type: "All", location: "All" });
  const [selected, setSelected] = useState(null);
  const [, setTick] = useState(0);

  // Refresh relative timestamps every 30s
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // Simulate real-time: assigned Pending → In-Progress every 45s
  useEffect(() => {
    const t = setInterval(() => {
      setRequests(prev => {
        const idx = prev.findIndex(r => r.status === "Pending" && r.assignedStaff);
        if (idx === -1) return prev;
        const updated = [...prev];
        const r = { ...updated[idx] };
        r.status   = "In-Progress";
        r.timeline = [...r.timeline, { event: "Staff en route", time: new Date() }];
        updated[idx] = r;
        return updated;
      });
    }, 45000);
    return () => clearInterval(t);
  }, []);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch   = !q
      || r.id.toLowerCase().includes(q)
      || r.customer.toLowerCase().includes(q)
      || r.location.toLowerCase().includes(q);
    const matchStatus   = filters.status   === "All" || r.status   === filters.status;
    const matchType     = filters.type     === "All" || r.type     === filters.type;
    const matchLocation = filters.location === "All" || r.location === filters.location;
    return matchSearch && matchStatus && matchType && matchLocation;
  });

  function handleStatusChange(id, newStatus) {
    setRequests(prev => prev.map(r => r.id !== id ? r : {
      ...r,
      status:   newStatus,
      timeline: [...r.timeline, { event: `Status changed to ${newStatus}`, time: new Date() }],
    }));
  }

  function handleAssign(id, staff) {
    setRequests(prev => prev.map(r => r.id !== id ? r : {
      ...r,
      assignedStaff: staff,
      timeline: [...r.timeline, {
        event: staff ? `Assigned to ${staff}` : "Staff unassigned",
        time: new Date(),
      }],
    }));
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

      {/* KPI cards — same pattern as SLA KPI grid */}
      <KPIGrid requests={requests} />

      {/* Filter bar inside a panel — consistent with SLA panels */}
      <div className="sr-panel" style={{ marginBottom: 16, padding: "12px 16px" }}>
        <div className="sr-filter-bar">
          <input
            className="sr-search"
            placeholder="🔍  Search by ID, customer, location…"
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
            {filtered.length} of {requests.length} requests
          </span>
        </div>
      </div>

      {/* Requests table — same panel + table pattern as SLA location table */}
      <div className="sr-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div className="sr-panel-header" style={{ padding: "14px 16px 0" }}>
          <h3>Active Service Requests</h3>
          <span className="sr-badge">{filtered.length} shown</span>
        </div>
        <div className="sr-table-wrap" style={{ border: "none", borderRadius: 0, marginTop: 12 }}>
          <table className="sr-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "#6f7b92", padding: "28px 0" }}>
                    No requests match the selected filters.
                  </td>
                </tr>
              )}
              {filtered.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
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
                  <td style={{ color: "#6f7b92", fontSize: "0.82rem" }}>{timeAgo(r.submittedAt)}</td>
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