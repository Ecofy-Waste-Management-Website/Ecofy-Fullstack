import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const STATUS_STYLES = {
  Completed:   { backgroundColor: '#FCFC1D', color: '#00671A' },
  Pending:     { backgroundColor: '#ffffff', color: '#00671A' },
  'In Progress': { backgroundColor: '#ffffff', color: '#00671A' },
  Cancelled:   { backgroundColor: '#ff4444', color: '#ffffff' },
};

function ServiceHistory() {
  const { user, isLoaded } = useUser();
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchServiceHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/service-history/${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`
        );
        if (!res.ok) throw new Error('Failed to fetch service history');
        const data = await res.json();
        setServiceHistory(data.serviceHistory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceHistory();
  }, [isLoaded, user]);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Red Hat Display', sans-serif" }}>

      <h2 style={{ color: '#00671A', fontSize: '28px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Service History
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {loading && (
          <p style={{ textAlign: 'center', color: '#00671A', fontWeight: '500' }}>Loading...</p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#ff4444', fontWeight: '500' }}>⚠️ {error}</p>
        )}

        {!loading && !error && serviceHistory.length === 0 && (
          <p style={{ textAlign: 'center', color: '#00671A', fontWeight: '500' }}>No service records found.</p>
        )}

        {serviceHistory.map((item) => (
          <div key={item._id} style={{ backgroundColor: '#00671A', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <div>
              <p style={{ color: '#FCFC1D', fontWeight: '700', fontSize: '18px', margin: '0 0 6px' }}>
                {item.serviceName}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px' }}>
                {new Date(item.scheduledDate).toLocaleDateString()}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0' }}>
                {item.serviceType}
              </p>
            </div>

            <span style={{ ...(STATUS_STYLES[item.status] || { backgroundColor: '#ffffff', color: '#00671A' }), padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' }}>
              {item.status}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}

export default ServiceHistory;