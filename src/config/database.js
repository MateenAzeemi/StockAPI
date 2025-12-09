const mongoose = require("mongoose");

async function connectDB() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 2) {
    // Wait for connection to complete
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
      mongoose.connection.once('error', reject);
    });
  }

  try {
    // Disable mongoose buffering globally (required for serverless)
    mongoose.set('bufferCommands', false);
    
    // Set connection options for serverless environments
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log("✅ MongoDB Connected");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

module.exports = connectDB;
