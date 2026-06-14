import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search, Plus, Edit2, Trash2, Check, AlertCircle, ChevronDown, ChevronRight, DollarSign, Clock, Users, Zap, ShoppingCart, LogOut } from 'lucide-react';
import ServiceRequests from "./ServiceRequests";
import ContentBlogManagement from "./contentBlogManagement";
import StaffAccountCreation from "./StaffAccountCreation";
import InquiryManagement from "./InquiryManagement";
import ChatbotManagement from "./ChatbotManagement";
import NotificationBell from "../Main/Top-Header-Section/NotificationBell/NotificationBell";
import ServiceManagement from "./ServiceManagement";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatHistoryDate = (value) => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatHistoryTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};


const getStatusTone = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (["completed", "paid", "active", "activate"].includes(normalized)) {
    return "active";
  }

  if (["pending", "in progress", "processing"].includes(normalized)) {
    return "pending";
  }

  if (["cancelled", "failed", "suspended", "banned"].includes(normalized)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

// ─── ICONS ──────────────────────────────────────────────────────────────────

const Icons = {
  Revenue: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pending: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Staff: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Timer: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Orders: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6.4A1 1 0 007 21h10a1 1 0 001-.9L19 13M7 13H5" />
    </svg>
  ),
  Completed: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" />
    </svg>
  ),
  Cancelled: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Bell: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Search: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  More: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
  Service: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Plus: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Close: () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

// ─── DATA & CONFIGURATION ──────────────────────────────────────────────────

const statCards = [
  { key: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
  { key: "completedOrders", label: "Completed Orders", icon: <Check size={20} /> },
  { key: "cancelledDelayed", label: "Cancelled / Delayed", icon: <AlertCircle size={20} /> },
  { key: "pending", label: "Pending", icon: <Clock size={20} /> },
  { key: "activeStaff", label: "Active Staff", icon: <Users size={20} /> },
];

const WASTE_COLORS = ['#ef4444', '#fbbf24', '#9ca3af', '#2563eb'];

const menuItems = [
  { label: "Dashboard", key: "DASHBOARD", hasSubmenu: false },
  { label: "Staff Account Creation", key: "STAFF_CREATE", hasSubmenu: false },
  {
    label: "Admin Management",
    key: "ADMIN_MODULE",
    hasSubmenu: true,
    subItems: [
      { label: "User Management", key: "USER_MGMT", path: "/admins" },
      { label: "Monitor Requests", key: "SERVICE_REQ", path: "/" },
      { label: "Service Management", key: "SERVICE_MGMT", path: "/" },
    ],
  },
  { label: "Content/Blog", key: "CONTENT_BLOG", hasSubmenu: false },
  { label: "Inquiry", key: "INQUIRY", hasSubmenu: false },
  { label: "Chatbot Management", key: "CHATBOT_MGMT", hasSubmenu: false },
];

// ─── USER MANAGEMENT COMPONENT ────────────────────────────────────────────

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError(null);

        const response = await fetch(`${API_BASE_URL}/users/admin/all`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        const userList = Array.isArray(data.users) ? data.users : [];
        setUsers(userList);

        if (userList.length > 0 && !selectedUser) {
          setSelectedUser(userList[0]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setUsersError(error.message);
          setUsers([]);
        }
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedUser?.clerkId) {
      setHistoryData(null);
      return;
    }

    const controller = new AbortController();

    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        setHistoryError(null);

        const response = await fetch(`${API_BASE_URL}/users/admin/${selectedUser.clerkId}/history`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user history");
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setHistoryError(error.message);
          setHistoryData(null);
        }
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();

    return () => controller.abort();
  }, [selectedUser]);

  const filteredUsers = users.filter((user) => {
    const haystack = [user.firstName, user.lastName, user.email, user.role, user.status, user.clerkId]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const historyItems = historyData?.timeline || [];
  const metrics = historyData?.totals || { payments: 0, services: 0, bookings: 0, items: 0 };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-black text-[#244c21]">User Management</h3>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#397239]/50">Browse every user and inspect their order timeline.</p>
        </div>
        <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#397239]">
          {users.length} users loaded
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#397234]/15 bg-white/80 px-4 py-3">
            <span className="text-[#397239]/40"><Icons.Search /></span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users by name, email, or role"
              className="w-full bg-transparent text-sm text-[#244c21] outline-none placeholder:text-[#397239]/40"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {loadingUsers ? (
              <div className="flex h-full items-center justify-center text-sm text-[#397239]/50">Loading users...</div>
            ) : usersError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{usersError}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#397234]/20 bg-white/60 p-6 text-center text-sm text-[#397239]/50">
                No users matched your search.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUser?.clerkId === user.clerkId;
                  const initials = `${user.firstName || ""} ${user.lastName || ""}`
                    .trim()
                    .split(" ")
                    .map((name) => name[0] || "")
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U";

                  return (
                    <button
                      key={user.clerkId || user.email}
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-[#397239]/30 bg-[#D6E9CA]/50 shadow-sm"
                          : "border-[#397234]/15 bg-white/70 hover:border-[#397234]/30 hover:bg-white"
                      }`}
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#397239] text-sm font-black text-white shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-black text-[#244c21]">
                            {user.firstName} {user.lastName || ""}
                          </p>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusTone(user.status)}`}>
                            {user.status || "Unknown"}
                          </span>
                        </div>
                        <p className="truncate text-xs text-[#397239]/50">{user.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          <span className="rounded-full bg-[#D6E9CA]/60 text-[#397239] px-2 py-1">{user.role || "Customer"}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-0 flex-col rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/20 p-5 shadow-sm">
          {!selectedUser ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#397234]/20 bg-white/60 p-8 text-center text-sm text-[#397239]/50">
              Select a user to view their order history.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 border-b border-[#397234]/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/50">Selected User</p>
                  <h3 className="mt-2 text-2xl font-black text-[#244c21]">
                    {selectedUser.firstName} {selectedUser.lastName || ""}
                  </h3>
                  <p className="mt-1 text-sm text-[#397239]/50">{selectedUser.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-[#397239]">Role: {selectedUser.role || "Customer"}</span>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusTone(selectedUser.status)}`}>{selectedUser.status || "Unknown"}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  { label: "Payments", value: metrics.payments },
                  { label: "Service Records", value: metrics.services },
                  { label: "Bookings", value: metrics.bookings },
                  { label: "Timeline Items", value: metrics.items },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-[#397234]/10 bg-white/60 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#397239]/40">{card.label}</p>
                    <p className="mt-2 text-2xl font-black text-[#244c21]">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-3xl border border-[#397234]/10 bg-white/60">
                <div className="border-b border-[#397234]/10 px-5 py-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#397239]/50">Order History</h4>
                </div>

                <div className="max-h-[calc(100vh-360px)] overflow-y-auto p-4">
                  {historyLoading ? (
                    <div className="py-10 text-center text-sm text-[#397239]/50">Loading order history...</div>
                  ) : historyError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{historyError}</div>
                  ) : historyItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#397234]/20 bg-white/70 p-8 text-center text-sm text-[#397239]/50">
                      No order history found for this user.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {historyItems.map((item) => (
                        <article key={`${item.type}-${item.id}`} className="rounded-2xl border border-[#397234]/10 bg-white/80 p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#D6E9CA]/60 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#397239]">
                                  {item.type}
                                </span>
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusTone(item.status)}`}>
                                  {item.status || "Unknown"}
                                </span>
                              </div>
                              <h5 className="mt-3 text-sm font-black text-[#244c21]">{item.title}</h5>
                              <p className="mt-1 text-xs text-[#397239]/50">{item.subtitle || "No additional details"}</p>
                            </div>

                            <div className="text-right text-xs text-[#397239]/50">
                              <p className="font-black text-[#244c21]">{formatHistoryDate(item.date)}</p>
                              <p>{formatHistoryTime(item.date)}</p>
                              {item.amount !== null && item.amount !== undefined && item.amount !== "" && (
                                <p className="mt-2 font-black text-[#244c21]">
                                  {typeof item.amount === "number" ? `LKR ${item.amount.toLocaleString()}` : item.amount}
                                </p>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

// ─── DASHBOARD HOME COMPONENT ──────────────────────────────────────────────
function DashboardHome() {
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState(null);
  const [wasteData, setWasteData] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    orders: 0,
    completedOrders: 0,
    cancelledDelayed: 0,
    pending: 0,
    activeStaff: 0,
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadSales = async () => {
      try {
        setSalesLoading(true);
        setSalesError(null);

        const fetchJson = async (url) => {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) return null;
          return response.json();
        };

        const [salesPayload, slaPayload, staffPayload] = await Promise.all([
          fetchJson(`${API_BASE_URL}/analytics/sales-by-date?days=5`),
          fetchJson(`${API_BASE_URL}/sla-analytics`),
          fetchJson(`${API_BASE_URL}/admin/staff`),
        ]);

        const overview = slaPayload?.overview || {};
        const staffList = Array.isArray(staffPayload?.staff) ? staffPayload.staff : [];

        setDashboardMetrics({
          orders: Number(overview.total || 0),
          completedOrders: Number(overview.completed || 0),
          cancelledDelayed: Number(overview.delayed || 0),
          pending: Number(overview.pending || 0),
          activeStaff: staffList.filter((staff) => staff.displayStatus === "Active" || staff.status === "Activate").length,
        });

        if (salesPayload?.data && Array.isArray(salesPayload.data)) {
          setSalesData(salesPayload.data);
        } else {
          const fallbackData = Array.isArray(slaPayload?.dailyCompletion)
            ? slaPayload.dailyCompletion.map((entry) => ({
                date: entry.date,
                sales: entry.total ?? entry.completed ?? 0,
              }))
            : [];

          setSalesData(fallbackData);
        }

        const chartWasteData = Array.isArray(slaPayload?.wasteCategories)
          ? slaPayload.wasteCategories.map((item) => ({
              name: item.name,
              value: item.value,
            }))
          : [];

        setWasteData(chartWasteData);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSalesError("Sales chart unavailable right now.");
          setSalesData([]);
          setWasteData([]);
          console.error("Sales analytics fetch error:", error);
        }
      } finally {
        setSalesLoading(false);
      }
    };

    loadSales();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <article
            key={stat.key}
            className="flex items-start gap-4 rounded-3xl bg-[#D6E9CA]/50 backdrop-blur-xl border border-[#397234]/20 p-6 shadow-sm transition-all duration-200 hover:bg-[#D6E9CA]/70 hover:shadow-md"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#397239]/10 text-[#397239] border border-[#397234]/10">
              {stat.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-xs font-black text-[#397239]/50 uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="m-0 text-3xl font-black text-[#244c21]">{dashboardMetrics[stat.key] ?? 0}</h3>
            </div>
          </article>
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 gap-6 flex-1 min-h-0 lg:grid-cols-2">
        {/* Left: Waste Types Pie Chart */}
        <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-6 shadow-sm min-h-[420px]">
          <h3 className="text-lg font-black mb-4 text-[#244c21]">Waste Types</h3>
          <div className="w-full h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wasteData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WASTE_COLORS[index % WASTE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Average Daily Sales */}
        <div className="rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/35 p-6 shadow-sm min-h-[420px]">
          <h3 className="text-lg font-black mb-4 text-[#244c21]">Average Daily Sales</h3>
          {salesLoading ? (
            <div className="flex h-[330px] items-center justify-center text-sm text-[#397239]/50">Loading sales data...</div>
          ) : salesError ? (
            <div className="flex h-[330px] items-center justify-center text-sm text-red-500">{salesError}</div>
          ) : (
            <div className="w-full h-[330px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Sales']} />
                  <Bar dataKey="sales" fill="#397239" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── MAIN ADMIN DASHBOARD COMPONENT ─────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("DASHBOARD");
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ ADMIN_MODULE: true });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const adminName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Admin";
  const adminInitials = adminName.split(" ").map(n => n[0] || "").join("").toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!user) return;
    const fetchRole = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch admin role:", error);
      } finally {
        setRoleLoading(false);
      }
    };
    fetchRole();
  }, [user]);

  const handleSwitchDashboard = () => navigate("/staff-dashboard");
  const handleSelectTab = (key) => {
    setActiveTab(key);
    setIsMobileMenuOpen(false);
  };
  const handleToggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleSubmenu = (key) => setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));

  const COMPONENT_MAP = {
    DASHBOARD: <DashboardHome />,
    USER_MGMT: <UserManagement />,
    STAFF_CREATE: <StaffAccountCreation />,
    SERVICE_REQ: <ServiceRequests />,
    CONTENT_BLOG: <ContentBlogManagement />,
    INQUIRY: <InquiryManagement />,
    CHATBOT_MGMT: <ChatbotManagement />,
    SERVICE_MGMT: <ServiceManagement />,
  };

  const renderMainContent = () => COMPONENT_MAP[activeTab] || <div className="p-6 text-[#397239]/50">Not found.</div>;

  const getPageTitle = () => {
    for (const item of menuItems) {
      if (item.key === activeTab) return item.label;
      if (item.subItems) {
        const sub = item.subItems.find(s => s.key === activeTab);
        if (sub) return sub.label;
      }
    }
    return "Ecofy Admin";
  };

  return (
    <div className="h-screen w-screen font-sans text-[#244c21] bg-white p-4 lg:p-3 overflow-hidden">
      <div className="flex h-full w-full gap-3">

        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex flex-col gap-4 bg-[#397234]/80 backdrop-blur-3xl border border-[#397234]/20 p-5 text-white/80 w-[240px] shrink-0 rounded-3xl shadow-2xl overflow-hidden h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-black tracking-tighter text-white">Ecofy</h1>
          </div>

          <nav className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <div key={item.key} className="flex flex-col">
                <button
                  type="button"
                  className={`flex justify-between items-center text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.key && !item.hasSubmenu
                      ? "bg-[#397239] text-white shadow-lg shadow-black/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    if (item.hasSubmenu) {
                      toggleSubmenu(item.key);
                      const firstSub = item.subItems && item.subItems[0];
                      if (firstSub && !item.subItems.some(s => s.key === activeTab)) {
                        handleSelectTab(firstSub.key);
                      }
                    } else {
                      handleSelectTab(item.key);
                    }
                  }}
                >
                  <span className="truncate">{item.label}</span>
                  {item.hasSubmenu && (
                    <span className="text-white/40">
                      {openMenus[item.key] ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                    </span>
                  )}
                </button>

                {item.hasSubmenu && openMenus[item.key] && (
                  <div className="mt-1 flex flex-col gap-1 pl-3 pr-2">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.key}
                        type="button"
                        className={`text-left text-xs px-4 py-2 rounded-lg transition-colors font-bold ${
                          activeTab === sub.key
                            ? "bg-[#397239]/80 text-white"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={(event) => {
                          event.preventDefault();
                          handleSelectTab(sub.key);
                        }}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-white border border-white/10 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#397239] text-xs font-bold text-white shadow-inner">{adminInitials}</div>
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-black uppercase tracking-wider text-white/60">Admin Portal</p>
              <p className="m-0 text-xs font-bold truncate">{adminName}</p>
              <button
                type="button"
                className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.65rem] font-bold text-white/40 hover:text-white hover:underline transition-all"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header - Desktop */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-1 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-black tracking-tight text-[#244c21] truncate">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-3">
              <NotificationBell target="admin" />
              <div className="rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 px-3 py-1.5 text-xs font-black text-[#397239] backdrop-blur-sm">Admin</div>
              {!roleLoading && role === "Admin" && (
                <button
                  type="button"
                  onClick={handleSwitchDashboard}
                  className="rounded-xl bg-[#397239] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#244c21] shadow-md"
                >
                  Switch to Staff
                </button>
              )}
            </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
              {renderMainContent()}
              <footer className="mt-8 text-xs text-[#397239]/40 pb-4 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>

      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-[#112A0F] px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold leading-tight">{getPageTitle()}</h2>
          </div>
          <button
            type="button"
            onClick={handleToggleMobileMenu}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white"
          >
            <Icons.Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-green-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-[300px] flex-col gap-4 overflow-y-auto bg-[#397234]/90 backdrop-blur-3xl p-5 text-white shadow-2xl border border-white/10 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-2">
              <h1 className="m-0 text-lg font-black">Ecofy</h1>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 text-xs font-bold">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) =>
                item.hasSubmenu ? (
                  item.subItems.map((sub) => (
                    <button
                      type="button"
                      key={sub.key}
                      onClick={(event) => { event.preventDefault(); handleSelectTab(sub.key); }}
                      className={`text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                        activeTab === sub.key
                          ? "bg-[#397239] text-white shadow-lg"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    key={item.key}
                    onClick={(event) => { event.preventDefault(); handleSelectTab(item.key); }}
                    className={`text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.key
                        ? "bg-[#397239] text-white shadow-lg"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
            </nav>
            <button
              type="button"
              onClick={handleSwitchDashboard}
              className="mt-auto w-full rounded-xl bg-white py-2.5 text-xs font-bold text-green-900"
            >
              Switch to Staff
            </button>
          </aside>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[360px] rounded-[2rem] border border-white/20 bg-[#397234] p-8 text-center shadow-2xl backdrop-blur-[50px] animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-400/10 text-red-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-extrabold text-white">Sign Out?</h3>
            <p className="mb-8 text-xs font-bold text-white/40 uppercase tracking-widest">Are you sure you want to exit the portal?</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-extrabold text-white uppercase tracking-widest transition-all hover:bg-white/10"
              >
                Stay Here
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 rounded-2xl bg-red-500 py-4 text-[10px] font-extrabold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}