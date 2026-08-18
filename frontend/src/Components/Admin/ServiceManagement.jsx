// ─── SERVICE MANAGEMENT COMPONENT ─────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { Button, Badge } from './UIComponents';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const CATEGORIES = ["Residential", "Industrial", "Eco", "Commercial"];
const UNITS      = ["per visit", "per load", "per ton", "per consignment", "per month"];
const EMPTY_FORM = { name: "", category: "Residential", price: "", unit: "per visit", status: "Active", description: "" };

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
              <Search size={16} />
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
        <Button
          onClick={openAddModal}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Service
        </Button>
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
                      <Badge variant="primary">{service.category}</Badge>
                    </td>
                    <td className="p-4 font-black text-[#244c21]">
                      {Number(service.price).toLocaleString()}
                    </td>
                    <td className="p-4 text-[0.75rem] text-[#397239]/70 font-bold">{service.unit}</td>
                    <td className="p-4">
                      <Button
                        onClick={() => toggleStatus(service.id)}
                        variant={service.status === "Active" ? "primary" : "outline"}
                        size="sm"
                        className="flex items-center gap-1.5"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${service.status === "Active" ? "bg-white" : "bg-gray-400"}`} />
                        {service.status}
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openEditModal(service)}
                          variant="outline"
                          size="sm"
                          title="Edit"
                          className="p-2"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(service.id)}
                          variant="danger"
                          size="sm"
                          title="Delete"
                          className="p-2"
                        >
                          <Trash2 size={16} />
                        </Button>
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
                <X size={18} />
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
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!form.name.trim() || !form.price || saving}
                  variant="primary"
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  {saving && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  {editingService ? "Save Changes" : "Add Service"}
                </Button>
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
              <Trash2 size={24} />
            </div>
            <h3 className="mb-2 text-xl font-black text-white">Remove Service?</h3>
            <p className="mb-6 text-xs font-bold text-white/40 uppercase tracking-widest">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                fullWidth
                className="text-white border-white/10 bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                variant="danger"
                fullWidth
                className="flex items-center justify-center gap-2"
              >
                {deleting && <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceManagement;