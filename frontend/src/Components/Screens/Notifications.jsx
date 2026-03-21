import React from 'react'

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const dummyNotifications = [
  { id: 1, message: 'Your pickup has been assigned to staff member Kasun', date: '2026-03-21', isRead: false },
  { id: 2, message: 'Payment of LKR 1,200 confirmed for Household Waste pickup', date: '2026-03-20', isRead: false },
  { id: 3, message: 'Your pickup has been delayed due to weather conditions', date: '2026-03-19', isRead: false },
  { id: 4, message: 'Your inquiry has been responded to by admin', date: '2026-03-18', isRead: true },
  { id: 5, message: 'Household waste pickup completed successfully', date: '2026-03-15', isRead: true },
];

function Notifications() {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Red Hat Display', sans-serif" }}>

      <h2 style={{ color: '#00671A', fontSize: '28px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Notifications
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dummyNotifications.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#00671A', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: item.isRead ? 0.7 : 1 }}>

            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: item.isRead ? '400' : '700', fontSize: '15px', margin: '0 0 6px' }}>
                {item.message}
              </p>
              <p style={{ color: 'white', fontSize: '13px', margin: '0', opacity: 0.8 }}>
                {item.date}
              </p>
            </div>

            {!item.isRead && (
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FCFC1D', marginLeft: '16px', flexShrink: 0 }}>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Notifications;