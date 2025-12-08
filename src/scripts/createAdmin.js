/**
 * Script to create first admin user
 * Run: node src/scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const connectDB = require('../config/database');

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Admin user data
    const adminData = {
      email: process.env.ADMIN_EMAIL || 'admin@stockmarket.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: process.env.ADMIN_NAME || 'Admin User',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', adminData.email);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

