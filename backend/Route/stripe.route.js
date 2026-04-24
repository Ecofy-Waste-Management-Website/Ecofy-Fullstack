// routes/stripe.route.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SERVICE_PRICES = {
  Household:        150000, // LKR 1,500
  Commercial:       350000, // LKR 3,500
  Bulk:             250000, // LKR 2,500
  Garden:           120000, // LKR 1,200
  "Drain Cleaning": 200000, // LKR 2,000
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

module.exports = router;