// routes/stripe.route.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const PaymentHistory = require("../Model/PaymentHistoryModel");
const Notification = require("../Model/NotificationModel");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SERVICE_PRICES = {
  Household:        150000,
  Commercial:       350000,
  Bulk:             250000,
  Garden:           120000,
  "Drain Cleaning": 200000,
};

router.post("/create-payment-intent", async (req, res) => {
  const { service_type } = req.body;

  const amount = SERVICE_PRICES[service_type];
  if (!amount) return res.status(400).json({ error: "Invalid service type" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "lkr",
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret, amount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/confirm-payment", async (req, res) => {
  const {
    paymentIntentId,
    service_type,
    waste_category,
    location,
    scheduled_date,
    clerkId,   // ← renamed from user_id to be explicit
    email,
  } = req.body;

  try {
    // 1. Verify payment actually succeeded on Stripe's side
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not verified by Stripe" });
    }

    const amountLKR = paymentIntent.amount / 100;

    // 2. Save to PaymentHistory (Mongoose)
    await PaymentHistory.create({
      clerkId,
      email,
      amount:        amountLKR,
      currency:      "LKR",
      status:        "Paid",
      paymentMethod: "Card",
      description:   `${service_type} – ${waste_category} on ${scheduled_date} at ${location}`,
      referenceId:   paymentIntentId,
      paidAt:        new Date(),
    });

    // 3. Save Notification (Mongoose)
    await Notification.create({
      clerkId,
      title:   "Payment Successful ✅",
      message: `Your payment of LKR ${amountLKR.toLocaleString()} for ${service_type} service on ${scheduled_date} is confirmed.`,
      type:    "Success",
      isRead:  false,
    });

    res.json({ success: true, amount: amountLKR });

  } catch (err) {
    console.error("Confirm payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;