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
import { theme } from "./theme";
import { Button, Badge } from "./UIComponents";


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
    return "error";
  }

  return "inactive";
};

// ─── DATA & CONFIGURATION ──────────────────────────────────────────────────

const statCards = [
  { key: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
  { key: "completedOrders", label: "Completed Orders", icon: <Check size={20} /> },
  { key: "cancelledDelayed", label: "Cancelled / Delayed", icon: <AlertCircle size={20} /> },
  { key: "pending", label: "Pending", icon: <Clock size={20} /> },
  { key: "activeStaff", label: "Active Staff", icon: <Users size={20} /> },
];

const WASTE_COLORS = [theme.colors.error, theme.colors.warning, theme.colors.neutral[400], theme.colors.info];



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
    ] 
  },
  { label: "Content/Blog", key: "CONTENT_BLOG", hasSubmenu: false },
  { label: "Inquiry", key: "INQUIRY", hasSubmenu: false },
  { label: "Chatbot Management", key: "CHATBOT_MGMT", hasSubmenu: false },
];



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
      <div className="flex flex-col gap-3 rounded-3xl border border-white/30 bg-white/30 p-5 shadow-sm backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-600 text-gray-900">User Management</h3>
          <p className="text-sm text-gray-500">Browse every user and inspect their order timeline.</p>
        </div>
        <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-600 text-gray-700">
          {users.length} users loaded
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col rounded-3xl border border-white/30 bg-white/30 p-4 shadow-sm backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users by name, email, or role"
              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {loadingUsers ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">Loading users...</div>
            ) : usersError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{usersError}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-500">
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
                          ? "border-green-200 bg-green-50 shadow-sm"
                          : "border-white/40 bg-white/70 hover:border-green-100 hover:bg-white"
                      }`}
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-sm font-600 text-white shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-600 text-gray-900">
                            {user.firstName} {user.lastName || ""}
                          </p>
                          <Badge variant={getStatusTone(user.status)}>
                            {user.status || "Unknown"}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                          <span className="rounded-full bg-gray-100 px-2 py-1">{user.role || "Customer"}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-0 flex-col rounded-3xl border border-white/30 bg-white/30 p-5 shadow-sm backdrop-blur-xl">
          {!selectedUser ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 p-8 text-center text-sm text-gray-500">
              Select a user to view their order history.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 border-b border-white/40 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-600 uppercase tracking-[0.2em] text-gray-500">Selected User</p>
                  <h3 className="mt-2 text-2xl font-600 text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName || ""}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-600 text-gray-700">Role: {selectedUser.role || "Customer"}</span>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-600 ${getStatusTone(selectedUser.status)}`}>{selectedUser.status || "Unknown"}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  { label: "Payments", value: metrics.payments },
                  { label: "Service Records", value: metrics.services },
                  { label: "Bookings", value: metrics.bookings },
                  { label: "Timeline Items", value: metrics.items },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm">
                    <p className="text-xs font-600 uppercase tracking-wider text-gray-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-600 text-gray-900">{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-3xl border border-white/40 bg-white/60">
                <div className="border-b border-gray-200 px-5 py-4">
                  <h4 className="text-sm font-600 uppercase tracking-[0.18em] text-gray-500">Order History</h4>
                </div>

                <div className="max-h-[calc(100vh-360px)] overflow-y-auto p-4">
                  {historyLoading ? (
                    <div className="py-10 text-center text-sm text-gray-500">Loading order history...</div>
                  ) : historyError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{historyError}</div>
                  ) : historyItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-8 text-center text-sm text-gray-500">
                      No order history found for this user.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {historyItems.map((item) => (
                        <article key={`${item.type}-${item.id}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="info">
                                  {item.type}
                                </Badge>
                                <Badge variant={getStatusTone(item.status)}>
                                  {item.status || "Unknown"}
                                </Badge>
                              </div>
                              <h5 className="mt-3 text-sm font-600 text-gray-900">{item.title}</h5>
                              <p className="mt-1 text-xs text-gray-500">{item.subtitle || "No additional details"}</p>
                            </div>

                            <div className="text-right text-xs text-gray-500">
                              <p className="font-600 text-gray-900">{formatHistoryDate(item.date)}</p>
                              <p>{formatHistoryTime(item.date)}</p>
                              {item.amount !== null && item.amount !== undefined && item.amount !== "" && (
                                <p className="mt-2 font-600 text-gray-900">
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
    {/* Stats Grid - Apple Style */}
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <article
          key={stat.key}
          className="flex items-start gap-4 rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 p-6 shadow-sm transition-all duration-200 hover:bg-white/40 hover:shadow-md"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 text-green-600 shadow-sm">
            {stat.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-xs font-600 text-gray-600 uppercase tracking-wider mb-2">{stat.label}</p>
            <h3 className="m-0 text-3xl font-600 text-gray-900">{dashboardMetrics[stat.key] ?? 0}</h3>
          </div>
        </article>
      ))}
    </section>

    {/* Main Content Grid */}
    <section className="grid grid-cols-1 gap-6 flex-1 min-h-0 lg:grid-cols-2">
      {/* Left: Waste Types Pie Chart */}
      <div className="rounded-3xl border border-white/30 bg-white/30 backdrop-blur-xl p-6 shadow-sm min-h-[420px]">
        <h3 className="text-lg font-600 mb-4 text-gray-700">Waste Types</h3>
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

      {/* Right: Placeholder for additional dashboard widgets */}
      <div className="rounded-3xl border border-white/30 bg-white/30 backdrop-blur-xl p-6 shadow-sm min-h-[420px]">
        <h3 className="text-lg font-600 mb-4 text-gray-700">Average Daily Sales</h3>
        {salesLoading ? (
          <div className="flex h-[330px] items-center justify-center text-sm text-gray-500">Loading sales data...</div>
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
              <Bar dataKey="sales" fill="#3b82f6" radius={[6,6,0,0]} />
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
    SERVICE_MGMT: <ServiceManagement />
  };

  const renderMainContent = () => COMPONENT_MAP[activeTab] || <div className="p-6 text-gray-500">Not found.</div>;

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
    <div className="h-screen w-screen font-sans text-gray-900 bg-gray-50 p-4 lg:p-3 overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="flex h-full w-full gap-3">

        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:flex flex-col gap-4 bg-white/20 backdrop-blur-2xl border border-white/20 p-5 text-gray-700 w-64 shrink-0 rounded-3xl shadow-lg overflow-hidden h-full">
          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-600 tracking-tight text-gray-900">Ecofy</h1>
          </div>

          <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <div key={item.key} className="flex flex-col">
                <button
                  type="button"
                  className={`flex justify-between items-center text-left text-sm font-500 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeTab === item.key && !item.hasSubmenu
                      ? "bg-green-500/10 text-green-700 border-l-3 border-green-500"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/30"
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
                    <span className="text-gray-400">
                      {openMenus[item.key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                </button>

                {item.hasSubmenu && openMenus[item.key] && (
                  <div className="mt-1 flex flex-col gap-1 pl-3 pr-2">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.key}
                        type="button"
                        className={`text-left text-xs px-4 py-2 rounded-lg transition-colors font-500 ${
                          activeTab === sub.key
                            ? "bg-green-500/10 text-green-600"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/30"
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

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/40 p-4 text-gray-900 border border-white/30 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-xs font-bold text-white shadow-md">{adminInitials}</div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-xs font-600 uppercase tracking-wider text-gray-600">Admin</p>
              <p className="m-0 text-sm font-500 truncate text-gray-900">{adminName}</p>
              <button type="button" className="mt-1 cursor-pointer border-none bg-transparent p-0 text-xs font-500 text-green-600 hover:text-green-700 transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header - Desktop */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-4 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-600 tracking-tight text-gray-900">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </span>
                <input type="text" className="w-full rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-sm shadow-sm p-[10px_16px_10px_44px] text-sm text-gray-900 outline-none transition-all focus:border-green-500 focus:ring-1 focus:ring-green-500/50 placeholder:text-gray-500" placeholder="Search..." />
              </div>
              <NotificationBell target="admin" />
              <div className="rounded-lg border border-gray-300 bg-white/60 px-3 py-2 text-xs font-600 text-gray-700 shadow-sm">Admin</div>
              {!roleLoading && role === "Admin" && (
                <Button variant="primary" size="sm" onClick={handleSwitchDashboard}>Switch to Staff</Button>
              )}
            </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
               {renderMainContent()}
               <footer className="mt-8 text-xs text-gray-500 pb-4 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>

      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-white/20 bg-white/80 backdrop-blur-xl px-4 py-3 text-gray-900 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><h2 className="truncate text-base font-600 leading-tight">{getPageTitle()}</h2></div>
          <button type="button" onClick={handleToggleMobileMenu} className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"><Menu size={20} /></button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-xs flex-col gap-4 overflow-y-auto bg-white/95 backdrop-blur-xl p-5 text-gray-900 shadow-2xl border border-white/50 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-3">
              <div className="flex items-center gap-3"><h1 className="m-0 text-lg font-600">Ecofy</h1></div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 text-xs font-600 hover:text-gray-700"><X size={20} /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                item.hasSubmenu ? (
                  item.subItems.map((sub) => (
                    <button type="button" key={sub.key} onClick={(event) => {
                      event.preventDefault();
                      handleSelectTab(sub.key);
                    }} className={`text-left text-sm font-500 px-4 py-3 rounded-lg transition-all ${activeTab === sub.key ? "bg-green-500/10 text-green-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>{sub.label}</button>
                  ))
                ) : (
                  <button type="button" key={item.key} onClick={(event) => {
                    event.preventDefault();
                    handleSelectTab(item.key);
                  }} className={`text-left text-sm font-500 px-4 py-3 rounded-lg transition-all ${activeTab === item.key ? "bg-green-500/10 text-green-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>{item.label}</button>
                )
              ))}
            </nav>
            <button type="button" onClick={handleSwitchDashboard} className="mt-auto w-full rounded-full bg-primary py-3 text-xs font-600 text-white hover:bg-primary/90 transition-all" style={{ backgroundColor: theme.colors.primary }}>Switch to Staff</button>
          </aside>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-600 text-gray-900">Sign Out?</h3>
            <p className="mb-6 text-xs font-500 text-gray-600 uppercase tracking-wider">Are you sure you want to exit the portal?</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowLogoutModal(false)} fullWidth>
                Stay Here
              </Button>
              <Button variant="danger" onClick={handleSignOut} fullWidth>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}