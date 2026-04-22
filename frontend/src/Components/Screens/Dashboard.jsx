import React, { useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import { submitInquiry } from "../../services/api/adminService";

export default function Dashboard() {
  const { user } = useUser();
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">0</p>
          <p className="text-sm text-gray-400 mt-1">No active bookings</p>
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

      {/* Pickup Status*/}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pickup Status</h2>
        <p className="text-sm text-gray-400">No recent pickups to display.</p>
        {/* TODO: map over active bookings and show status badges */}
      </div>

      {/* Driver Location */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Driver Location</h2>
        <div className="bg-gray-50 rounded-lg h-40 flex items-center justify-center">
          <p className="text-sm text-gray-400">No active driver assigned to your booking.</p>
          {/* TODO: embed map component when a driver is active */}
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

    </div>
  );
}