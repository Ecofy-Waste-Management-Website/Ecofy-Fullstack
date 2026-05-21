import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import ServiceRequests from "./ServiceRequests";
import ContentBlogManagement from "./contentBlogManagement";
import StaffAccountCreation from "./StaffAccountCreation";
import InquiryManagement from "./InquiryManagement";
import NotificationBell from "../Main/Top-Header-Section/NotificationBell/NotificationBell";
import ServiceManagement from "./ServiceManagement";

// Apple System Colors
const COLORS = {
  primary: "#0071E3",
  primaryDark: "#0066CC",
  gray50: "#F5F5F7",
  gray100: "#F2F2F7",
  gray200: "#E5E5EA",
  gray300: "#D1D1D6",
  gray400: "#C7C7CC",
  gray500: "#A1A1A6",
  gray600: "#86868B",
  gray700: "#555555",
  textPrimary: "#1D1D1F",
  textSecondary: "#86868B",
  textTertiary: "#A1A1A6",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
};


const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
)
};

// ─── DATA & CONFIGURATION ──────────────────────────────────────────────────

const statCards = [
  { key: "orders", label: "Orders", icon: <Icons.Orders /> },
  { key: "completedOrders", label: "Completed Orders", icon: <Icons.Completed /> },
  { key: "cancelledDelayed", label: "Cancelled / Delayed", icon: <Icons.Cancelled /> },
  { key: "pending", label: "Pending", icon: <Icons.Pending /> },
  { key: "activeStaff", label: "Active Staff", icon: <Icons.Staff /> },
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
      
    ] 
  },
  { label: "Content/Blog", key: "CONTENT_BLOG", hasSubmenu: false },
  { label: "Inquiry", key: "INQUIRY", hasSubmenu: false },
  { label: "Service Management", key: "SERVICE_MGMT", hasSubmenu: false }
];



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
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm">
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
    STAFF_CREATE: <StaffAccountCreation />,
    SERVICE_REQ: <ServiceRequests />,
    CONTENT_BLOG: <ContentBlogManagement />,
    INQUIRY: <InquiryManagement />,
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
                      ? "bg-blue-500/10 text-blue-600 border-l-3 border-blue-500"
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
                        className={`text-left text-xs px-4 py-2 rounded-lg transition-colors font-500 ${
                          activeTab === sub.key
                            ? "bg-blue-500/10 text-blue-600"
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
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-md">{adminInitials}</div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-xs font-600 uppercase tracking-wider text-gray-600">Admin</p>
              <p className="m-0 text-sm font-500 truncate text-gray-900">{adminName}</p>
              <button type="button" className="mt-1 cursor-pointer border-none bg-transparent p-0 text-xs font-500 text-blue-600 hover:text-blue-700 transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
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
                  <Icons.Search />
                </span>
                <input type="text" className="w-full rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-sm shadow-sm p-[10px_16px_10px_44px] text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 placeholder:text-gray-500" placeholder="Search..." />
              </div>
              <NotificationBell target="admin" />
              <div className="rounded-lg border border-gray-300 bg-white/60 px-3 py-2 text-xs font-600 text-gray-700 shadow-sm">Admin</div>
              {!roleLoading && role === "Admin" && (
                <button type="button" onClick={handleSwitchDashboard} className="rounded-full bg-blue-500 px-5 py-2 text-xs font-600 text-white transition-all hover:bg-blue-600 shadow-md hover:shadow-lg">Switch to Staff</button>
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
          <button type="button" onClick={handleToggleMobileMenu} className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"><Icons.Menu /></button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-xs flex-col gap-4 overflow-y-auto bg-white/95 backdrop-blur-xl p-5 text-gray-900 shadow-2xl border border-white/50 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-3">
              <div className="flex items-center gap-3"><h1 className="m-0 text-lg font-600">Ecofy</h1></div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 text-xs font-600 hover:text-gray-700">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                item.hasSubmenu ? (
                  item.subItems.map((sub) => (
                    <button type="button" key={sub.key} onClick={(event) => {
                      event.preventDefault();
                      handleSelectTab(sub.key);
                    }} className={`text-left text-sm font-500 px-4 py-3 rounded-lg transition-all ${activeTab === sub.key ? "bg-blue-500/10 text-blue-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>{sub.label}</button>
                  ))
                ) : (
                  <button type="button" key={item.key} onClick={(event) => {
                    event.preventDefault();
                    handleSelectTab(item.key);
                  }} className={`text-left text-sm font-500 px-4 py-3 rounded-lg transition-all ${activeTab === item.key ? "bg-blue-500/10 text-blue-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>{item.label}</button>
                )
              ))}
            </nav>
            <button type="button" onClick={handleSwitchDashboard} className="mt-auto w-full rounded-full bg-blue-500 py-3 text-xs font-600 text-white hover:bg-blue-600 transition-all">Switch to Staff</button>
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
              <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-full border border-gray-300 bg-white py-3 text-xs font-600 text-gray-900 uppercase tracking-widest transition-all hover:bg-gray-50">Stay Here</button>
              <button type="button" onClick={handleSignOut} className="flex-1 rounded-full bg-red-500 py-3 text-xs font-600 text-white shadow-md transition-all hover:bg-red-600 uppercase tracking-widest">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}