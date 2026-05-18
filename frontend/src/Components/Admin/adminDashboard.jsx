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
  { label: "Service Management", key: "SERVICE_MGMT", hasSubmenu: false }
];
// ─── SERVICE MANAGEMENT COMPONENT ─────────────────────────────────────────

const INITIAL_SERVICES = [
  { id: 1, name: "Household Waste Pickup", category: "Residential", price: 1500, unit: "per visit", status: "Active", description: "Regular household waste collection service." },
  { id: 2, name: "Bulk Waste Removal", category: "Residential", price: 4500, unit: "per load", status: "Active", description: "Large item and bulk waste disposal." },
  { id: 3, name: "Industrial Waste Disposal", category: "Industrial", price: 12000, unit: "per ton", status: "Active", description: "Certified industrial waste handling and disposal." },
  { id: 4, name: "Recycling Collection", category: "Eco", price: 800, unit: "per visit", status: "Active", description: "Sorted recyclables pickup and processing." },
  { id: 5, name: "Hazardous Waste Handling", category: "Industrial", price: 18000, unit: "per consignment", status: "Inactive", description: "Safe handling of hazardous materials." },
];

const CATEGORIES = ["Residential", "Industrial", "Eco", "Commercial"];
const UNITS = ["per visit", "per load", "per ton", "per consignment", "per month"];

const EMPTY_FORM = { name: "", category: "Residential", price: "", unit: "per visit", status: "Active", description: "" };

const ServiceManagement = () => {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const openAddModal = () => {
    setEditingService(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({ ...service });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...form, id: editingService.id } : s));
    } else {
      setServices(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price) }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
  };

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  const categoryColors = { Residential: "bg-blue-100 text-blue-700", Industrial: "bg-orange-100 text-orange-700", Eco: "bg-green-100 text-[#397239]", Commercial: "bg-purple-100 text-purple-700" };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#397239]/40">
              <Icons.Search />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-[220px] rounded-2xl border border-[#112A0F]/10 bg-white shadow-sm p-[8px_12px_8px_38px] text-sm text-[#244c21] outline-none focus:border-[#397239] placeholder:text-[#397239]/40"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="rounded-2xl border border-[#112A0F]/10 bg-white px-3 py-2 text-sm font-bold text-[#244c21] outline-none focus:border-[#397239] shadow-sm"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-2xl bg-[#397239] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#397239]/20 hover:bg-[#244c21] transition-all hover:scale-105 active:scale-95"
        >
          <Icons.Plus /> Add Service
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Services", value: services.length },
          { label: "Active", value: services.filter(s => s.status === "Active").length },
          { label: "Inactive", value: services.filter(s => s.status === "Inactive").length },
          { label: "Categories", value: CATEGORIES.length },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-4 shadow-sm">
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#397239]/60">{card.label}</p>
            <p className="text-2xl font-black text-[#244c21]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Services Table */}
      <div className="flex-1 rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-[#244c21]">
            <thead className="sticky top-0 bg-[#397234]/10 backdrop-blur-xl">
              <tr className="text-[10px] font-black uppercase tracking-widest text-[#397239]">
                <th className="p-4">Service Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (LKR)</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#397239]/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[#397239]/50 font-bold">No services found.</td>
                </tr>
              ) : filtered.map(service => (
                <tr key={service.id} className="hover:bg-[#112A0F]/5 transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-[#244c21]">{service.name}</p>
                    <p className="text-[0.7rem] text-[#397239]/60 mt-0.5 max-w-[220px] truncate">{service.description}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${categoryColors[service.category] || "bg-gray-100 text-gray-600"}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="p-4 font-black text-[#244c21]">
                    {Number(service.price).toLocaleString()}
                  </td>
                  <td className="p-4 text-[0.75rem] text-[#397239]/70 font-bold">{service.unit}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(service.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold transition-all hover:scale-105 ${
                        service.status === "Active" ? "bg-green-100 text-[#397239] hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${service.status === "Active" ? "bg-[#397239]" : "bg-red-500"}`} />
                      {service.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(service)}
                        className="grid h-8 w-8 place-items-center rounded-xl bg-[#397239]/10 text-[#397239] hover:bg-[#397239] hover:text-white transition-all shadow-sm"
                        title="Edit"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(service.id)}
                        className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Delete"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="w-full max-w-[480px] rounded-[2rem] border border-white/20 bg-white shadow-2xl overflow-hidden">
            <div className="bg-[#397234] px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{editingService ? "Edit Service" : "Add New Service"}</h3>
              <button onClick={() => setShowModal(false)} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
                <Icons.Close />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] font-black uppercase tracking-wider text-[#397239]">Service Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Household Waste Pickup"
                  className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black uppercase tracking-wider text-[#397239]">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239]"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black uppercase tracking-wider text-[#397239]">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239]"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black uppercase tracking-wider text-[#397239]">Price (LKR) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.7rem] font-black uppercase tracking-wider text-[#397239]">Billing Unit</label>
                  <select
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239]"
                  >
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] font-black uppercase tracking-wider text-[#397239]">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this service..."
                  rows={3}
                  className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-2xl border border-[#112A0F]/10 bg-[#f4f9f4] py-3 text-[0.75rem] font-black text-[#397239] uppercase tracking-wider hover:bg-[#D6E9CA] transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.price}
                  className="flex-1 rounded-2xl bg-[#397239] py-3 text-[0.75rem] font-black text-white uppercase tracking-wider shadow-lg shadow-[#397239]/20 hover:bg-[#244c21] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingService ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="w-full max-w-[340px] rounded-[2rem] border border-white/20 bg-[#397234] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-400/10 text-red-400">
              <Icons.Trash />
            </div>
            <h3 className="mb-2 text-xl font-black text-white">Remove Service?</h3>
            <p className="mb-6 text-xs font-bold text-white/40 uppercase tracking-widest">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-[0.7rem] font-black text-white uppercase tracking-wider hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-2xl bg-red-500 py-3 text-[0.7rem] font-black text-white uppercase tracking-wider shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DASHBOARD HOME COMPONENT ──────────────────────────────────────────────
const DashboardHome = () => (
  <div className="flex flex-col h-full gap-4">
    {/* Stats Grid - Compact */}
    {/* Stats Grid - Compact */}
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="flex items-center gap-3 rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-[#D6E9CA]/60">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#397234]/10 text-[#397239] shadow-inner">
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="m-0 truncate text-[0.75rem] font-bold text-[#397239]/70 uppercase tracking-wider">{stat.label}</p>
            <h3 className="m-0 truncate text-lg font-bold text-[#244c21] leading-tight">{stat.value}</h3>
          </div>
        </article>
      ))}
    </section>

    {/* Main Content Row - Fills available space */}
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.8fr_1fr] flex-1 min-h-0">
      {/* Analytics Panel */}
      <article className="flex flex-col rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-5 shadow-sm overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold text-[#244c21]">SLA & Analytics</h3>
          <button className="text-[#397239]/40 hover:text-[#397239]"><Icons.More /></button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          <div>
            <h4 className="mb-2 text-xs font-bold text-[#397239]/60 uppercase tracking-widest">Pickup Trend</h4>
            <div className="relative h-24 overflow-hidden rounded-xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-2">
              <div className="absolute inset-0 flex items-end px-1 gap-1">
                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                   <div key={i} className="flex-1 bg-[#397234]/10 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                     <div className="absolute inset-0 bg-[#397239] rounded-t-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold text-[#397239]/60 uppercase tracking-widest">Waste Categories</h4>
            <div className="flex items-center justify-center py-2">
              <div className="relative h-28 w-28 rounded-full" style={{ background: "conic-gradient(#397239 0 65%, #f2f7f2 65% 100%)" }}>
                <div className="absolute inset-6 rounded-full bg-[#D6E9CA]/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-[#244c21]">ECOFY</div>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-[0.7rem] font-bold text-[#397239]/70">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#397239]" /> Household</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f2f7f2] border border-[#112A0F]/20" /> Industrial</span>
            </div>
          </div>
        </div>
      </article>

      {/* Tasks Panel */}
      <article className="flex flex-col rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-5 shadow-sm overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold text-[#244c21]">Task Management</h3>
          <button className="text-[#397239]/40 hover:text-[#397239]"><Icons.More /></button>
        </div>
        <div className="flex-1 overflow-x-auto rounded-2xl border border-[#397234]/10 bg-[#D6E9CA]/50">
          <table className="w-full text-left text-[0.8rem] text-[#244c21]">
            <thead className="sticky top-0 bg-[#397234]/10 backdrop-blur-xl font-bold text-[#397239] uppercase tracking-widest text-[10px]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#397239]/10">
              {taskRows.map((row) => (
                <tr key={row.requestId} className="hover:bg-[#112A0F]/5 transition-colors">
                  <td className="p-3 font-bold text-[#244c21]">{row.requestId}</td>
                  <td className="p-3 text-[#397239]">{row.customer}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                      row.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      row.status === "In-Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-[#397239]"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="rounded-lg bg-[#397239] px-2.5 py-1 text-[0.7rem] font-bold text-white hover:scale-105 transition-all active:scale-95 shadow-md">Assign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* Escalations Panel */}
      <article className="flex flex-col rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-5 shadow-sm overflow-hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold text-[#244c21]">Escalations</h3>
          <button className="text-[#397239]/40 hover:text-[#397239]"><Icons.More /></button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
          {escalations.map((item) => (
            <div key={item.customer} className="rounded-2xl border border-[#397234]/10 bg-[#D6E9CA]/50 p-3 hover:bg-[#D6E9CA]/60 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <p className="m-0 flex items-center gap-1.5 font-bold text-[#244c21] text-[0.8rem]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  {item.title}
                </p>
                <span className="text-[0.65rem] font-bold text-[#397239]/60">{item.time}</span>
              </div>
              <p className="mt-1 m-0 text-xs font-bold text-[#397239]">{item.customer}</p>
              <p className="mt-1 m-0 text-[0.7rem] text-[#397239]/70 leading-snug truncate">{item.summary}</p>
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
    <div className="h-screen w-screen font-sans text-[#244c21] bg-[#f4f9f4] p-4 lg:p-3 overflow-hidden">
      <div className="flex h-full w-full gap-3">
        
        {/* Sidebar - Fixed Height to Fill */}
        <aside className="hidden lg:flex flex-col gap-4 bg-[#397234]/80 backdrop-blur-3xl border border-[#397234]/20 p-5 text-white/80 w-[240px] shrink-0 rounded-3xl shadow-2xl overflow-hidden h-full relative">
          {/* Subtle lighting overlay for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 pb-2">
            <h1 className="m-0 text-2xl font-black tracking-tighter text-white">Ecofy</h1>
          </div>
          
          <nav className="flex flex-col gap-1 overflow-y-auto no-scrollbar flex-1">
            {menuItems.map((item) => (
              <div key={item.key} className="flex flex-col">
                <button
                  className={`flex justify-between items-center text-left text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.key && !item.hasSubmenu 
                      ? "bg-[#397239] text-white shadow-lg shadow-black/20" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => item.hasSubmenu ? toggleSubmenu(item.key) : handleSelectTab(item.key)}
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
                        className={`text-left text-[0.8rem] px-4 py-2 rounded-lg transition-colors font-bold ${
                          activeTab === sub.key 
                            ? "bg-white/10 text-white" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
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

          <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-white border border-white/10 backdrop-blur-sm shrink-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#397239] text-xs font-bold text-white shadow-inner">{adminInitials}</div>
            <div className="min-w-0">
              <p className="m-0 text-[0.65rem] font-black uppercase tracking-wider text-white/60">Admin</p>
              <p className="m-0 text-xs font-bold truncate">{adminName}</p>
              <button className="mt-0.5 cursor-pointer border-none bg-transparent p-0 text-[0.65rem] font-bold text-white/40 hover:text-white hover:underline transition-all" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main Area - Fixed Height to Fill */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header - Fixed Height */}
          <header className="mb-3 hidden lg:flex flex-row items-center justify-between py-1 px-2 shrink-0">
            <h2 className="m-0 text-2xl font-black tracking-tight text-[#244c21] truncate">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative w-[280px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#397239]/40">
                  <Icons.Search />
                </span>
                <input type="text" className="w-full rounded-2xl border border-[#112A0F]/10 bg-white shadow-sm p-[8px_12px_8px_38px] text-sm text-[#244c21] outline-none transition-all focus:border-[#397239] focus:shadow-md placeholder:text-[#397239]/40" placeholder="Search..." />
              </div>
              <NotificationBell target="admin" />
                
              <div className="rounded-xl border border-[#112A0F]/10 bg-white px-3 py-1.5 text-xs font-bold text-[#397239] shadow-sm">Admin</div>
              {!roleLoading && role === "Admin" && (
                <button onClick={handleSwitchDashboard} className="rounded-xl bg-[#397239] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#244c21] shadow-lg shadow-[#397239]/10">Switch to Staff</button>
              )}
            </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto no-scrollbar lg:pr-1">
            <div className="h-full">
               {renderMainContent()}
               <footer className="mt-4 text-[0.75rem] text-[#397239]/60 pb-4 text-center">&copy; 2026 Ecofy Waste Management</footer>
            </div>
          </main>
        </div>

      </div>

      {/* Mobile Elements - Omitted for brevity but kept functional */}
      <div className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-[#397234] px-4 py-2.5 text-white backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0"><h2 className="truncate text-base font-bold leading-tight">{getPageTitle()}</h2></div>
          <button onClick={handleToggleMobileMenu} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white"><Icons.Menu /></button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-4 top-4 bottom-4 flex w-[86%] max-w-[300px] flex-col gap-4 overflow-y-auto bg-[#397234]/90 backdrop-blur-3xl p-5 text-white shadow-2xl border border-white/10 rounded-3xl">
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
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-extrabold text-white uppercase tracking-widest transition-all hover:bg-white/10">Stay Here</button>
              <button onClick={handleSignOut} className="flex-1 rounded-2xl bg-red-500 py-4 text-[10px] font-extrabold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}