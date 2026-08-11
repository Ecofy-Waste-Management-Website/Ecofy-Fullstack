import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { FileText, Clock, Zap, CheckCircle, AlertTriangle, Search, X } from "lucide-react";
import { Button, Badge } from "./UIComponents";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = `${API_ORIGIN}/service-monitoring`;
const WS_URL = API_ORIGIN.replace(/^http/, "ws");

const STATUS_OPTIONS = ["All", "Pending", "Assigned", "In Progress", "Completed", "Delayed"];
const TYPE_OPTIONS = ["All", "Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"];
const LOCATION_OPTIONS = ["All", "Colombo 03", "Colombo 05", "Colombo 07", "Kandy", "Nugegoda", "Dehiwala", "Rajagiriya", "Moratuwa"];

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function typeColor(type) {
  return {
    Household: "#0b6ca8",
    Commercial: "#5b35b5",
    Bulk: "#856800",
    Garden: "#1a7c4b",
    "Drain Cleaning": "#c9320f",
  }[type] || "#444";
}

function resolveStaffDisplayName(staff) {
  const name = [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim() || staff.firstName || staff.username || staff.email;
  if (name && !name.startsWith("user_")) return name;
  return "Staff Member";
}

function formatAssignedStaff(value, lookup) {
  if (!value) return null;
  const resolved = lookup.get(value);
  if (resolved && typeof resolved === "string" && !resolved.startsWith("user_")) {
    return resolved;
  }
  if (typeof value === "string" && value.startsWith("user_")) {
    return "Staff Member";
  }
  return value || "Staff Member";
}

function getAssignedStaffSelectValue(request, staffOptions, staffLookup) {
  const directValue = request.assignedStaffValue || request.assignedStaff || "";
  if (staffOptions.some((staff) => staff.value === directValue)) {
    return directValue;
  }

  const resolvedLabel = request.assignedStaffLabel || formatAssignedStaff(request.assignedStaff, staffLookup);
  const match = staffOptions.find((staff) => staff.label === resolvedLabel || staff.value === request.assignedStaff);
  return match?.value || "";
}

function KPIGrid({ stats }) {
  const cards = [
    { label: "Total Requests", value: stats.total, colorText: "text-blue-600", icon: <FileText size={20} />, sub: "All requests" },
    { label: "Pending", value: stats.pending, colorText: "text-amber-600", icon: <Clock size={20} />, sub: "Awaiting" },
    { label: "In Progress", value: stats.inProgress, colorText: "text-purple-600", icon: <Zap size={20} />, sub: "Active" },
    { label: "Completed", value: stats.completed, colorText: "text-[#06a63e]", icon: <CheckCircle size={20} />, sub: "Closed" },
    { label: "Delayed", value: stats.delayed, colorText: "text-red-600", icon: <AlertTriangle size={20} />, sub: "Critical" },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <article key={card.label} className="rounded-3xl border border-[#06a63e]/15 bg-white p-5 shadow-sm">
          <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 ${card.colorText}`}>{card.icon}</div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{card.label}</p>
          <p className={`mt-1 text-2xl font-black ${card.colorText}`}>{card.value ?? "-"}</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">{card.sub}</p>
        </article>
      ))}
    </section>
  );
}

function RequestModal({ request, staffOptions, staffLookup, onClose, onStatusChange, onAssign }) {
  const [selectedStaff, setSelectedStaff] = useState(getAssignedStaffSelectValue(request, staffOptions, staffLookup));
  const [selectedStatus, setSelectedStatus] = useState(request.status || "Pending");
  const [saving, setSaving] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      if (selectedStaff !== (request.assignedStaff || "")) {
        await onAssign(request.id, selectedStaff || null);
      }
      if (selectedStatus !== request.status) {
        await onStatusChange(request.id, selectedStatus);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-tight text-gray-900">{request.requestId}</span>
            <Badge variant="primary">{request.status}</Badge>
          </div>
          <button className="text-gray-400 hover:text-gray-700" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <h4 className="mb-3 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Customer Details</h4>
              <div className="space-y-2 text-sm text-gray-800">
                <p><strong className="font-bold text-gray-900">Name:</strong> {request.customer}</p>
                <p><strong className="font-bold text-gray-900">Email:</strong> {request.email}</p>
                <p><strong className="font-bold text-gray-900">Location:</strong> {request.location}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <h4 className="mb-3 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Request Info</h4>
              <div className="space-y-3 text-sm text-gray-800">
                <p className="flex items-center">
                  <strong className="mr-2 font-bold text-gray-900">Service Type:</strong>
                  <span className="rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest" style={{ background: `${typeColor(request.type)}20`, color: typeColor(request.type), border: `1px solid ${typeColor(request.type)}30` }}>
                    {request.type}
                  </span>
                </p>
                <p><strong className="font-bold text-gray-900">Waste Category:</strong> {request.wasteCategory}</p>
                <p><strong className="font-bold text-gray-900">Scheduled:</strong> {new Date(request.scheduledDate).toLocaleDateString()}</p>
                <p><strong className="font-bold text-gray-900">Submitted:</strong> {new Date(request.submittedAt).toLocaleString()}</p>
                {request.notes && <p><strong className="font-bold text-gray-900">Notes:</strong> {request.notes}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-900">Update Management</h4>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">Assign Staff</label>
                  <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20" value={selectedStaff} onChange={(e) => setSelectedStaff(e.target.value)}>
                    <option value="" className="bg-white">- Unassigned -</option>
                    {staffOptions.length === 0 ? (
                      <option value="" className="bg-white">No staff accounts available</option>
                    ) : (
                      staffOptions.map((staff) => (
                        <option key={staff.value} value={staff.value} className="bg-white">
                          {staff.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
                  <select className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    {STATUS_OPTIONS.slice(1).map((status) => (
                      <option key={status} value={status} className="bg-white">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <Button variant="primary" fullWidth onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Confirm Changes"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
            <h4 className="mb-6 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Status Timeline</h4>
            <div className="relative ml-2 flex-1 border-l border-gray-200 pl-6">
              {(request.timeline || []).length === 0 ? (
                <p className="text-sm italic text-gray-400">No timeline events yet.</p>
              ) : (
                (request.timeline || []).map((event, index) => {
                  const isLast = index === request.timeline.length - 1;
                  return (
                    <div key={index} className="relative mb-8">
                      <div className={`absolute -left-7 top-1.5 h-4 w-4 rounded-full border-2 border-white ${isLast ? "bg-[#06a63e] shadow-[0_0_12px_rgba(6,166,62,0.4)]" : "bg-gray-300"}`} />
                      <p className="text-sm font-bold text-gray-900">{event.event}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {timeAgo(event.time)} - {new Date(event.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceRequests() {
  const { getToken } = useAuth();
  const [requests, setRequests] = useState([]);
  const [staffRoster, setStaffRoster] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, delayed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "All", type: "All", location: "All" });
  const [typeOptions, setTypeOptions] = useState(TYPE_OPTIONS);
  const [selected, setSelected] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    fetch(`${API_ORIGIN}/services`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const names = json.data.map((s) => s.name?.trim()).filter(Boolean);
          const combined = Array.from(new Set(["All", ...names, ...TYPE_OPTIONS.slice(1)]));
          setTypeOptions(combined);
        }
      })
      .catch((err) => console.error("Error loading services filter options:", err));
  }, []);

  // Refresh relative timestamps every 30s
  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchStaffRoster = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_ORIGIN}/admin/staff`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Failed to fetch staff roster");
        }

        const data = await response.json();
        if (mounted) {
          setStaffRoster(Array.isArray(data.staff) ? data.staff : []);
        }
      } catch {
        if (mounted) {
          setStaffRoster([]);
        }
      }
    };

    fetchStaffRoster();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  const staffLookup = useMemo(() => {
    const lookup = new Map();

    for (const staff of staffRoster) {
      const displayName = resolveStaffDisplayName(staff);
      [staff.clerkId, staff._id, staff.email, staff.username, displayName]
        .filter(Boolean)
        .forEach((key) => {
          if (!lookup.has(key)) {
            lookup.set(key, displayName);
          }
        });
    }

    for (const request of requests) {
      if (request.assignedStaff && !lookup.has(request.assignedStaff)) {
        lookup.set(request.assignedStaff, request.assignedStaff);
      }
    }

    return lookup;
  }, [requests, staffRoster]);

  const staffOptions = useMemo(() => {
    const options = new Map();

    for (const staff of staffRoster) {
      const value = staff.clerkId || staff._id || staff.email;
      if (!value || options.has(value)) continue;

      options.set(value, {
        value,
        label: resolveStaffDisplayName(staff),
      });
    }

    for (const request of requests) {
      const assignedStaff = request.assignedStaff;
      if (!assignedStaff || options.has(assignedStaff)) continue;

      options.set(assignedStaff, {
        value: assignedStaff,
        label: formatAssignedStaff(assignedStaff, staffLookup),
      });
    }

    return Array.from(options.values());
  }, [requests, staffLookup, staffRoster]);

  const fetchRequests = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== "All") params.set("status", filters.status);
      if (filters.type !== "All") params.set("type", filters.type);
      if (filters.location !== "All") params.set("location", filters.location);
      if (search) params.set("search", search);

      const response = await fetch(`${API_BASE}?${params}`);
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || `Server error (${response.status})`);
      }
      setRequests(Array.isArray(json.data) ? json.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError(err.message || "Failed to load requests. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const json = await response.json();
      if (json.success) setStats(json.data);
    } catch {
      /* stats are non-critical */
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [fetchRequests, fetchStats]);

  useEffect(() => {
    let isMounted = true;
    let ws = null;

    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        if (!isMounted && ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const message = JSON.parse(event.data);
          if (message.type === "REQUEST_UPDATED") {
            setRequests((previous) => previous.map((request) => (request.id === message.data.id ? message.data : request)));
            fetchStats();
          }
          if (message.type === "REQUEST_CREATED") {
            setRequests((previous) => [message.data, ...previous]);
            fetchStats();
          }
          if (message.type === "REQUEST_DELETED") {
            setRequests((previous) => previous.filter((request) => request.id !== message.requestId));
            fetchStats();
          }
        } catch {
          /* ignore malformed websocket messages */
        }
      };

      ws.onerror = () => {
        /* failover gracefully if socket is unavailable */
      };
    } catch {
      /* socket init error */
    }

    return () => {
      isMounted = false;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [fetchStats]);

  async function handleStatusChange(id, newStatus) {
    await fetch(`${API_BASE}/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function handleAssign(id, staff) {
    await fetch(`${API_BASE}/${id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedStaff: staff }),
    });
  }

  const selectedRequest = selected ? requests.find((request) => request.id === selected) : null;

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="m-0 text-sm text-gray-500">Monitor, filter and manage all active waste pickup requests</p>
        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold text-[#06a63e]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06a63e] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06a63e]" />
          </span>
          Live Updates Active
        </div>
      </div>

      <KPIGrid stats={stats} />

      <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-60 flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
              placeholder="Search customer, location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20" value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              {typeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20" value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <span className="ml-auto whitespace-nowrap rounded-full bg-[#06a63e]/10 px-3 py-1 text-xs font-bold text-[#06a63e]">
            {requests.length} results
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-6 py-4">
          <h3 className="m-0 text-lg font-black text-gray-900">Active Service Requests</h3>
        </div>

        {loading && <p className="p-12 text-center text-sm font-semibold text-gray-400 animate-pulse">Loading requests...</p>}
        {error && <p className="p-12 text-center font-bold text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-800">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Staff</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center font-semibold text-gray-400">No requests match your current filters.</td>
                  </tr>
                )}
                {requests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{request.requestId}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{request.customer}</td>
                    <td className="px-6 py-4 text-gray-600">{request.location}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest" style={{ background: `${typeColor(request.type)}20`, color: typeColor(request.type), border: `1px solid ${typeColor(request.type)}40` }}>
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary">{request.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {request.assignedStaff ? (
                        <span className="font-bold text-[#06a63e]">{request.assignedStaffLabel || formatAssignedStaff(request.assignedStaff, staffLookup)}</span>
                      ) : (
                        <span className="font-medium text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">
                          {new Date(request.submittedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(request.submittedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="primary" size="sm" onClick={() => setSelected(request.id)}>
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

      {selectedRequest && (
        <RequestModal
          request={selectedRequest}
          staffOptions={staffOptions}
          staffLookup={staffLookup}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
}
