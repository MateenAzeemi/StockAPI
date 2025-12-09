const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = conn.connections[0].readyState === 1;

    console.log("✅ MongoDB Connected (Vercel Cached)");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

module.exports = connectDB;
