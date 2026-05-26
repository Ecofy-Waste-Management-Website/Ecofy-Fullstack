const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const { clerkMiddleware } = require('@clerk/express');

const userRouter = require("./Route/UserRoute")
const staffRouter = require("./Route/staffRoute");
const serviceHistoryRouter = require("./Route/ServiceHistoryRoute");
const paymentHistoryRouter = require("./Route/PaymentHistoryRoute");
const notificationRouter = require("./Route/NotificationRoute.js");
const inquiryRouter = require("./Route/inquiryRoute");
const serviceRequestRouter = require("./Route/ServiceRequestRoute");
const adminRoutes = require("./Route/adminRoutes");
const slaAnalyticsRouter = require("./Route/slaAnalyticsRoute");
const analyticsRouter = require("./Route/analyticsRoute");
const serviceMonitoringRouter = require("./Route/serviceMonitoringRoute"); 
const authTestRouter = require("./Route/authTestRoute");
const stripeRoute = require("./Route/stripe.route");
const chatbotRouter = require("./Route/chatbotRoute");
const blogRoute = require("./Route/ContentBlogRoute");
const app = express();


const server = http.createServer(app);   

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("📡 Dashboard client connected");
  ws.on("close", () => console.log("📡 Dashboard client disconnected"));
});

wss.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn("WebSocket server could not bind to the requested port because it is already in use.");
    return;
  }

  throw err;
});

// Make wss accessible inside route handlers via req.app.get("wss")
app.set("wss", wss);

//Middleware 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Register Clerk middleware only when keys are available.
// This prevents global 500s on public routes when env vars are missing.
const clerkPublishableKey =
  process.env.CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (clerkSecretKey) {
  const clerkOptions = {
    secretKey: clerkSecretKey,
    ...(clerkPublishableKey ? { publishableKey: clerkPublishableKey } : {}),
  };

  app.use(clerkMiddleware(clerkOptions)); // Clerk v1+: should come before protected routes
} else {
  console.warn(
    "Clerk middleware disabled: missing CLERK_SECRET_KEY"
  );
}

app.use("/users",userRouter);
app.use("/service-history", serviceHistoryRouter);
app.use("/payment-history", paymentHistoryRouter);
app.use("/notifications", notificationRouter);
app.use("/inquiries", inquiryRouter);
app.use("/bookings", serviceRequestRouter);
app.use("/admin", adminRoutes);
app.use("/sla-analytics", slaAnalyticsRouter);
app.use("/analytics", analyticsRouter);
app.use("/service-monitoring", serviceMonitoringRouter);
app.use("/staff", staffRouter);
app.use("/auth-test", authTestRouter);
app.use("/api/stripe", stripeRoute);
app.use("/chatbot", chatbotRouter);
app.use("/blog", blogRoute);

mongoose.connect(process.env.MONGO_URI, {
  family: 4,                        // Force IPv4 – avoids SRV/DNS lookup failures
  serverSelectionTimeoutMS: 10000,  // Timeout server selection after 10s
  socketTimeoutMS: 45000,           // Close sockets after 45s of inactivity
  heartbeatFrequencyMS: 10000,      // Check connection health every 10s
  retryWrites: true,
  retryReads: true,
})
.then(()=> console.log("connected to MongoDB"))
.catch((err)=> console.log(err));

const BASE_PORT = Number(process.env.PORT) || 5000;

const listenOnPort = (port) => {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is already in use. Retrying on ${port + 1}...`);
      listenOnPort(port + 1);
      return;
    }

    throw err;
  });

  server.listen(port, () => {
    console.log(`Server is running ! ${port}`);
  });
};

listenOnPort(BASE_PORT);