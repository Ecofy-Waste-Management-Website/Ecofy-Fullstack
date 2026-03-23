require("dotenv").config();
const mongoose = require("mongoose");
const ServiceRequest = require("./Model/ServiceRequestModel");
const Payment = require("./Model/PaymentModel");

// ── Dummy Service Request Data ───────────────────────
const serviceRequests = [
  {
    customer_name: "Kamal Perera",
    customer_email: "kamal@gmail.com",
    service_type: "Household",
    waste_category: "General",
    location: "Colombo 03",
    scheduled_date: new Date("2026-03-25"),
    status: "Completed",
    notes: "Please collect before 8am",
  },
  {
    customer_name: "Nimal Silva",
    customer_email: "nimal@gmail.com",
    service_type: "Commercial",
    waste_category: "Recyclable",
    location: "Nugegoda",
    scheduled_date: new Date("2026-03-26"),
    status: "In Progress",
    notes: "Large amount of cardboard boxes",
  },
  {
    customer_name: "Amara Fernando",
    customer_email: "amara@gmail.com",
    service_type: "Bulk",
    waste_category: "General",
    location: "Maharagama",
    scheduled_date: new Date("2026-03-27"),
    status: "Pending",
    notes: "Old furniture removal",
  },
  {
    customer_name: "Saman Jayawardena",
    customer_email: "saman@gmail.com",
    service_type: "Garden",
    waste_category: "Garden",
    location: "Battaramulla",
    scheduled_date: new Date("2026-03-28"),
    status: "Assigned",
    notes: "Garden cleanup after storm",
  },
  {
    customer_name: "Priya Rajapaksa",
    customer_email: "priya@gmail.com",
    service_type: "Drain Cleaning",
    waste_category: "Hazardous",
    location: "Dehiwala",
    scheduled_date: new Date("2026-03-29"),
    status: "Delayed",
    notes: "Blocked drain near kitchen",
  },
  {
    customer_name: "Ruwan Bandara",
    customer_email: "ruwan@gmail.com",
    service_type: "Household",
    waste_category: "Electronic",
    location: "Panadura",
    scheduled_date: new Date("2026-03-30"),
    status: "Completed",
    notes: "Old electronics disposal",
  },
  {
    customer_name: "Dilani Wickrama",
    customer_email: "dilani@gmail.com",
    service_type: "Commercial",
    waste_category: "General",
    location: "Colombo 07",
    scheduled_date: new Date("2026-04-01"),
    status: "Pending",
    notes: "Weekly office waste collection",
  },
  {
    customer_name: "Chamara Dissanayake",
    customer_email: "chamara@gmail.com",
    service_type: "Bulk",
    waste_category: "Recyclable",
    location: "Homagama",
    scheduled_date: new Date("2026-04-02"),
    status: "Assigned",
    notes: "Construction waste removal",
  },
  {
    customer_name: "Sachini Mendis",
    customer_email: "sachini@gmail.com",
    service_type: "Household",
    waste_category: "General",
    location: "Piliyandala",
    scheduled_date: new Date("2026-04-03"),
    status: "Completed",
    notes: "Regular weekly pickup",
  },
  {
    customer_name: "Lasith Malinga",
    customer_email: "lasith@gmail.com",
    service_type: "Garden",
    waste_category: "Garden",
    location: "Moratuwa",
    scheduled_date: new Date("2026-04-04"),
    status: "In Progress",
    notes: "Tree trimming waste",
  },
];

// ── Dummy Payment Data ───────────────────────────────
const payments = [
  {
    customer_name: "Kamal Perera",
    customer_email: "kamal@gmail.com",
    amount: 2500,
    payment_method: "Credit Card",
    payment_status: "Completed",
    transaction_ref: "TXN-001-2026",
    service_type: "Household",
    payment_date: new Date("2026-03-25"),
  },
  {
    customer_name: "Nimal Silva",
    customer_email: "nimal@gmail.com",
    amount: 5000,
    payment_method: "Bank Transfer",
    payment_status: "Completed",
    transaction_ref: "TXN-002-2026",
    service_type: "Commercial",
    payment_date: new Date("2026-03-26"),
  },
  {
    customer_name: "Amara Fernando",
    customer_email: "amara@gmail.com",
    amount: 7500,
    payment_method: "Cash",
    payment_status: "Pending",
    transaction_ref: "TXN-003-2026",
    service_type: "Bulk",
    payment_date: new Date("2026-03-27"),
  },
  {
    customer_name: "Saman Jayawardena",
    customer_email: "saman@gmail.com",
    amount: 3000,
    payment_method: "Debit Card",
    payment_status: "Completed",
    transaction_ref: "TXN-004-2026",
    service_type: "Garden",
    payment_date: new Date("2026-03-28"),
  },
  {
    customer_name: "Priya Rajapaksa",
    customer_email: "priya@gmail.com",
    amount: 4500,
    payment_method: "Credit Card",
    payment_status: "Failed",
    transaction_ref: "TXN-005-2026",
    service_type: "Drain Cleaning",
    payment_date: new Date("2026-03-29"),
  },
  {
    customer_name: "Ruwan Bandara",
    customer_email: "ruwan@gmail.com",
    amount: 2000,
    payment_method: "Cash",
    payment_status: "Completed",
    transaction_ref: "TXN-006-2026",
    service_type: "Household",
    payment_date: new Date("2026-03-30"),
  },
  {
    customer_name: "Dilani Wickrama",
    customer_email: "dilani@gmail.com",
    amount: 6000,
    payment_method: "Bank Transfer",
    payment_status: "Pending",
    transaction_ref: "TXN-007-2026",
    service_type: "Commercial",
    payment_date: new Date("2026-04-01"),
  },
  {
    customer_name: "Chamara Dissanayake",
    customer_email: "chamara@gmail.com",
    amount: 8500,
    payment_method: "Credit Card",
    payment_status: "Completed",
    transaction_ref: "TXN-008-2026",
    service_type: "Bulk",
    payment_date: new Date("2026-04-02"),
  },
  {
    customer_name: "Sachini Mendis",
    customer_email: "sachini@gmail.com",
    amount: 2500,
    payment_method: "Debit Card",
    payment_status: "Refunded",
    transaction_ref: "TXN-009-2026",
    service_type: "Household",
    payment_date: new Date("2026-04-03"),
  },
  {
    customer_name: "Lasith Malinga",
    customer_email: "lasith@gmail.com",
    amount: 3500,
    payment_method: "Cash",
    payment_status: "Completed",
    transaction_ref: "TXN-010-2026",
    service_type: "Garden",
    payment_date: new Date("2026-04-04"),
  },
];

// ── Main Seed Function ───────────────────────────────
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await ServiceRequest.deleteMany({});
    await Payment.deleteMany({});
    console.log("🗑️  Cleared existing seed data");

    // Insert new data
    await ServiceRequest.insertMany(serviceRequests);
    console.log("✅ Inserted 10 service requests");

    await Payment.insertMany(payments);
    console.log("✅ Inserted 10 payments");

    console.log("🌱 Database seeding completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();