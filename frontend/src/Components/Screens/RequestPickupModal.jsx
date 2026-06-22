import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { createPickupRequest } from "../../services/api/bookingService";

const SERVICE_TYPES = ["Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"];
const WASTE_CATEGORIES = ["General", "Recyclable", "Hazardous", "Electronic", "Garden"];

export default function RequestPickupModal({
  isOpen,
  onClose,
  onSuccess,
  initialLocation = "",
  initialCoordinates = null,
}) {
  const { user } = useUser();

  const createEmptyForm = (location = "") => ({
    service_type: "",
    waste_category: "",
    location,
    scheduled_date: "",
    notes: "",
  });

  const [form, setForm] = useState({
    service_type: "",
    waste_category: "",
    location: "",
    scheduled_date: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isOpen) {
      setForm(createEmptyForm(initialLocation));
      setStatus({ type: "", text: "" });
    }
  }, [isOpen, initialLocation]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = (location = "") => {
    setForm(createEmptyForm(location));
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

      const booking = await createPickupRequest({
        customer_name:
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
          user?.username ||
          "Ecofy Customer",
        customer_email: user?.primaryEmailAddress?.emailAddress || "",
        customer_phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
        clerkId: user?.id,
        pickupCoordinates: initialCoordinates,
        ...form,
      });

      setStatus({
        type: "success",
        text: booking?.pickupPin
          ? `Pickup request submitted successfully! Your order PIN is ${booking.pickupPin}.`
          : "Pickup request submitted successfully! 🎉",
      });

      // Auto-close after a brief pause so the user sees the success message
      setTimeout(() => {
        resetForm();
        onSuccess?.({
          ...form,
          clerkId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress || "",
          pickupPin: booking?.pickupPin || "",
          pickupCoordinates: booking?.pickupCoordinates || initialCoordinates || null,
        });
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col max-h-[90vh] overflow-hidden rounded-4xl border border-gray-200 bg-[#f4f9f4] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-[#06a63e] to-[#047a2e] px-7 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">Pickup Form</p>
              <h2 className="mt-1 text-2xl font-black leading-tight">Request a Pickup</h2>
              <p className="mt-1 text-sm text-white/80">Fill in the details and we will schedule your collection.</p>
            </div>
            <button
              onClick={() => { resetForm(); onClose(); }}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-white/10 text-lg leading-none text-white transition hover:bg-white/20"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-7 overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Pickup Details</p>
                <p className="text-[11px] font-bold text-gray-400">Required fields marked *</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="service_type"
                  value={form.service_type}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
                >
                  <option value="">Select type</option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  Waste Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="waste_category"
                  value={form.waste_category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
                >
                  <option value="">Select category</option>
                  {WASTE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main Street, Colombo"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
                />
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="scheduled_date"
                  value={form.scheduled_date}
                  onChange={handleChange}
                  min={minDate}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any special instructions for the pickup crew..."
                className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#06a63e] focus:ring-2 focus:ring-[#06a63e]/20"
              />
              <p className="mt-2 text-xs text-gray-400">Add gate notes, landmarks, or timing preferences if needed.</p>
            </div>

            {status.text && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {status.text}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => { resetForm(); onClose(); }}
                className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-[#06a63e] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#058b33] disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}
