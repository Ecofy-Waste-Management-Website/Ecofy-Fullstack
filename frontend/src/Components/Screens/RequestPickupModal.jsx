import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { createPickupRequest } from "../../services/api/bookingService";

const SERVICE_TYPES = ["Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"];
const WASTE_CATEGORIES = ["General", "Recyclable", "Hazardous", "Electronic", "Garden"];

export default function RequestPickupModal({ isOpen, onClose, onSuccess }) {
  const { user } = useUser();

  const [form, setForm] = useState({
    service_type: "",
    waste_category: "",
    location: "",
    scheduled_date: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ service_type: "", waste_category: "", location: "", scheduled_date: "", notes: "" });
    setStatus({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.service_type || !form.waste_category || !form.location || !form.scheduled_date) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    // Prevent past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(form.scheduled_date) < today) {
      setStatus({ type: "error", text: "Scheduled date cannot be in the past." });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: "", text: "" });

      await createPickupRequest({
        customer_name:
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
          user?.username ||
          "Ecofy Customer",
        customer_email: user?.primaryEmailAddress?.emailAddress || "",
        ...form,
      });

      setStatus({ type: "success", text: "Pickup request submitted successfully! 🎉" });

      // Auto-close after a brief pause so the user sees the success message
      setTimeout(() => {
        resetForm();
        onSuccess?.(form);
        onClose();
      }, 1500);
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Minimum selectable date = today (YYYY-MM-DD)
  const minDate = new Date().toISOString().split("T")[0];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg mx-4 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl overflow-hidden animate-[fadeScaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="px-6 pt-5 pb-6">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100/70 backdrop-blur-sm text-xl text-emerald-800 shadow-sm border border-emerald-200/50">
                <svg className="w-[60%] h-[60%] text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                  <path d="M16 8h4l3 3v5h-7V8z"></path>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Request Pickup</h2>
                <p className="text-xs text-gray-600">Schedule a new waste collection</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="text-gray-500 hover:text-gray-800 transition text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Type & Waste Category — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Service Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="service_type"
                  value={form.service_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200/50 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                >
                  <option value="">Select type</option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Waste Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="waste_category"
                  value={form.waste_category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200/50 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                >
                  <option value="">Select category</option>
                  {WASTE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Pickup Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. 123 Main Street, Colombo"
                className="w-full rounded-lg border border-emerald-200/50 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Preferred Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="scheduled_date"
                value={form.scheduled_date}
                onChange={handleChange}
                min={minDate}
                className="w-full rounded-lg border border-emerald-200/50 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any special instructions for the pickup crew..."
                className="w-full rounded-lg border border-emerald-200/50 bg-white/70 backdrop-blur-sm px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
              />
            </div>

            {/* Status Message */}
            {status.text && (
              <div
                className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {status.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { resetForm(); onClose(); }}
                className="rounded-lg border border-gray-300/80 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100/50 transition bg-white/30 backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Keyframe for fade + scale animation (injected via style tag once) */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
