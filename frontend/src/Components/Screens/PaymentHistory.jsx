import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const STATUS_STYLES = {
  Paid:     { bg: '#E8F5E9', color: '#2E7D32', dot: '#2E7D32', label: 'Paid' },
  Pending:  { bg: '#FFF8E1', color: '#F57C00', dot: '#F57C00', label: 'Pending' },
  Failed:   { bg: '#FFEBEE', color: '#C62828', dot: '#C62828', label: 'Failed' },
  Refunded: { bg: '#E3F2FD', color: '#1565C0', dot: '#1565C0', label: 'Refunded' },
};

function PaymentHistory() {
  const { user, isLoaded } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
           `${import.meta.env.VITE_API_URL}/payment-history/${user.id}`
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

  const totalSpent = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2F6 100%)',
      minHeight: '100vh',
      padding: '100px 20px 40px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
       <button
  onClick={() => window.history.back()}
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    border: '1.5px solid #1B4D3D',
    color: '#1B4D3D',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = '#1B4D3D';
    e.currentTarget.style.color = 'white';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'white';
    e.currentTarget.style.color = '#1B4D3D';
  }}
>
  ← Back
</button>
        
        {/* Header Section */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #1B4D3D 0%, #0F3529 100%)',
            width: '60px',
            height: '4px',
            borderRadius: '4px',
            marginBottom: '20px'
          }} />
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1B4D3D 0%, #2D6A4F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            marginBottom: '12px'
          }}>
            Payment History
          </h1>
          <p style={{
            color: '#5A6E6A',
            fontSize: '16px',
            fontWeight: '400',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Track and manage all your transactions in one place
          </p>
        </div>

        {/* Stats Card */}
        {!loading && !error && payments.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '20px 28px',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.03)',
            border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#8A9B97',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                Total Spent
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1B4D3D',
                letterSpacing: '-0.02em'
              }}>
                LKR {totalSpent.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#8A9B97',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                Total Transactions
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1B4D3D',
                letterSpacing: '-0.02em'
              }}>
                {payments.length}
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#8A9B97',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                Completed Payments
              </p>
              <p style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2E7D32',
                letterSpacing: '-0.02em'
              }}>
                {payments.filter(p => p.status === 'Paid').length}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3px solid #E2E8F0',
              borderTopColor: '#1B4D3D',
              margin: '0 auto 20px',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: '#5A6E6A', fontSize: '15px', fontWeight: '500' }}>
              Loading your payment history...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid rgba(229, 62, 62, 0.2)'
          }}>
            <span style={{
              fontSize: '48px',
              display: 'block',
              marginBottom: '16px'
            }}>⚠️</span>
            <p style={{ color: '#C62828', fontSize: '15px', fontWeight: '500' }}>
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && payments.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '60px 24px',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#F1F5F9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ fontSize: '36px' }}>📭</span>
            </div>
            <p style={{ color: '#1B4D3D', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No payment records found
            </p>
            <p style={{ color: '#8A9B97', fontSize: '14px' }}>
              Your transaction history will appear here once you make a payment
            </p>
          </div>
        )}

        {/* Payment List */}
        {!loading && !error && payments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {payments.map((item, idx) => {
              const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Pending;
              const isHovered = hoveredId === item._id;
              
              return (
                <div
                  key={item._id}
                  onMouseEnter={() => setHoveredId(item._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px 24px',
                    transition: 'all 0.25s ease',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: isHovered 
                      ? '0 12px 30px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.02)' 
                      : '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    {/* Left Section */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#1B4D3D',
                          letterSpacing: '-0.02em'
                        }}>
                          LKR {item.amount.toLocaleString()}
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: statusStyle.bg,
                          padding: '4px 12px',
                          borderRadius: '40px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: statusStyle.color
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            background: statusStyle.dot,
                            borderRadius: '50%',
                            display: 'inline-block'
                          }} />
                          {statusStyle.label}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        rowGap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A9B97" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span style={{ fontSize: '13px', color: '#5A6E6A' }}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A9B97" strokeWidth="1.8">
                            <rect x="2" y="6" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                          <span style={{ fontSize: '13px', color: '#5A6E6A' }}>
                            {item.paymentMethod}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A9B97" strokeWidth="1.8">
                            <path d="M4 4v16h16V8l-6-4H4z" />
                            <line x1="14" y1="4" x2="14" y2="8" x3="20" y3="8" />
                          </svg>
                          <span style={{ fontSize: '13px', color: '#5A6E6A' }}>
                            {item.referenceId ? `Ref: ${item.referenceId.slice(0, 12)}...` : (item.description || 'No reference')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Chevron */}
                    <div style={{
                      color: '#C5D0CC',
                      transition: 'transform 0.2s ease, color 0.2s ease',
                      transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        {!loading && !error && payments.length > 0 && (
          <p style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#8A9B97',
            marginTop: '32px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '24px'
          }}>
            This is a record of your payment transactions.
            <br />
            For any questions, please contact support.
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;