// Manual admin creation script
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/lib/models/Admin.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/capstone-wool";

async function createAdmin(name, email, password, role = 'Admin') {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ Admin with email ${email} already exists`);
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newAdmin.save();
    console.log(`✅ Admin created successfully!`);
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   Password: ${password} (remember to change this!)`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    mongoose.connection.close();
  }
}

// Usage examples:
// To create an admin, run one of these commands:

// Create a new admin (modify the details below)
const adminDetails = {
  name: "Your Admin Name",
  email: "youradmin@woolstore.com", 
  password: "secure-password-123",
  role: "Admin"
};

console.log("🔧 Admin Creation Tool");
console.log("======================");
console.log("To create a new admin, modify the adminDetails object above and run this script.");
console.log("Current admin details to be created:");
console.log(adminDetails);
console.log("");
console.log("Do you want to create this admin? (Uncomment the line below to proceed)");

// Uncomment the line below to actually create the admin
// createAdmin(adminDetails.name, adminDetails.email, adminDetails.password, adminDetails.role);

console.log("Script completed without creating admin (line was commented out for safety)");