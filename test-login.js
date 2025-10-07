import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/lib/models/Admin.js";
import Customer from "./src/lib/models/Customer.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/capstone-wool";

const testLogin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Test admin login
    const adminEmail = "catherine@woolstore.com";
    const adminPassword = "admin123";
    
    console.log(`\n🔍 Looking for admin: ${adminEmail}`);
    const admin = await Admin.findOne({ email: adminEmail });
    
    if (admin) {
      console.log("✅ Admin found:", {
        name: admin.name,
        email: admin.email,
        role: admin.role,
        hasPassword: !!admin.password
      });
      
      // Test password
      const passwordMatch = await bcrypt.compare(adminPassword, admin.password);
      console.log(`🔐 Password match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log("❌ Admin not found");
    }

    // Test customer login
    const customerEmail = "alice@example.com";
    const customerPassword = "password123";
    
    console.log(`\n🔍 Looking for customer: ${customerEmail}`);
    const customer = await Customer.findOne({ email: customerEmail });
    
    if (customer) {
      console.log("✅ Customer found:", {
        name: customer.name,
        email: customer.email,
        hasPassword: !!customer.password
      });
      
      // Test password
      const passwordMatch = await bcrypt.compare(customerPassword, customer.password);
      console.log(`🔐 Password match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log("❌ Customer not found");
    }

    // Count total records
    const adminCount = await Admin.countDocuments();
    const customerCount = await Customer.countDocuments();
    console.log(`\n📊 Database stats:`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Customers: ${customerCount}`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    mongoose.connection.close();
  }
};

testLogin();