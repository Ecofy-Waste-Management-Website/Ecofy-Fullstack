// src/Components/Screens/PaymentModal.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SERVICE_PRICES = {
  Household:        1500,
  Commercial:       3500,
  Bulk:             2500,
  Garden:           1200,
  "Drain Cleaning": 2000,
};

// ── Inner form (must be inside <Elements>) ────────────────────────────────────
function CheckoutForm({ bookingDetails, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError("");

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setPaying(false);
      return;
    }

    // Payment success
    onSuccess?.();
    onClose();
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      {/* Booking Summary */}
      <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/60 px-4 py-3 text-sm text-emerald-800 space-y-1">
        <p className="font-semibold text-gray-700 mb-2">Booking Summary</p>
        <div className="flex justify-between">
          <span className="text-gray-500">Service</span>
          <span className="font-medium">{bookingDetails.service_type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Category</span>
          <span className="font-medium">{bookingDetails.waste_category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Location</span>
          <span className="font-medium truncate max-w-[180px]">{bookingDetails.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span className="font-medium">{bookingDetails.scheduled_date}</span>
        </div>
        <div className="flex justify-between border-t border-emerald-200 pt-2 mt-1">
          <span className="font-semibold text-emerald-700">Total</span>
          <span className="font-bold text-emerald-700">
            LKR {SERVICE_PRICES[bookingDetails.service_type]?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stripe Card Form */}
      <div className="rounded-xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm p-3">
        <PaymentElement />
      </div>

      {error && (
        <div className="rounded-lg px-4 py-2.5 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300/80 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100/50 transition bg-white/30 backdrop-blur-sm"
        >
          Skip for now
        </button>
        <button
          type="submit"
          disabled={paying || !stripe}
          className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {paying ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing…
            </span>
          ) : (
            `Pay LKR ${SERVICE_PRICES[bookingDetails.service_type]?.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
}

// ── Main PaymentModal ─────────────────────────────────────────────────────────
export default function PaymentModal({ isOpen, onClose, onSuccess, bookingDetails }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState("");

  useEffect(() => {
    if (!isOpen || !bookingDetails?.service_type) return;

    const fetchIntent = async () => {
      setLoadingIntent(true);
      setIntentError("");
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service_type: bookingDetails.service_type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to initialise payment.");
        setClientSecret(data.clientSecret);
      } catch (err) {
        setIntentError(err.message);
      } finally {
        setLoadingIntent(false);
      }
    };

    fetchIntent();
  }, [isOpen, bookingDetails?.service_type]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl overflow-hidden animate-[fadeScaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-6">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100/70 backdrop-blur-sm shadow-sm border border-emerald-200/50">
                <svg className="w-5 h-5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Complete Payment</h2>
                <p className="text-xs text-gray-600">Your booking is confirmed — pay to finalize</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Loading intent */}
          {loadingIntent && (
            <div className="flex items-center justify-center py-10 text-sm text-gray-500 gap-2">
              <svg className="animate-spin h-5 w-5 text-emerald-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Setting up payment…
            </div>
          )}

          {/* Intent error */}
          {intentError && (
            <div className="rounded-lg px-4 py-2.5 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
              {intentError}
            </div>
          )}

          {/* Stripe form */}
          {!loadingIntent && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                bookingDetails={bookingDetails}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </Elements>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}