import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function timeAgo(dateStr) {
  const s = Math.round((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return "Not available";
  return new Date(dateStr).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const TYPE_STYLES = {
  Alert:   "bg-red-100 text-red-800",
  Warning: "bg-amber-100 text-amber-800",
  Info:    "bg-blue-100 text-blue-800",
  Success: "bg-green-100 text-green-800",
};

export default function NotificationBell({ target = "user" }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const panelRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const res = await window.fetch(`${API_BASE_URL}/notifications/${user.id}?target=${target}`);
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, [target, user]);

  // Fetch on mount and every 60 seconds
  useEffect(() => {
    const initialFetch = setTimeout(fetchNotifications, 0);
    const interval = setInterval(fetchNotifications, 60_000);
    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await window.fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    // Call individual PATCH for each unread (no bulk endpoint exists yet)
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(
      unread.map((n) =>
        window.fetch(`${API_BASE_URL}/notifications/${n._id}/read`, { method: "PATCH" })
      )
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleNotification = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleNotificationKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleNotification(id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative grid h-9 w-9 place-items-center rounded-full bg-white border border-green-100 text-green-600 hover:bg-green-50 transition-colors shadow-sm"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 min-w-[1rem] place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm px-0.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[360px] rounded-2xl border border-green-100 bg-white shadow-xl shadow-green-900/10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-50">
            <p className="text-sm font-bold text-gray-800 m-0">
              Notifications{" "}
              {unreadCount > 0 && (
                <span className="ml-1 text-xs font-semibold text-green-600">
                  {unreadCount} unread
                </span>
              )}
            </p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-green-600 hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">No notifications yet.</p>
            ) : (
              notifications.map((item) => {
                const isExpanded = expandedId === item._id;

                return (
                <div
                  key={item._id}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleNotification(item._id)}
                  onKeyDown={(e) => handleNotificationKeyDown(e, item._id)}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors hover:bg-green-50/70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-200 ${
                    item.isRead ? "bg-white" : "bg-green-50/50"
                  }`}
                >
                  {/* Unread dot */}
                  <div className="pt-1.5 shrink-0">
                    <span
                      className={`block h-2 w-2 rounded-full ${
                        item.isRead ? "bg-transparent" : "bg-green-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <p className={`text-[0.72rem] leading-snug m-0 mb-0.5 ${item.isRead ? "text-gray-500" : "text-gray-700 font-bold"}`}>
                        {item.title}
                      </p>
                    )}
                    <p className={`text-[0.8rem] leading-snug m-0 mb-1 ${item.isRead ? "text-gray-500" : "text-gray-800 font-semibold"}`}>
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLES[item.type] || "bg-gray-100 text-gray-600"}`}>
                        {item.type}
                      </span>
                      <span className="text-[0.65rem] text-gray-400">{timeAgo(item.createdAt)}</span>
                      <span className="ml-auto text-[0.65rem] font-semibold text-green-600">
                        {isExpanded ? "hide details" : "view details"}
                      </span>
                      {!item.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(item._id, e)}
                          className="text-[0.65rem] text-gray-400 hover:text-green-600 hover:underline bg-transparent border-none cursor-pointer p-0"
                        >
                          mark read
                        </button>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 rounded-xl border border-green-100 bg-white px-3 py-3 shadow-sm">
                        <p className="m-0 text-[0.72rem] font-bold uppercase tracking-wide text-green-700">
                          Notification details
                        </p>
                        <p className="mt-2 mb-0 text-[0.78rem] leading-relaxed text-gray-700">
                          {item.message}
                        </p>
                        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.68rem]">
                          <div>
                            <dt className="font-bold text-gray-400">Type</dt>
                            <dd className="m-0 text-gray-700">{item.type || "Info"}</dd>
                          </div>
                          <div>
                            <dt className="font-bold text-gray-400">Status</dt>
                            <dd className="m-0 text-gray-700">{item.isRead ? "Read" : "Unread"}</dd>
                          </div>
                          <div className="col-span-2">
                            <dt className="font-bold text-gray-400">Received</dt>
                            <dd className="m-0 text-gray-700">{formatDateTime(item.createdAt)}</dd>
                          </div>
                          {item.updatedAt && item.updatedAt !== item.createdAt && (
                            <div className="col-span-2">
                              <dt className="font-bold text-gray-400">Last updated</dt>
                              <dd className="m-0 text-gray-700">{formatDateTime(item.updatedAt)}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
