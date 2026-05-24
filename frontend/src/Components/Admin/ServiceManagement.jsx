// ─── SERVICE MANAGEMENT COMPONENT ─────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CATEGORIES = ["Residential", "Industrial", "Eco", "Commercial"];
const UNITS      = ["per visit", "per load", "per ton", "per consignment", "per month"];
const EMPTY_FORM = { name: "", category: "Residential", price: "", unit: "per visit", status: "Active", description: "" };

const PlusIcon   = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const EditIcon   = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon  = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CloseIcon  = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const SearchIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const categoryColors = {
  Residential: "bg-blue-100 text-blue-700",
  Industrial:  "bg-orange-100 text-orange-700",
  Eco:         "bg-green-100 text-[#397239]",
  Commercial:  "bg-purple-100 text-purple-700",
};

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="h-8 w-8 rounded-full border-2 border-[#397239]/20 border-t-[#397239] animate-spin" />
    <p className="text-sm font-bold text-[#397239]/60">Loading services…</p>
  </div>
);

// FIX #5: ErrorBanner now used for stats errors too (see fetchStats below)
const ErrorBanner = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <p className="text-sm font-bold text-red-500">{message}</p>
    <button onClick={onRetry} className="rounded-xl bg-[#397239] px-4 py-2 text-xs font-bold text-white hover:bg-[#244c21] transition-all">
      Retry
    </button>
  </div>
);

const ServiceManagement = () => {
  const [services,      setServices]      = useState([]);
  const [stats,         setStats]         = useState({ total: 0, active: 0, inactive: 0, categories: 0 });
  const [loading,       setLoading]       = useState(true);
  const [statsLoading,  setStatsLoading]  = useState(true);
  // FIX #5: track stats error separately so it's visible
  const [statsError,    setStatsError]    = useState(null);
  const [error,         setError]         = useState(null);
  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);

  const [showModal,      setShowModal]      = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form,           setForm]           = useState(EMPTY_FORM);
  const [deleteConfirm,  setDeleteConfirm]  = useState(null);

  const [search,         setSearch]         = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // ── Fetch services ─────────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search)                   params.set("search",   search);
      if (filterCategory !== "All") params.set("category", filterCategory);

      const res  = await fetch(`${API_BASE_URL}/services?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load services");
      setServices(data.data);
    } catch (err) {
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory]);

  // ── Fetch stats ────────────────────────────────────────────────────────────
  // FIX #5: surface errors instead of silently ignoring them
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res  = await fetch(`${API_BASE_URL}/services/stats`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load stats");
      setStats(data.data);
    } catch (err) {
      setStatsError(err?.message || "Could not load stats");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchServices, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchServices, search, filterCategory]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingService(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      name:        service.name,
      category:    service.category,
      price:       service.price,
      unit:        service.unit,
      status:      service.status,
      description: service.description || "",
    });
    setShowModal(true);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try {
      const isEdit = Boolean(editingService);
      const url    = isEdit ? `${API_BASE_URL}/services/${editingService.id}` : `${API_BASE_URL}/services`;
      const method = isEdit ? "PATCH" : "POST";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed");

      if (isEdit) {
        setServices(prev => prev.map(s => s.id === editingService.id ? data.data : s));
      } else {
        setServices(prev => [data.data, ...prev]);
      }

      setShowModal(false);
      fetchStats();
    } catch (err) {
      // FIX #4: safe message access
      alert(`Error: ${err?.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Delete failed");

      setServices(prev => prev.filter(s => s.id !== id));
      setDeleteConfirm(null);
      fetchStats();
    } catch (err) {
      alert(`Error: ${err?.message || "Unknown error"}`);
    } finally {
      setDeleting(false);
    }
  };

  // ── Toggle status ──────────────────────────────────────────────────────────
  // FIX #2: capture the original status before flipping so we can restore it precisely
  const toggleStatus = async (id) => {
    const original = services.find(s => s.id === id)?.status;

    // Optimistic flip
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s)
    );

    try {
      const res  = await fetch(`${API_BASE_URL}/services/${id}/toggle`, { method: "PATCH" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Confirm with the server's authoritative value
      setServices(prev => prev.map(s => s.id === id ? data.data : s));
      fetchStats();
    } catch (err) {
      // FIX #2: restore original status precisely, not by re-flipping
      setServices(prev =>
        prev.map(s => s.id === id ? { ...s, status: original } : s)
      );
      // FIX #4: safe message access
      alert(`Toggle failed: ${err?.message || "Unknown error"}`);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-4">

      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#397239]/40">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services…"
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
          <PlusIcon /> Add Service
        </button>
      </div>

      {/* ── Summary Cards ── */}
      {/* FIX #5: show a small inline error if stats fail to load */}
      {statsError && (
        <p className="text-xs font-bold text-red-500">
          Stats unavailable: {statsError} —{" "}
          <button onClick={fetchStats} className="underline">retry</button>
        </p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Services", value: statsLoading ? "…" : stats.total },
          { label: "Active",         value: statsLoading ? "…" : stats.active },
          { label: "Inactive",       value: statsLoading ? "…" : stats.inactive },
          { label: "Categories",     value: statsLoading ? "…" : stats.categories },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] p-4 shadow-sm">
            <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#397239]/60">{card.label}</p>
            <p className="text-2xl font-black text-[#244c21]">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── Services Table ── */}
      <div className="flex-1 rounded-3xl border border-[#397234]/20 bg-[#D6E9CA]/50 backdrop-blur-[40px] shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBanner message={error} onRetry={fetchServices} />
        ) : (
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
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-[#397239]/50 font-bold">
                      No services found.
                    </td>
                  </tr>
                ) : services.map(service => (
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
                          service.status === "Active"
                            ? "bg-green-100 text-[#397239] hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
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
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(service.id)}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="w-full max-w-[480px] rounded-[2rem] border border-white/20 bg-white shadow-2xl overflow-hidden">
            <div className="bg-[#397234] px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <CloseIcon />
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
                  placeholder="Brief description of this service…"
                  rows={3}
                  className="rounded-xl border border-[#112A0F]/15 bg-[#f4f9f4] px-4 py-2.5 text-sm text-[#244c21] outline-none focus:border-[#397239] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border border-[#112A0F]/10 bg-[#f4f9f4] py-3 text-[0.75rem] font-black text-[#397239] uppercase tracking-wider hover:bg-[#D6E9CA] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.price || saving}
                  className="flex-1 rounded-2xl bg-[#397239] py-3 text-[0.75rem] font-black text-white uppercase tracking-wider shadow-lg shadow-[#397239]/20 hover:bg-[#244c21] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  {editingService ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
          <div className="w-full max-w-[340px] rounded-[2rem] border border-white/20 bg-[#397234] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-400/10 text-red-400">
              <TrashIcon />
            </div>
            <h3 className="mb-2 text-xl font-black text-white">Remove Service?</h3>
            <p className="mb-6 text-xs font-bold text-white/40 uppercase tracking-widest">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-[0.7rem] font-black text-white uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 rounded-2xl bg-red-500 py-3 text-[0.7rem] font-black text-white uppercase tracking-wider shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceManagement;