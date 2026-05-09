import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);



function Notifications({ target = "user"}) {
  const { user, isLoaded } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/notifications/${user.id}?target=${target}`
        );
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(data.notifications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isLoaded, user]);

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Red Hat Display', sans-serif" }}>

      <h2 style={{ color: '#00671A', fontSize: '28px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Notifications
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {loading && (
          <p style={{ textAlign: 'center', color: '#00671A', fontWeight: '500' }}>Loading...</p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#ff4444', fontWeight: '500' }}>⚠️ {error}</p>
        )}

        {!loading && !error && notifications.length === 0 && (
          <p style={{ textAlign: 'center', color: '#00671A', fontWeight: '500' }}>No notifications yet.</p>
        )}

        {notifications.map((item) => (
          <div
            key={item._id}
            style={{ backgroundColor: '#00671A', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: item.isRead ? 0.7 : 1 }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: item.isRead ? '400' : '700', fontSize: '15px', margin: '0 0 6px' }}>
                {item.message}
              </p>
              <p style={{ color: 'white', fontSize: '13px', margin: '0', opacity: 0.8 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>

            {!item.isRead && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '16px', flexShrink: 0 }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FCFC1D' }} />
                <button
                  onClick={() => handleMarkAsRead(item._id)}
                  style={{ background: 'none', border: '1px solid #FCFC1D', color: '#FCFC1D', borderRadius: '12px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontFamily: "'Red Hat Display', sans-serif", fontWeight: '600' }}
                >
                  Mark read
                </button>
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}

export default Notifications;
