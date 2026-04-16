import React from 'react';
import { useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

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

      {/* Profile & Settings + Inquiry — NEW (2-col grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* Profile Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile & Settings</h2>
          <div className="flex flex-col gap-3">
            <a href="/profile"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
              <span className="text-2xl mr-3">👤</span>
              <div>
                <p className="font-medium text-blue-700">Edit Profile</p>
                <p className="text-sm text-gray-500">Update your information</p>
              </div>
            </a>
            <a href="/settings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <p className="font-medium text-gray-700">Settings</p>
                <p className="text-sm text-gray-500">Preferences & account</p>
              </div>
            </a>
          </div>
        </div>
        {/* Inquiry Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Inquiry</h2>
          <div className="flex flex-col gap-3">
            <a href="/inquiry"
              className="flex items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all">
              <span className="text-2xl mr-3">📝</span>
              <div>
                <p className="font-medium text-pink-700">Submit Inquiry</p>
                <p className="text-sm text-gray-500">Service-related questions</p>
              </div>
            </a>
            <a href="/chatbot"
              className="flex items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all">
              <span className="text-2xl mr-3">💬</span>
              <div>
                <p className="font-medium text-teal-700">AI Chatbot</p>
                <p className="text-sm text-gray-500">Get instant help</p>
              </div>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}