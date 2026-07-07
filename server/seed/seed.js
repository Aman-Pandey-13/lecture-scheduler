const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); 

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user"); 

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existingAdmin = await User.findOne({ role: "Admin" });
  if (existingAdmin) {
    console.log("Admin user already exists:", existingAdmin.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = new User({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "Admin",
  });

  await adminUser.save();
  console.log("Admin user created successfully:", adminUser.email);

  await mongoose.disconnect();
};

seedAdmin()
  .then(() => {
    console.log("Admin seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Admin seeding failed:", err);
    process.exit(1);
  });
