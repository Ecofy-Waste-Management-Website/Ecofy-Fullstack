import React, { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

// Standard Component Imports
import SLAAnalytics from "./SLAAnalytics";
import ServiceRequests from "./ServiceRequests";
import ContentBlogManagement from "./contentBlogManagement";
import StaffAccountCreation from "./StaffAccountCreation";
import InquiryManagement from "./InquiryManagement";
import NotificationBell from "../Main/Top-Header-Section/NotificationBell/NotificationBell";
// Assuming you have UserManagement, otherwise this is a placeholder
// import UserManagement from "./UserManagement"; 

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
  )
};

// ─── DATA & CONFIGURATION ──────────────────────────────────────────────────

const stats = [
  { label: "Total Revenue", value: "LKR 2.3M", icon: <Icons.Revenue /> },
  { label: "Pending", value: "41", icon: <Icons.Pending /> },
  { label: "Active Staff", value: "18", icon: <Icons.Staff /> },
  { label: "Response", value: "15 min", icon: <Icons.Timer /> },
];

const taskRows = [
  { requestId: "#REQ102", customer: "Bandara Y.", location: "Kandy", status: "Pending", assignedStaff: "Select Staff" },
  { requestId: "#REQ101", customer: "Pathirana P.", location: "Colombo", status: "In-Progress", assignedStaff: "Banuka J." },
  { requestId: "#REQ100", customer: "Mohamed A.", location: "Colombo", status: "Completed", assignedStaff: "Priyantha S." },
];

const escalations = [
  { title: "Admin Escalation", customer: "Customer: Bandara Y.", summary: "Summary pending pickup confirmation.", time: "3 sec ago" },
  { title: "Admin Escalation", customer: "Customer: Pathirana P.", summary: "Summary late route update and follow-up.", time: "3 sec ago" },
  { title: "Admin Escalation", customer: "Customer: Priyantha S.", summary: "Summary delayed escalation closure.", time: "1m ago" },
];

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
      { label: "Performance", key: "SLA_ANALYTICS", path: "/admins/logs" }
    ] 
  },
  { label: "Content/Blog", key: "CONTENT_BLOG", hasSubmenu: false },
  { label: "Inquiry", key: "INQUIRY", hasSubmenu: false },
];

// ─── DASHBOARD HOME COMPONENT ──────────────────────────────────────────────
const DashboardHome = () => (
  <div className="flex flex-col h-full gap-4">
    {/* Stats Grid - Compact */}
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="flex items-center gap-3 rounded-2xl border border-green-200/60 bg-white/40 backdrop-blur-md p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/60">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="m-0 truncate text-[0.75rem] font-medium text-green-800/70">{stat.label}</p>
            <h3 className="m-0 truncate text-lg font-bold text-green-900 leading-tight">{stat.value}</h3>
          </div>
        </article>
      ))}
    </section>

    {/* Main Content Row - Fills available space */}
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.8fr_1fr] flex-1 min-h-0">
      {/* Analytics Panel */}
      <article className="flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold text-gray-800">SLA & Analytics</h3>
          <button className="text-gray-400 hover:text-gray-600"><Icons.More /></button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          <div>
            <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pickup Trend</h4>
            <div className="relative h-24 overflow-hidden rounded-xl border border-gray-50 bg-gray-50/50 p-2">
              <div className="absolute inset-0 flex items-end px-1 gap-1">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="flex-1 bg-green-500/20 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                     <div className="absolute inset-0 bg-green-500 rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waste Categories</h4>
            <div className="flex items-center justify-center py-2">
              <div className="relative h-28 w-28 rounded-full" style={{ background: "conic-gradient(#10b981 0 65%, #065f46 65% 100%)" }}>
                <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-gray-400">ECOFY</div>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-[0.7rem] font-semibold text-gray-600">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Household</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-800" /> Industrial</span>
            </div>
          </div>
        </div>
      </article>

      {/* Tasks Panel */}
      <article className="flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold text-gray-800">Task Management</h3>
          <button className="text-gray-400 hover:text-gray-600"><Icons.More /></button>
        </div>
        <div className="flex-1 overflow-x-auto rounded-2xl border border-gray-50">
          <table className="w-full text-left text-[0.8rem] text-gray-700">
            <thead className="sticky top-0 bg-gray-50/80 backdrop-blur-sm font-bold text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {taskRows.map((row) => (
                <tr key={row.requestId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">{row.requestId}</td>
                  <td className="p-3">{row.customer}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                      row.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      row.status === "In-Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="rounded-lg bg-green-600 px-2.5 py-1 text-[0.7rem] font-bold text-white hover:bg-green-700 transition-all">Assign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* Escalations Panel */}
      <article className="flex flex-col rounded-3xl border border-gray-100 bg-white p-5 shadow-sm overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold text-gray-800">Escalations</h3>
          <button className="text-gray-400 hover:text-gray-600"><Icons.More /></button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {escalations.map((item) => (
            <div key={item.customer} className="rounded-2xl border border-gray-50 bg-gray-50/30 p-3 hover:bg-gray-50/60 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <p className="m-0 flex items-center gap-1.5 font-bold text-gray-800 text-[0.8rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  {item.title}
                </p>
                <span className="text-[0.65rem] font-bold text-gray-400">{item.time}</span>
              </div>
              <p className="mt-1 m-0 text-xs font-semibold text-gray-600">{item.customer}</p>
              <p className="mt-1 m-0 text-[0.7rem] text-gray-500 leading-snug truncate">{item.summary}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  </div>
);

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
    SLA_ANALYTICS: <SLAAnalytics />,
    CONTENT_BLOG: <ContentBlogManagement />,
    INQUIRY: <InquiryManagement />,
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
    <div className="h-screen w-screen font-sans text-gray-900 bg-green-50/50 p-4 lg:p-3 overflow-hidden">
      <div className="flex h-full w-full gap-3">
        
        {/* Sidebar - Fixed Height to Fill */}
        <aside className="hidden lg:flex flex-col gap-4 bg-green-900/40 backdrop-blur-xl border border-white/10 p-5 text-white w-[240px] shrink-0 rounded-3xl shadow-xl overflow-hidden h-full">
          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-bold tracking-tight">Ecofy</h1>
          </div>
          
          <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <div key={item.key} className="flex flex-col">
                <button
                  className={`flex justify-between items-center text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.key && !item.hasSubmenu 
                      ? "bg-green-600 text-white shadow-md shadow-green-900/20" 
                      : "text-green-100 hover:bg-white/10"
                  }`}
                  onClick={() => item.hasSubmenu ? toggleSubmenu(item.key) : handleSelectTab(item.key)}
                >
                  <span className="truncate">{item.label}</span>
                  {item.hasSubmenu && (
                    <span className="text-white/70">
                      {openMenus[item.key] ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
                    </span>
                  )}
                </button>

                {item.hasSubmenu && openMenus[item.key] && (
                  <div className="mt-1 flex flex-col gap-1 pl-3 pr-2">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.key}
                        className={`text-left text-[0.8rem] px-4 py-2 rounded-lg transition-colors ${
                          activeTab === sub.key 
                            ? "bg-green-600/60 text-white font-medium" 
                            : "text-green-100/70 hover:text-white hover:bg-white/5"
                        }`}
                        onClick={() => handleSelectTab(sub.key)}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-white border border-white/5 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-700 text-xs font-bold text-white shadow-inner">{adminInitials}</div>
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-bold uppercase tracking-wider text-green-300/80">Admin</p>
              <p className="m-0 text-xs font-bold truncate">{adminName}</p>
              <button className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.65rem] font-bold text-white/60 hover:text-white hover:underline transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Area - Fixed Height to Fill */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header - Fixed Height */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-1 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-bold tracking-tight text-green-900 truncate">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search />
                </span>
                <input type="text" className="w-full rounded-2xl border border-green-100 bg-white/60 p-[8px_12px_8px_38px] text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-900/5 placeholder:text-gray-400" placeholder="Search..." />
              </div>
              <NotificationBell target="admin" />
                
              <div className="rounded-xl border border-green-100 bg-white/60 px-3 py-1.5 text-xs font-bold text-green-900 backdrop-blur-sm">Admin</div>
              {!roleLoading && role === "Admin" && (
                <button onClick={handleSwitchDashboard} className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-green-700 shadow-md shadow-green-900/10">Switch to Staff</button>
              )}
            </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
               {renderMainContent()}
               <footer className="mt-4 text-[0.75rem] text-green-800/40 pb-4 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>

      </div>

      {/* Mobile Elements - Omitted for brevity but kept functional */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-green-100/50 bg-green-900/95 px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><h2 className="truncate text-base font-bold leading-tight">{getPageTitle()}</h2></div>
          <button onClick={handleToggleMobileMenu} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white"><Icons.Menu /></button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-green-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-[300px] flex-col gap-4 overflow-y-auto bg-green-900/90 backdrop-blur-xl p-5 text-white shadow-2xl border border-white/10 rounded-3xl">
            <div className="flex items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-3"><h1 className="m-0 text-lg font-bold">Ecofy</h1></div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 text-xs font-bold">✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button key={item.key} onClick={() => handleSelectTab(item.key)} className={`text-left text-sm font-semibold px-4 py-2.5 rounded-xl transition-all ${activeTab === item.key ? "bg-green-600" : "hover:bg-white/10"}`}>{item.label}</button>
              ))}
            </nav>
            <button onClick={handleSwitchDashboard} className="mt-auto w-full rounded-xl bg-white py-2.5 text-xs font-bold text-green-900">Switch to Staff</button>
          </aside>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-3xl bg-white p-6 text-center shadow-2xl">
            <h3 className="mb-2 text-xl font-bold text-green-900">Sign Out?</h3>
            <p className="mb-6 text-sm text-gray-500">Are you sure you want to exit the Admin Portal?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-2xl bg-gray-100 py-3 text-sm font-bold text-gray-600">Cancel</button>
              <button onClick={handleSignOut} className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}