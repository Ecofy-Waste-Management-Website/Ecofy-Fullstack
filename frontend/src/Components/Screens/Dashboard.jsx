import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from "@clerk/clerk-react";
import { submitInquiry } from "../../services/api/adminService";
import { getUserBookings } from "../../services/api/bookingService";
import RequestPickupModal from "./RequestPickupModal";

// Status badge colours
const STATUS_STYLES = {
  Pending:       "bg-amber-100 text-amber-700",
  Assigned:      "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route":    "bg-cyan-100 text-cyan-700",
  Completed:     "bg-emerald-100 text-emerald-700",
  Delayed:       "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { user } = useUser();

  // ── Pickup modal ──
  const [showPickupModal, setShowPickupModal] = useState(false);

  // ── User bookings (for stats + pickup status) ──
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const fetchBookings = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;
    try {
      setLoadingBookings(true);
      const data = await getUserBookings(email);
      setBookings(data);
    } catch {
      /* silent — stats will stay at 0 */
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Derived stat
  const activeBookings = bookings.filter((b) =>
    ["Pending", "Assigned", "In Progress", "En Route"].includes(b.status)
  );

  // ── Inquiry form ──
  const [inquiry, setInquiry] = useState({ subject: "", message: "" });
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState({ type: "", text: "" });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiry.message.trim()) {
      setInquiryStatus({ type: "error", text: "Please enter your inquiry message." });
      return;
    }

    try {
      setSendingInquiry(true);
      await submitInquiry({
        userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Ecofy User",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        subject: inquiry.subject || "General Inquiry",
        message: inquiry.message,
      });
      setInquiry({ subject: "", message: "" });
      setInquiryStatus({ type: "success", text: "Inquiry sent. Admin will respond soon." });
    } catch (error) {
      setInquiryStatus({ type: "error", text: error.message || "Failed to send inquiry." });
    } finally {
      setSendingInquiry(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName || user?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of your Ecofy account.
        </p>
      </div>

      {/* ────────────────────────────────────────────
          REQUEST PICKUP — Hero Call-to-Action Card
          ──────────────────────────────────────────── */}
      <div
        id="request-pickup-card"
        onClick={() => setShowPickupModal(true)}
        className="group relative mb-6 cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {/* Decorative floating circles */}
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute -right-2 bottom-0 h-20 w-20 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-700" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon container */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-3xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              🚛
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Request Pickup</h2>
              <p className="text-sm text-emerald-100 mt-0.5">
                Schedule a new waste collection at your doorstep
              </p>
            </div>
          </div>

          {/* Arrow CTA */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white group-hover:bg-white/30 transition">
            Book Now
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{activeBookings.length}</p>
          <p className="text-sm text-gray-400 mt-1">
            {activeBookings.length === 0 ? "No active bookings" : `${activeBookings.length} in progress`}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">LKR 0</p>
          <p className="text-sm text-gray-400 mt-1">No payments yet</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Notifications</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">0</p>
          <p className="text-sm text-gray-400 mt-1">No new notifications</p>
        </div>
      </div>

      {/* Pickup Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pickup Status</h2>

        {loadingBookings ? (
          <p className="text-sm text-gray-400">Loading pickups…</p>
        ) : activeBookings.length === 0 ? (
          <p className="text-sm text-gray-400">No recent pickups to display.</p>
        ) : (
          <div className="space-y-3">
            {activeBookings.slice(0, 5).map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {b.service_type} — {b.waste_category}
                  </p>
                  <p className="text-xs text-gray-400">
                    {b.location} · {new Date(b.scheduled_date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Driver Location */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Driver Location</h2>
        <div className="bg-gray-50 rounded-lg h-40 flex items-center justify-center">
          <p className="text-sm text-gray-400">No active driver assigned to your booking.</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/service-history" 
            className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">
            <span className="text-2xl mr-3">🗂️</span>
            <div>
              <p className="font-medium text-indigo-700">Service History</p>
              <p className="text-sm text-gray-500">View past pickups</p>
            </div>
          </a>
          <a href="/payment-history"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
            <span className="text-2xl mr-3">💳</span>
            <div>
              <p className="font-medium text-green-700">Payment History</p>
              <p className="text-sm text-gray-500">View transactions</p>
            </div>
          </a>
          <a href="/notifications"
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all">
            <span className="text-2xl mr-3">🔔</span>
            <div>
              <p className="font-medium text-yellow-700">Notifications</p>
              <p className="text-sm text-gray-500">View alerts</p>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Need Help? Send an Inquiry</h2>
        <p className="text-sm text-gray-500 mb-4">Your inquiry will be visible in the Admin Inquiry section.</p>

        <form onSubmit={handleInquirySubmit} className="space-y-3">
          <input
            type="text"
            value={inquiry.subject}
            onChange={(e) => setInquiry((prev) => ({ ...prev, subject: e.target.value }))}
            placeholder="Subject (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <textarea
            value={inquiry.message}
            onChange={(e) => setInquiry((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Write your inquiry..."
            className="w-full min-h-30 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />

          {inquiryStatus.text && (
            <p className={`text-sm ${inquiryStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {inquiryStatus.text}
            </p>
          )}

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            disabled={sendingInquiry}
          >
            {sendingInquiry ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      </div>

      <a href="/profile-settings"
        className="flex items-center w-72 h-24 mt-10 ml-1 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
      
      <span className="text-3xl mr-4 text-purple-600">👤</span>

      <div>
        <p className="text-lg font-semibold text-gray-800">
          Profile & Settings
        </p>
        <p className="text-sm text-gray-500">
          Manage your account
        </p>
      </div>
      </a>

      {/* ── Request Pickup Modal ── */}
      <RequestPickupModal
        isOpen={showPickupModal}
        onClose={() => setShowPickupModal(false)}
        onSuccess={fetchBookings}
      />
    </div>
  );
}