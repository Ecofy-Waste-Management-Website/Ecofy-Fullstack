import React, { useEffect, useMemo, useState } from 'react';

// ===== STYLES (matched to Dashboard.jsx) =====
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  "En Route": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
  Delayed: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
  Paid: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-blue-100 text-blue-700",
};

const TYPE_STYLES = {
  Booking: "bg-orange-50 text-orange-600",
  Payment: "bg-emerald-50 text-emerald-600",
};

const fieldLabelMap = {
  service_type: 'Service type',
  waste_category: 'Waste category',
  location: 'Location',
  scheduled_date: 'Scheduled date',
  status: 'Status',
  customer_name: 'Customer name',
  customer_email: 'Customer email',
  customer_phone: 'Customer phone',
  assignedStaff: 'Assigned staff',
  pickupPin: 'Pickup PIN',
  notes: 'Notes',
  completedAt: 'Completed at',
  createdAt: 'Created at',
  payment_method: 'Payment method',
  payment_date: 'Payment date',
  amount: 'Amount',
  reference: 'Reference',
  description: 'Description',
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
  if (['scheduled_date', 'completedAt', 'createdAt', 'payment_date'].includes(key)) return formatDateTime(value);
  if (key === 'amount') return formatCurrency(value);
  if (key === 'assignedStaff' && typeof value === 'string' && value.startsWith('user_')) return 'Assigned Staff Member';
  if (typeof value === 'object') {
    if (Array.isArray(value)) return `${value.length} update${value.length === 1 ? '' : 's'}`;
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

// preferred key order for the detail panel, per record type
const PREFERRED_KEYS = {
  Booking: ['status', 'service_type', 'waste_category', 'location', 'scheduled_date', 'assignedStaff', 'pickupPin', 'notes', 'completedAt', 'createdAt'],
  Payment: ['status', 'amount', 'payment_method', 'payment_date', 'reference', 'description', 'createdAt'],
};

/**
 * ServiceHistory renders as a modal (matching the styling of Dashboard's other
 * modals) rather than fetching its own data from a separate endpoint. It is
 * fed the bookings/payments Dashboard has already loaded, which avoids the
 * broken `/users/admin/:id/history` request that was causing "failed to
 * fetch" errors here.
 */
export default function ServiceHistory({ isOpen, onClose, bookings = [], payments = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const history = useMemo(() => {
    const bookingItems = bookings.map((b) => ({
      id: b._id,
      type: 'Booking',
      title: `${b.service_type || 'Service'}${b.waste_category ? ` — ${b.waste_category}` : ''}`,
      subtitle: b.location || 'No location provided',
      date: b.scheduled_date || b.createdAt,
      status: b.status || 'Pending',
      amount: null,
      raw: b,
    }));
    const paymentItems = payments.map((p) => ({
      id: p._id,
      type: 'Payment',
      title: p.payment_method || 'Online Payment',
      subtitle: p.description || (p.reference ? `Ref: ${p.reference}` : 'Payment transaction'),
      date: p.payment_date || p.createdAt,
      status: p.status || 'Paid',
      amount: p.amount,
      raw: p,
    }));
    return [...bookingItems, ...paymentItems]
      .filter((item) => item.id)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [bookings, payments]);

  useEffect(() => {
    if (!isOpen) { setSelectedItem(null); return; }
    setSelectedItem((current) => {
      if (current) {
        const stillThere = history.find((h) => h.id === current.id && h.type === current.type);
        if (stillThere) return stillThere;
      }
      return history[0] || null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, history]);

  const selectedRaw = selectedItem?.raw || null;

  const detailRows = useMemo(() => {
    if (!selectedRaw || !selectedItem) return [];
    const preferredKeys = PREFERRED_KEYS[selectedItem.type] || [];
    const entries = preferredKeys.filter((key) => selectedRaw[key] !== undefined).map((key) => ({ key, value: selectedRaw[key] }));
    const seenKeys = new Set(entries.map((e) => e.key));
    Object.entries(selectedRaw).forEach(([key, value]) => {
      if (seenKeys.has(key) || key === '__v' || key === '_id' || key === 'timeline') return;
      entries.push({ key, value });
    });
    return entries;
  }, [selectedItem, selectedRaw]);

  const timeline = Array.isArray(selectedRaw?.timeline) ? selectedRaw.timeline : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#06a63e]">History</p>
            <h2 className="mt-1 text-xl font-black text-gray-900">Order &amp; Payment History</h2>
            <p className="mt-1 text-sm text-gray-500">Every booking and payment on your account, in one place.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            Close
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 px-6 pt-5">
          {[
            { label: 'Bookings', value: bookings.length },
            { label: 'Payments', value: payments.length },
            { label: 'Total items', value: history.length },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#06a63e]/15 bg-[#06a63e]/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
              <p className="mt-1 text-xl font-black text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden px-6 py-5">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <span className="text-2xl">📭</span>
              </div>
              <p className="text-sm font-medium text-gray-500">No order or payment history yet.</p>
            </div>
          ) : (
            <div className="grid h-full grid-cols-1 gap-5 overflow-hidden lg:grid-cols-[1.4fr_1fr]">
              {/* List */}
              <div className="space-y-2 overflow-y-auto pr-1">
                {history.map((item) => {
                  const isSelected = selectedItem?.id === item.id && selectedItem?.type === item.type;
                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected ? "border-[#06a63e]/40 bg-[#06a63e]/5" : "border-gray-100 bg-gray-50 hover:border-[#06a63e]/30 hover:bg-[#06a63e]/5"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TYPE_STYLES[item.type]}`}>{item.type}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[item.status] || "bg-gray-100 text-gray-600"}`}>{item.status}</span>
                        </div>
                        <p className="truncate text-sm font-semibold text-gray-800">{item.title}</p>
                        <p className="truncate text-xs text-gray-400">{item.subtitle}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-semibold text-gray-500">{formatDateTime(item.date)}</p>
                        {item.amount !== null && item.amount !== undefined && (
                          <p className="mt-1 text-xs font-black text-gray-900">{formatCurrency(item.amount)}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail panel */}
              <div className="overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
                {selectedItem ? (
                  <>
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TYPE_STYLES[selectedItem.type]}`}>{selectedItem.type}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[selectedItem.status] || "bg-gray-100 text-gray-600"}`}>{selectedItem.status}</span>
                    </div>
                    <h3 className="text-base font-black text-gray-900">{selectedItem.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">{selectedItem.subtitle}</p>

                    <div className="mt-4 space-y-2">
                      {detailRows.map((row) => (
                        <div key={row.key} className="rounded-xl border border-gray-100 bg-white p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{fieldLabelMap[row.key] || row.key.replace(/_/g, ' ')}</p>
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-gray-800">{formatValue(row.key, row.value)}</p>
                        </div>
                      ))}
                    </div>

                    {timeline.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Timeline ({timeline.length})</p>
                        <div className="max-h-40 space-y-2 overflow-y-auto">
                          {timeline.map((e, i) => (
                            <div key={i} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3">
                              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#06a63e]" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">{e.event || 'Update'}</p>
                                <p className="text-xs text-gray-400">{e.time ? formatDateTime(e.time) : '—'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Select an item from the list to see its details.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}