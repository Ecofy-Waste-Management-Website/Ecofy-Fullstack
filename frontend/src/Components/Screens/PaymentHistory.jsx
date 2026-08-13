import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";

const STATUS_STYLES = {
  Paid:     { badge: "bg-green-100 text-green-700",  dot: "bg-green-600" },
  Pending:  { badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-500" },
  Failed:   { badge: "bg-red-100 text-red-700",      dot: "bg-red-600" },
  Refunded: { badge: "bg-blue-100 text-blue-700",    dot: "bg-blue-600" },
};

const Icon = ({ name, className = "h-5 w-5" }) => {
  const icons = {
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    creditCard: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />,
    receipt: <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m-5.25-.75h.008v.008H9.75V7.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.5 4.5h.008v.008h-.008V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
    inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l3.75-6.375A1.5 1.5 0 017.298 4.5h9.404a1.5 1.5 0 011.298 1.125L21.75 12M2.25 12v6a1.5 1.5 0 001.5 1.5h16.5a1.5 1.5 0 001.5-1.5v-6M2.25 12h5.11a1.5 1.5 0 011.334.813l.532 1.041a1.5 1.5 0 001.334.813h3.878a1.5 1.5 0 001.334-.813l.532-1.041a1.5 1.5 0 011.334-.813h5.11" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      {icons[name]}
    </svg>
  );
};

/**
 * PaymentHistory — pops up over the dashboard instead of navigating away.
 * Usage: <PaymentHistory isOpen={showPaymentHistory} onClose={() => setShowPaymentHistory(false)} />
 */
function PaymentHistory({ isOpen, onClose }) {
  const { user, isLoaded } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !isLoaded || !user) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
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
  }, [isOpen, isLoaded, user]);

  if (!isOpen) return null;

  const totalSpent = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#06a63e]/10">
              <Icon name="creditCard" className="h-5 w-5 text-[#06a63e]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-500">Your transactions in one place</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 bg-gray-50 p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close payment history"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!loading && !error && payments.length > 0 && (
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: "creditCard", label: "Total Spent", value: `LKR ${totalSpent.toLocaleString()}`, bg: "bg-blue-50", color: "text-blue-600" },
                { icon: "receipt", label: "Transactions", value: payments.length, bg: "bg-purple-50", color: "text-purple-600" },
                { icon: "clock", label: "Completed", value: payments.filter((p) => p.status === 'Paid').length, bg: "bg-green-50", color: "text-green-600" },
              ].map(({ icon, label, value, bg, color }) => (
                <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${bg}`}>
                    <Icon name={icon} className={`h-4 w-4 ${color}`} />
                  </div>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                  <p className="mt-0.5 text-lg font-black text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#06a63e]" />
              <p className="text-sm font-medium text-gray-500">Loading your payment history…</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <Icon name="alert" className="mx-auto mb-2 h-7 w-7 text-red-600" />
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && payments.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Icon name="inbox" className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-800">No payment records found</p>
              <p className="mt-1 text-xs text-gray-500">Your transaction history will appear here once you make a payment.</p>
            </div>
          )}

          {!loading && !error && payments.length > 0 && (
            <div className="space-y-2.5">
              {payments.map((item) => {
                const style = STATUS_STYLES[item.status] || STATUS_STYLES.Pending;
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-base font-black text-gray-900">LKR {item.amount.toLocaleString()}</span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {item.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Icon name="calendar" className="h-3.5 w-3.5" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Icon name="creditCard" className="h-3.5 w-3.5" />
                        {item.paymentMethod}
                      </span>
                      <span className="flex items-center gap-1.5 truncate">
                        <Icon name="tag" className="h-3.5 w-3.5 shrink-0" />
                        {item.referenceId ? `Ref: ${item.referenceId.slice(0, 12)}…` : (item.description || 'No reference')}
                      </span>
                    </div>
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

export default PaymentHistory;