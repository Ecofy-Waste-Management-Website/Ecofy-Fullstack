import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const STATUS_STYLES = {
  Paid:     { backgroundColor: '#FCFC1D', color: '#00671A' },
  Pending:  { backgroundColor: '#ffffff', color: '#00671A' },
  Failed:   { backgroundColor: '#ff4444', color: '#ffffff' },
  Refunded: { backgroundColor: '#ffffff', color: '#00671A' },
};

function PaymentHistory() {
  const { user, isLoaded } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("isLoaded:", isLoaded);
    console.log("user:", user);
    if (!isLoaded || !user) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
           `${import.meta.env.VITE_API_URL}/service-history/${user.id}`
        );
        if (!res.ok) throw new Error('Failed to fetch payment history');
        const data = await res.json();
        setPayments(data.paymentHistory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [isLoaded, user]);

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Red Hat Display', sans-serif" }}>

      <h2 style={{ color: '#00671A', fontSize: '28px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
        Payment History
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {loading && (
          <p style={{ textAlign: 'center', color: '#00671A', fontWeight: '500' }}>Loading...</p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#ff4444', fontWeight: '500' }}>⚠️ {error}</p>
        )}

        {!loading && !error && payments.length === 0 && (
          <p style={{ textAlign: 'center', color: '#00671A', fontWeight: '500' }}>No payment records found.</p>
        )}

        {payments.map((item) => (
          <div key={item._id} style={{ backgroundColor: '#00671A', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <div>
              <p style={{ color: '#FCFC1D', fontWeight: '700', fontSize: '18px', margin: '0 0 6px' }}>
                LKR {item.amount.toLocaleString()}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px' }}>
                {new Date(item.createdAt).toLocaleDateString()} · {item.paymentMethod}
              </p>
              <p style={{ color: 'white', fontSize: '14px', margin: '0' }}>
                {item.referenceId ? `Ref: ${item.referenceId}` : item.description || ''}
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

export default PaymentHistory;