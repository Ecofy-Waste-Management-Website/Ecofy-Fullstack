import React, { useState } from 'react';

const STATUS_STYLES = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
  Refunded: "bg-blue-100 text-blue-700",
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * PaymentHistory renders as a modal matching Dashboard's visual language.
 * It reuses the payments Dashboard already fetched via getUserPayments,
 * instead of making its own separate request.
 */
export default function PaymentHistory({ isOpen, onClose, payments = [] }) {
  const [hoveredId, setHoveredId] = useState(null);

  if (!isOpen) return null;

  const totalSpent = payments
    .filter((p) => (p.status || 'Paid') === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedCount = payments.filter((p) => (p.status || 'Paid') === 'Paid').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#06a63e]">Payments</p>
            <h2 className="mt-1 text-xl font-black text-gray-900">Payment History</h2>
            <p className="mt-1 text-sm text-gray-500">Track and review all your transactions.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Stats */}
          {payments.length > 0 && (
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Total Spent', value: `LKR ${totalSpent.toLocaleString()}` },
                { label: 'Transactions', value: payments.length },
                { label: 'Completed', value: completedCount },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-[#06a63e]/15 bg-[#06a63e]/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                  <p className="mt-1 text-xl font-black text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <span className="text-2xl">📭</span>
              </div>
              <p className="text-sm font-medium text-gray-500">No payment records found.</p>
              <p className="text-xs text-gray-400">Your transactions will appear here once you make a payment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map((item, idx) => {
                const status = item.status || 'Paid';
                const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Pending;
                const key = item._id || idx;
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoveredId(key)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
                      hoveredId === key ? "border-[#06a63e]/30 bg-[#06a63e]/5" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black text-gray-900">LKR {(item.amount || 0).toLocaleString()}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyle}`}>{status}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-gray-400">
                        {item.payment_method || 'Online Payment'} · {formatDate(item.payment_date || item.createdAt)}
                        {item.reference ? ` · Ref: ${String(item.reference).slice(0, 12)}...` : item.description ? ` · ${item.description}` : ''}
                      </p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}