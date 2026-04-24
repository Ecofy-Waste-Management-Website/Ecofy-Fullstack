import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from "@clerk/clerk-react";
import { submitInquiry } from "../../services/api/adminService";
import { getUserBookings } from "../../services/api/bookingService";
import RequestPickupModal from "./RequestPickupModal";
import PaymentModal from "./PaymentModal";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // ratio evaluates to 0 at top and scales up to 1 over 100px of scroll
      const ratio = Math.min(Math.max(window.scrollY / 100, 0), 1);
      setScrollRatio(ratio);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <div className="bg-[#06a63e]/80 backdrop-blur-md rounded-xl shadow-lg border border-[#06a63e]/50 p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-bold text-white relative z-10">
          Welcome back, {user?.firstName || user?.username}!
        </h1>
        <p className="text-white/90 mt-1 relative z-10">
          Here's an overview of your Ecofy account.
        </p>
      </div>

      {/* ────────────────────────────────────────────
          REQUEST PICKUP — Hero Call-to-Action Card
          ──────────────────────────────────────────── */}
      <div
        id="request-pickup-card"
        onClick={() => setShowPickupModal(true)}
        className="group relative mb-6 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl z-40 sticky top-[108px] mx-auto w-[98%]"
        style={{
          backgroundColor: `rgb(${255 - scrollRatio * 249}, ${255 - scrollRatio * 89}, ${255 - scrollRatio * 193})`,
          borderRadius: `${16 + scrollRatio * 84}px`,
          padding: `${1.5 - scrollRatio * 0.75}rem ${1.5 + scrollRatio * 0.5}rem`,
          maxWidth: `calc(100% - ${scrollRatio * 2}%)` // Marginally squeeze width for floating effect
        }}
      >
        {/* Decorative floating circles */}
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute -right-2 bottom-0 h-20 w-20 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-700" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon container */}
            <div 
               className="flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
               style={{
                 backgroundColor: `rgba(${6 + scrollRatio * 249}, ${166 + scrollRatio * 89}, ${62 + scrollRatio * 193}, ${0.1 + scrollRatio * 0.1})`,
                 width: `${3.5 - scrollRatio * 1}rem`,
                 height: `${3.5 - scrollRatio * 1}rem`,
                 fontSize: `${1.875 - scrollRatio * 0.625}rem`,
                 borderRadius: `${0.75 + scrollRatio * 99}rem`
               }}
            >
              <svg className="w-[60%] h-[60%] text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                <path d="M16 8h4l3 3v5h-7V8z"></path>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-bold" style={{ 
                  color: `rgb(${31 + scrollRatio * 224}, ${41 + scrollRatio * 214}, ${55 + scrollRatio * 200})`,
                  fontSize: `${1.25 - scrollRatio * 0.125}rem` 
                }}>
                Request Pickup
              </h2>
              <p className="overflow-hidden text-sm"
                 style={{
                   color: `rgb(${107 + scrollRatio * 102}, ${114 + scrollRatio * 136}, ${128 + scrollRatio * 101})`,
                   maxHeight: `${50 - scrollRatio * 50}px`,
                   opacity: 1 - scrollRatio,
                   marginTop: `${0.125 - scrollRatio * 0.125}rem`
                 }}>
                Schedule a new waste collection at your doorstep
              </p>
            </div>
          </div>

          {/* Arrow CTA */}
          <div className="hidden sm:flex items-center gap-2 rounded-full backdrop-blur-sm font-semibold group-hover:bg-black/5"
               style={{
                 backgroundColor: `rgba(${6 + scrollRatio * 249}, ${166 + scrollRatio * 89}, ${62 + scrollRatio * 193}, ${0.1 + scrollRatio * 0.1})`,
                 color: `rgb(${31 + scrollRatio * 224}, ${41 + scrollRatio * 214}, ${55 + scrollRatio * 200})`,
                 padding: `${0.625 - scrollRatio * 0.125}rem ${1.25 - scrollRatio * 0.25}rem`,
                 fontSize: `${0.875 - scrollRatio * 0.125}rem`
               }}>
            Book Now
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                 className="group-hover:translate-x-1 transition-transform duration-300"
                 style={{ width: `${1.25 - scrollRatio * 0.25}rem`, height: `${1.25 - scrollRatio * 0.25}rem` }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-[#06a63e]/80 p-6 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{activeBookings.length}</p>
          <p className="text-sm text-gray-400 mt-1">
            {activeBookings.length === 0 ? "No active bookings" : `${activeBookings.length} in progress`}
          </p>
        </div>
        <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-[#06a63e]/80 p-6 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">LKR 0</p>
          <p className="text-sm text-gray-400 mt-1">No payments yet</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-[#06a63e]/80 p-6 hover:shadow-md transition">
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
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100/50 mr-4">
              <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div>
              <p className="font-medium text-indigo-700">Service History</p>
              <p className="text-sm text-gray-500">View past pickups</p>
            </div>
          </a>
          <a href="/payment-history"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100/50 mr-4">
              <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <div>
              <p className="font-medium text-green-700">Payment History</p>
              <p className="text-sm text-gray-500">View transactions</p>
            </div>
          </a>
          <a href="/notifications"
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-100/50 mr-4">
              <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
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
      
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 mr-5">
        <svg className="w-7 h-7 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>

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
        onSuccess={(bookingDetails) => {
          setLastBooking(bookingDetails);
          setShowPickupModal(false);
          setShowPaymentModal(true);
        }}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchBookings(); // refreshes the bookings list after payment
        }}
        bookingDetails={lastBooking}
      />
    </div>
  );
}