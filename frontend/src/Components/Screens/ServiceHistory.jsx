import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  Completed: { backgroundColor: '#D1FAE5', color: '#065F46' },
  Pending: { backgroundColor: '#FEF3C7', color: '#92400E' },
  'In Progress': { backgroundColor: '#E0E7FF', color: '#3730A3' },
  Cancelled: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  Paid: { backgroundColor: '#D1FAE5', color: '#065F46' },
  Failed: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  Refunded: { backgroundColor: '#DBEAFE', color: '#1D4ED8' },
};

const TYPE_STYLES = {
  Payment: { backgroundColor: '#ECFDF5', color: '#047857' },
  Service: { backgroundColor: '#EFF6FF', color: '#1D4ED8' },
  Booking: { backgroundColor: '#FFF7ED', color: '#C2410C' },
};

const fieldLabelMap = {
  serviceName: 'Service name',
  serviceType: 'Service type',
  scheduledDate: 'Scheduled date',
  completedDate: 'Completed date',
  technicianName: 'Technician',
  notes: 'Notes',
  cost: 'Cost',
  paymentMethod: 'Payment method',
  currency: 'Currency',
  description: 'Description',
  paidAt: 'Paid at',
  amount: 'Amount',
  title: 'Title',
  subtitle: 'Subtitle',
  status: 'Status',
  location: 'Location',
  service_type: 'Service type',
  waste_category: 'Waste category',
  customer_name: 'Customer name',
  customer_email: 'Customer email',
  customer_phone: 'Customer phone',
  assignedStaff: 'Assigned staff',
  pickupPin: 'Pickup PIN',
  scheduled_date: 'Scheduled date',
  completedAt: 'Completed at',
  createdAt: 'Created at',
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'number') return `LKR ${value.toLocaleString()}`;
  return value;
};

const formatValue = (key, value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (key === 'scheduledDate' || key === 'completedDate' || key === 'paidAt' || key === 'createdAt' || key === 'completedAt' || key === 'scheduled_date') {
    return formatDateTime(value);
  }
  if (key === 'amount' || key === 'cost') {
    return formatCurrency(value);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

function ServiceHistory() {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState([]);
  const [totals, setTotals] = useState({ payments: 0, services: 0, bookings: 0, items: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/users/admin/${user.id}/history`);
        if (!res.ok) throw new Error('Failed to fetch order history');

        const data = await res.json();
        setHistory(data.timeline || []);
        setTotals(data.totals || { payments: 0, services: 0, bookings: 0, items: 0 });
        setSelectedItem((current) => {
          if (!current) return data.timeline?.[0] || null;
          return data.timeline?.find((item) => item.id === current.id && item.type === current.type) || data.timeline?.[0] || null;
        });
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isLoaded, user]);

  const selectedRaw = selectedItem?.raw || null;

  const detailRows = useMemo(() => {
    if (!selectedRaw) return [];

    const preferredKeys = selectedItem?.type === 'Payment'
      ? ['status', 'amount', 'currency', 'paymentMethod', 'description', 'paidAt', 'createdAt', 'clerkId', 'email']
      : selectedItem?.type === 'Service'
        ? ['status', 'serviceName', 'serviceType', 'scheduledDate', 'completedDate', 'technicianName', 'notes', 'cost', 'clerkId', 'email']
        : ['status', 'service_type', 'waste_category', 'customer_name', 'customer_email', 'customer_phone', 'location', 'scheduled_date', 'completedAt', 'assignedStaff', 'pickupPin', 'createdAt'];

    const entries = preferredKeys
      .filter((key) => selectedRaw[key] !== undefined)
      .map((key) => ({ key, value: selectedRaw[key] }));

    const seenKeys = new Set(entries.map((entry) => entry.key));
    Object.entries(selectedRaw).forEach(([key, value]) => {
      if (seenKeys.has(key) || key === '__v' || key === '_id') return;
      entries.push({ key, value });
    });

    return entries;
  }, [selectedItem, selectedRaw]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F5FBF6 0%, #EDF7EE 100%)', padding: '32px 20px 48px', fontFamily: "'Red Hat Display', sans-serif" }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px', alignItems: 'end' }}>
          <div>
            <p style={{ margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '11px', fontWeight: 700, color: '#4B7A55' }}>History</p>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#194D25' }}>Order history</h2>
            <p style={{ margin: '8px 0 0', color: '#5E7E64', fontSize: '15px' }}>Review every completed booking, service, and payment in one place.</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Payments', value: totals.payments },
              { label: 'Services', value: totals.services },
              { label: 'Bookings', value: totals.bookings },
              { label: 'Total items', value: totals.items },
            ].map((item) => (
              <div key={item.label} style={{ minWidth: '120px', borderRadius: '20px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(25,77,37,0.08)', padding: '14px 16px', boxShadow: '0 10px 30px rgba(25,77,37,0.06)' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#6B8C71' }}>{item.label}</p>
                <p style={{ margin: '6px 0 0', fontSize: '24px', fontWeight: 700, color: '#194D25' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div style={{ borderRadius: '28px', padding: '72px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(25,77,37,0.08)', boxShadow: '0 16px 40px rgba(25,77,37,0.08)' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 16px', borderRadius: '50%', border: '4px solid #D6E9CA', borderTopColor: '#2D7D46', animation: 'spin 0.9s linear infinite' }} />
            <p style={{ margin: 0, color: '#4B7A55', fontWeight: 600 }}>Loading order history...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && error && (
          <div style={{ borderRadius: '24px', padding: '28px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div style={{ borderRadius: '28px', padding: '72px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.8)', border: '1px dashed rgba(25,77,37,0.18)', color: '#5E7E64' }}>
            No order history found.
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(320px, 0.65fr)', gap: '20px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {history.map((item) => {
                const isSelected = selectedItem?.id === item.id && selectedItem?.type === item.type;
                const typeStyle = TYPE_STYLES[item.type] || { backgroundColor: '#F3F4F6', color: '#374151' };
                const statusStyle = STATUS_STYLES[item.status] || { backgroundColor: '#F3F4F6', color: '#374151' };

                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: '24px',
                      border: isSelected ? '1px solid #2D7D46' : '1px solid rgba(25,77,37,0.08)',
                      background: isSelected ? 'linear-gradient(135deg, rgba(230,248,233,0.95), rgba(255,255,255,0.95))' : 'rgba(255,255,255,0.9)',
                      boxShadow: isSelected ? '0 18px 38px rgba(45,125,70,0.16)' : '0 12px 28px rgba(25,77,37,0.06)',
                      padding: '18px 20px',
                      cursor: 'pointer',
                      transition: 'all 180ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ ...typeStyle, borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{item.type}</span>
                          <span style={{ ...statusStyle, borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>{item.status || 'Unknown'}</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#194D25' }}>{item.title}</h3>
                        <p style={{ margin: '6px 0 0', color: '#5E7E64', fontSize: '14px' }}>{item.subtitle || 'No additional details available'}</p>
                      </div>

                      <div style={{ flexShrink: 0, textAlign: 'right', color: '#5E7E64', fontSize: '13px' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#194D25' }}>{formatDateTime(item.date)}</p>
                        {item.amount !== null && item.amount !== undefined && item.amount !== '' && (
                          <p style={{ margin: '8px 0 0', fontWeight: 700, color: '#194D25' }}>{formatCurrency(item.amount)}</p>
                        )}
                        <p style={{ margin: '10px 0 0', fontSize: '12px', fontWeight: 700, color: '#2D7D46' }}>Click to view details</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <aside style={{ position: 'sticky', top: '20px' }}>
              <div style={{ borderRadius: '28px', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(25,77,37,0.08)', boxShadow: '0 16px 40px rgba(25,77,37,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid rgba(25,77,37,0.08)' }}>
                  <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '11px', fontWeight: 700, color: '#6B8C71' }}>Selected order</p>
                  <h3 style={{ margin: '10px 0 0', fontSize: '22px', fontWeight: 700, color: '#194D25' }}>{selectedItem?.title || 'Choose an order'}</h3>
                  <p style={{ margin: '8px 0 0', color: '#5E7E64', fontSize: '14px' }}>{selectedItem?.subtitle || 'Select any history item to inspect the full record.'}</p>
                </div>

                {selectedItem ? (
                  <div style={{ padding: '20px 22px 24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                      <span style={{ ...(TYPE_STYLES[selectedItem.type] || { backgroundColor: '#F3F4F6', color: '#374151' }), borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{selectedItem.type}</span>
                      <span style={{ ...(STATUS_STYLES[selectedItem.status] || { backgroundColor: '#F3F4F6', color: '#374151' }), borderRadius: '999px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize' }}>{selectedItem.status || 'Unknown'}</span>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {detailRows.map((row) => (
                        <div key={row.key} style={{ borderRadius: '18px', background: '#F8FBF8', border: '1px solid rgba(25,77,37,0.08)', padding: '14px 16px' }}>
                          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B8C71' }}>{fieldLabelMap[row.key] || row.key.replace(/_/g, ' ')}</p>
                          <p style={{ margin: '8px 0 0', fontSize: '14px', fontWeight: 600, color: '#194D25', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formatValue(row.key, row.value)}</p>
                        </div>
                      ))}
                    </div>

                    {selectedRaw?.notes && (
                      <div style={{ marginTop: '12px', borderRadius: '18px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '14px 16px' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#047857' }}>Notes</p>
                        <p style={{ margin: '8px 0 0', color: '#065F46', fontSize: '14px', fontWeight: 600, whiteSpace: 'pre-wrap' }}>{String(selectedRaw.notes)}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '24px 22px 28px', color: '#5E7E64', fontSize: '14px' }}>
                    Pick an item from the history list to see every available detail.
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

      {selectedItem && !loading && !error && history.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Order details"
          onClick={() => setSelectedItem(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10, 30, 14, 0.55)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: '18px', zIndex: 50 }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ width: 'min(920px, 100%)', maxHeight: 'min(88vh, 900px)', overflow: 'auto', borderRadius: '30px', background: '#FFFFFF', boxShadow: '0 30px 80px rgba(0,0,0,0.28)' }}
          >
            <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(25,77,37,0.08)', display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '11px', fontWeight: 700, color: '#6B8C71' }}>Complete details</p>
                <h3 style={{ margin: '10px 0 0', fontSize: '24px', fontWeight: 700, color: '#194D25' }}>{selectedItem.title}</h3>
                <p style={{ margin: '8px 0 0', color: '#5E7E64', fontSize: '14px' }}>{selectedItem.subtitle || 'All available fields for this order are shown below.'}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{ border: 'none', background: '#F3F4F6', color: '#194D25', borderRadius: '999px', width: '40px', height: '40px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            <div style={{ padding: '22px 24px 28px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 320px)', gap: '20px' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                {detailRows.map((row) => (
                  <div key={`modal-${row.key}`} style={{ borderRadius: '20px', background: '#F8FBF8', border: '1px solid rgba(25,77,37,0.08)', padding: '15px 16px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B8C71' }}>{fieldLabelMap[row.key] || row.key.replace(/_/g, ' ')}</p>
                    <p style={{ margin: '8px 0 0', fontSize: '14px', fontWeight: 600, color: '#194D25', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formatValue(row.key, row.value)}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '14px', alignSelf: 'start' }}>
                <div style={{ borderRadius: '22px', padding: '18px', background: 'linear-gradient(135deg, #EAF7EC, #FFFFFF)', border: '1px solid rgba(45,125,70,0.12)' }}>
                  <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '11px', fontWeight: 700, color: '#4B7A55' }}>Record summary</p>
                  <p style={{ margin: '10px 0 0', color: '#194D25', fontWeight: 700, fontSize: '16px' }}>{selectedItem.type} • {selectedItem.status || 'Unknown'}</p>
                  <p style={{ margin: '8px 0 0', color: '#5E7E64', fontSize: '14px' }}>{formatDateTime(selectedItem.date)}</p>
                  {selectedItem.amount !== null && selectedItem.amount !== undefined && selectedItem.amount !== '' && (
                    <p style={{ margin: '12px 0 0', color: '#194D25', fontWeight: 700, fontSize: '18px' }}>{formatCurrency(selectedItem.amount)}</p>
                  )}
                </div>

                <div style={{ borderRadius: '22px', padding: '18px', background: '#F8FBF8', border: '1px solid rgba(25,77,37,0.08)' }}>
                  <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '11px', fontWeight: 700, color: '#6B8C71' }}>Raw id</p>
                  <p style={{ margin: '8px 0 0', color: '#194D25', fontSize: '13px', fontWeight: 600, wordBreak: 'break-word' }}>{selectedItem.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceHistory;