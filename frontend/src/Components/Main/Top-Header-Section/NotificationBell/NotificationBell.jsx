import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function timeAgo(dateStr) {
  const s = Math.round((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TYPE_STYLES = {
  Alert:   { badge: "bg-red-100 text-red-800",   icon: "bg-red-500",   dot: "bg-red-500"   },
  Warning: { badge: "bg-amber-100 text-amber-800", icon: "bg-amber-500", dot: "bg-amber-500" },
  Info:    { badge: "bg-blue-100 text-blue-800",  icon: "bg-blue-500",  dot: "bg-blue-500"  },
  Success: { badge: "bg-green-100 text-green-800", icon: "bg-green-500", dot: "bg-green-500" },
};

const TYPE_ICONS = {
  Alert: (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  Warning: (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  Info: (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    </svg>
  ),
  Success: (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
function NotificationDetail({ notification, onClose }) {
  const styles = TYPE_STYLES[notification.type] || TYPE_STYLES.Info;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      {/* Card — stop propagation so clicking inside doesn't close */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease" }}
      >
        {/* Coloured top bar */}
        <div className={`flex items-center gap-3 px-5 py-4 ${styles.badge}`}>
          {/* Icon circle */}
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${styles.icon}`}>
            {TYPE_ICONS[notification.type] || TYPE_ICONS.Info}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide opacity-70 m-0">
              {notification.type}
            </p>
            <p className="text-sm font-bold text-gray-900 m-0 leading-snug truncate">
              {notification.title}
            </p>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="ml-2 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/10 hover:bg-black/20 transition-colors border-none cursor-pointer"
            aria-label="Close"
          >
            <svg className="h-3.5 w-3.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {/* Summary message */}
          <p className="text-sm font-semibold text-gray-800 m-0 mb-3 leading-snug">
            {notification.message}
          </p>

          {/* Full description — only if it exists and differs from message */}
          {notification.description && notification.description !== notification.message && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 m-0 mb-1">
                Details
              </p>
              <p className="text-sm text-gray-700 m-0 leading-relaxed whitespace-pre-wrap">
                {notification.description}
              </p>
            </div>
          )}

          {/* Metadata row */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-400">{formatFullDate(notification.createdAt)}</span>
            <span className="text-xs text-gray-300 mx-1">·</span>
            <span className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-1">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors py-2.5 text-sm font-semibold text-gray-700 border-none cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

// ── Main Bell Component ───────────────────────────────────────────────────────
export default function NotificationBell({ target = "user" }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // notification being viewed
  const panelRef = useRef(null);

  // Fetch on mount and every 60 seconds
  useEffect(() => {
    if (!user) return;
    const load = () => fetchNotifications();
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await window.fetch(
        `${API_BASE_URL}/notifications/${user.id}?target=${target}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Mark single as read ──────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await window.fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  // ── Open detail + auto-mark as read ─────────────────────────────────────
  const handleOpenDetail = async (notification) => {
    setSelected(notification);
    setOpen(false); // close the dropdown while modal is open
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const handleCloseDetail = () => setSelected(null);

  // ── Mark all read ────────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(
      unread.map((n) =>
        window.fetch(`${API_BASE_URL}/notifications/${n._id}/read`, {
          method: "PATCH",
        })
      )
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
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
                <p className="py-10 text-center text-sm text-gray-400">
                  No notifications yet.
                </p>
              ) : (
                notifications.map((item) => {
                  const styles = TYPE_STYLES[item.type] || TYPE_STYLES.Info;
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleOpenDetail(item)}
                      className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors cursor-pointer group ${
                        item.isRead
                          ? "bg-white hover:bg-gray-50"
                          : "bg-green-50/50 hover:bg-green-50"
                      }`}
                    >
                      {/* Unread dot */}
                      <div className="pt-1.5 shrink-0">
                        <span
                          className={`block h-2 w-2 rounded-full ${
                            item.isRead ? "bg-transparent" : styles.dot
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <p className={`text-[0.75rem] font-bold m-0 mb-0.5 truncate ${item.isRead ? "text-gray-500" : "text-gray-800"}`}>
                          {item.title}
                        </p>
                        {/* Message preview */}
                        <p className={`text-[0.8rem] leading-snug m-0 mb-1 line-clamp-2 ${item.isRead ? "text-gray-400" : "text-gray-600"}`}>
                          {item.message}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                            {item.type}
                          </span>
                          <span className="text-[0.65rem] text-gray-400">
                            {timeAgo(item.createdAt)}
                          </span>
                          {!item.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(item._id, e)}
                              className="ml-auto text-[0.65rem] text-gray-400 hover:text-green-600 hover:underline bg-transparent border-none cursor-pointer p-0"
                            >
                              mark read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Chevron hint */}
                      <div className="pt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal — rendered outside the dropdown so it's always on top */}
      {selected && (
        <NotificationDetail
          notification={selected}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
}