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

const serviceRequestRouter = require("./Route/ServiceRequestRoute");
const adminRoutes = require("./Route/adminRoutes");
const slaAnalyticsRouter = require("./Route/slaAnalyticsRoute");
const serviceMonitoringRouter = require("./Route/serviceMonitoringRoute"); 
const authTestRouter = require("./Route/authTestRoute");
const app = express();


const server = http.createServer(app);   

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("📡 Dashboard client connected");
  ws.on("close", () => console.log("📡 Dashboard client disconnected"));
});

// Make wss accessible inside route handlers via req.app.get("wss")
app.set("wss", wss);

//Middleware 
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
})); // Clerk v1+: must come before any protected routes

app.use("/users",userRouter);

app.use("/service-history", serviceHistoryRouter);
app.use("/payment-history", paymentHistoryRouter);
app.use("/notifications", notificationRouter);

app.use("/bookings", serviceRequestRouter);
app.use("/admin", adminRoutes);
app.use("/sla-analytics", slaAnalyticsRouter);
app.use("/service-monitoring", serviceMonitoringRouter);
app.use("/staff", staffRouter);
app.use("/auth-test", authTestRouter);


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

const PORT = process.env.PORT || 5000;
server.listen(PORT , () =>{
  console.log(`Server is running ! ${PORT}`);
});