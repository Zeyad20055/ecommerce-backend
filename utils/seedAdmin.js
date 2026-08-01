// utils/seedAdmin.js
// One-off script to create the first admin account. Run with:
//   node utils/seedAdmin.js "Admin Name" admin@example.com "StrongPass123"
// The password is hashed automatically by the Admin model's pre-save hook.

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const seed = async () => {
  const [name, email, password] = process.argv.slice(2);

  if (!name || !email || !password) {
    console.log('Usage: node utils/seedAdmin.js "Admin Name" admin@example.com "StrongPass123"');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`An admin with email ${email} already exists.`);
    process.exit(0);
  }

  const admin = await Admin.create({ name, email, password, role: 'superadmin' });
  console.log(`Admin created: ${admin.email}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
