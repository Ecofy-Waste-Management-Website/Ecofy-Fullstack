require("dotenv").config();
const mongoose = require("mongoose");
const ServiceRequest = require("./Model/ServiceRequestModel");

const YOUR_CLERK_ID = "user_3BZPEBLT9MyhDaY6mGfkbUNsIKJ";

const locations = [
  "No 12, Galle Road, Colombo 03",
  "No 45, Kandy Road, Nugegoda",
  "No 78, Maharagama Road",
  "No 23, Battaramulla Road",
  "No 56, Dehiwala Road",
  "No 34, Panadura Road",
  "No 89, Moratuwa Road",
  "No 11, Piliyandala Road",
  "No 67, Homagama Road",
  "No 99, Kaduwela Road",
];

const serviceTypes = ["Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"];
const wasteCategories = ["General", "Recyclable", "Hazardous", "Electronic", "Garden"];
const statuses = ["Pending", "Assigned", "In Progress", "En Route"];
const customers = [
  { name: "Kamal Perera", email: "kamal@gmail.com" },
  { name: "Nimal Silva", email: "nimal@gmail.com" },
  { name: "Amara Fernando", email: "amara@gmail.com" },
  { name: "Saman Jayawardena", email: "saman@gmail.com" },
  { name: "Priya Rajapaksa", email: "priya@gmail.com" },
  { name: "Ruwan Bandara", email: "ruwan@gmail.com" },
  { name: "Dilani Wickrama", email: "dilani@gmail.com" },
  { name: "Chamara Dissanayake", email: "chamara@gmail.com" },
  { name: "Sachini Mendis", email: "sachini@gmail.com" },
  { name: "Lasith Malinga", email: "lasith@gmail.com" },
];

const generateTasks = (count) => {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const customer = customers[i % customers.length];
    const scheduledDate = new Date();
    scheduledDate.setHours(8 + (i % 10), (i % 4) * 15, 0, 0);

    tasks.push({
      customer_name: customer.name,
      customer_email: customer.email,
      service_type: serviceTypes[i % serviceTypes.length],
      waste_category: wasteCategories[i % wasteCategories.length],
      location: locations[i % locations.length],
      scheduled_date: scheduledDate,
      status: statuses[i % statuses.length],
      assignedStaff: YOUR_CLERK_ID,
      notes: `Task #${i + 1} - Stress test task`,
      timeline: [],
    });
  }
  return tasks;
};

const seedStressTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete only stress test tasks
    await ServiceRequest.deleteMany({ 
      assignedStaff: YOUR_CLERK_ID,
      notes: /Stress test task/
    });
    console.log("🗑️ Cleared existing stress test tasks");

    const tasks = generateTasks(55);
    await ServiceRequest.insertMany(tasks);
    console.log(`✅ Inserted ${tasks.length} stress test tasks`);

    console.log("🌱 Stress test seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedStressTest();