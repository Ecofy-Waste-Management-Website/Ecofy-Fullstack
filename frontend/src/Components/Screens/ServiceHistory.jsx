import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  Cancelled: "bg-gray-100 text-gray-600",
  Paid: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-blue-100 text-blue-700",
};

const TYPE_STYLES = {
  Payment: "bg-blue-50 text-blue-700",
  Service: "bg-purple-50 text-purple-700",
  Booking: "bg-amber-50 text-amber-700",
};

const fieldLabelMap = {
  serviceName: 'Service name', serviceType: 'Service type', scheduledDate: 'Scheduled date',
  completedDate: 'Completed date', technicianName: 'Technician', notes: 'Notes', cost: 'Cost',
  paymentMethod: 'Payment method', currency: 'Currency', description: 'Description', paidAt: 'Paid at',
  amount: 'Amount', title: 'Title', subtitle: 'Subtitle', status: 'Status', location: 'Location',
  service_type: 'Service type', waste_category: 'Waste category', customer_name: 'Customer name',
  customer_email: 'Customer email', customer_phone: 'Customer phone', assignedStaff: 'Assigned staff',
  pickupPin: 'Pickup PIN', scheduled_date: 'Scheduled date', completedAt: 'Completed at', createdAt: 'Created at',
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'number') return `LKR ${value.toLocaleString()}`;
  return value;
};

const formatValue = (key, value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (['scheduledDate', 'completedDate', 'paidAt', 'createdAt', 'completedAt', 'scheduled_date'].includes(key)) return formatDateTime(value);
  if (key === 'amount' || key === 'cost') return formatCurrency(value);
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const Icon = ({ name, className = "h-5 w-5" }) => {
  const icons = {
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
    inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l3.75-6.375A1.5 1.5 0 017.298 4.5h9.404a1.5 1.5 0 011.298 1.125L21.75 12M2.25 12v6a1.5 1.5 0 001.5 1.5h16.5a1.5 1.5 0 001.5-1.5v-6M2.25 12h5.11a1.5 1.5 0 011.334.813l.532 1.041a1.5 1.5 0 001.334.813h3.878a1.5 1.5 0 001.334-.813l.532-1.041a1.5 1.5 0 011.334-.813h5.11" />,
    clipboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3-14.15v14.15A2.25 2.25 0 0113.5 20.25h-9A2.25 2.25 0 012.25 18V6.75A2.25 2.25 0 014.5 4.5h4.5m6 0v-.75A2.25 2.25 0 0012.75 1.5h-1.5A2.25 2.25 0 009 3.75v.75m6 0H9" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

/**
 * ServiceHistory — pops up over the dashboard. Two layers:
 * 1) list view of every order/service/payment
 * 2) tapping an item pushes to a detail view within the same modal (back arrow returns to the list)
 * Usage: <ServiceHistory isOpen={showServiceHistory} onClose={() => setShowServiceHistory(false)} />
 */
function ServiceHistory({ isOpen, onClose }) {
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState([]);
  const [totals, setTotals] = useState({ payments: 0, services: 0, bookings: 0, items: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!isOpen || !isLoaded || !user) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/users/admin/${user.id}/history`);
        if (!res.ok) throw new Error('Failed to fetch order history');
        const data = await res.json();
        setHistory(data.timeline || []);
        setTotals(data.totals || { payments: 0, services: 0, bookings: 0, items: 0 });
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen, isLoaded, user]);

  // Reset to list view every time the modal is reopened
  useEffect(() => {
    if (isOpen) setSelectedItem(null);
  }, [isOpen]);

  const selectedRaw = selectedItem?.raw || null;

  const detailRows = useMemo(() => {
    if (!selectedRaw) return [];
    const preferredKeys = selectedItem?.type === 'Payment'
      ? ['status', 'amount', 'currency', 'paymentMethod', 'description', 'paidAt', 'createdAt']
      : selectedItem?.type === 'Service'
        ? ['status', 'serviceName', 'serviceType', 'scheduledDate', 'completedDate', 'technicianName', 'notes', 'cost']
        : ['status', 'service_type', 'waste_category', 'customer_name', 'customer_email', 'customer_phone', 'location', 'scheduled_date', 'completedAt', 'assignedStaff', 'pickupPin', 'createdAt'];

    const entries = preferredKeys.filter((key) => selectedRaw[key] !== undefined).map((key) => ({ key, value: selectedRaw[key] }));
    const seenKeys = new Set(entries.map((entry) => entry.key));
    Object.entries(selectedRaw).forEach(([key, value]) => {
      if (seenKeys.has(key) || key === '__v' || key === '_id') return;
      entries.push({ key, value });
    });
    return entries;
  }, [selectedItem, selectedRaw]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-2xl max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            {selectedItem ? (
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#06a63e]/10 text-[#06a63e] hover:bg-[#06a63e]/20"
                aria-label="Back to order history list"
              >
                <Icon name="back" className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#06a63e]/10">
                <Icon name="clipboard" className="h-5 w-5 text-[#06a63e]" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-black text-gray-900">
                {selectedItem ? selectedItem.title : 'Order History'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedItem ? (selectedItem.subtitle || `${selectedItem.type} details`) : 'Bookings, services, and payments'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-gray-50 p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close order history"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!selectedItem ? (
            <>
              {!loading && !error && (
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Payments", value: totals.payments, color: "text-blue-600" },
                    { label: "Services", value: totals.services, color: "text-purple-600" },
                    { label: "Bookings", value: totals.bookings, color: "text-amber-600" },
                    { label: "Total items", value: totals.items, color: "text-green-600" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                      <p className={`mt-1 text-xl font-black ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {loading && (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#06a63e]" />
                  <p className="text-sm font-medium text-gray-500">Loading order history…</p>
                </div>
              )}

              {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && history.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                    <Icon name="inbox" className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No order history found.</p>
                </div>
              )}

              {!loading && !error && history.length > 0 && (
                <div className="space-y-2.5">
                  {history.map((item) => {
                    const typeStyle = TYPE_STYLES[item.type] || "bg-gray-100 text-gray-600";
                    const statusStyle = STATUS_STYLES[item.status] || "bg-gray-100 text-gray-600";
                    return (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition hover:border-[#06a63e]/30 hover:bg-[#06a63e]/5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${typeStyle}`}>{item.type}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle}`}>{item.status || 'Unknown'}</span>
                          </div>
                          <p className="truncate text-sm font-semibold text-gray-800">{item.title}</p>
                          <p className="truncate text-xs text-gray-400">{item.subtitle || 'No additional details available'}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-semibold text-gray-500">{formatDateTime(item.date)}</p>
                          {item.amount !== null && item.amount !== undefined && item.amount !== '' && (
                            <p className="mt-1 text-sm font-black text-gray-900">{formatCurrency(item.amount)}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.key} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{fieldLabelMap[row.key] || row.key.replace(/_/g, ' ')}</p>
                  <p className="mt-1.5 whitespace-pre-wrap break-words text-sm font-semibold text-gray-800">{formatValue(row.key, row.value)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceHistory;