import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "./src/lib/models/Product.js";
import Customer from "./src/lib/models/Customer.js";
import Order from "./src/lib/models/Order.js";
import Admin from "./src/lib/models/Admin.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/capstone-wool";

// Dummy Products
const products = [
  {
    name: "Merino Wool Throw",
    description: "Luxurious merino wool throw with premium softness and warmth. Perfect for layering or using as a decorative piece.",
    price: 189.0,
    stock: 25,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Chunky Knit Wool Blanket",
    description: "Handwoven chunky knit blanket made with natural wool, perfect for winter nights and cozy evenings.",
    price: 249.5,
    stock: 15,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Grey Style Wool Throw",
    description: "Simple and chic, this everyday throw will suit any style of home. Made from 100% New Zealand wool.",
    price: 179.0,
    stock: 30,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Alpaca Wool Scarf",
    description: "Ultra-soft alpaca wool scarf with elegant drape. Hypoallergenic and incredibly warm.",
    price: 89.0,
    stock: 45,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Wool Hiking Socks Set",
    description: "Durable merino wool hiking socks with moisture-wicking properties. Set of 3 pairs.",
    price: 45.0,
    stock: 60,
    category: "Accessories", 
    imageUrl: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Oslo Lambswool Throw",
    description: "Woven from soft, warming lambswool, this throw offers a lightweight yet beautifully warm layer.",
    price: 199.0,
    stock: 20,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Cable Knit Wool Cardigan",
    description: "Classic cable knit cardigan in pure wool. Timeless style meets modern comfort.",
    price: 165.0,
    stock: 18,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Wool Felt Hat",
    description: "Handcrafted wool felt hat with classic styling. Water-resistant and durable.",
    price: 75.0,
    stock: 35,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1514327605112-b887c0e61c4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mohair Wool Cushion Cover",
    description: "Luxurious mohair cushion cover with silk blend. Adds texture and warmth to any room.",
    price: 55.0,
    stock: 40,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Wool Blanket - King Size",
    description: "Get cozy with this classic wool blanket in king size. Made with 100% New Zealand wool for generous warmth.",
    price: 320.0,
    stock: 8,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
];

// Minimal customers for testing (optional - users can now register themselves)
const customers = [
  {
    name: "Test Customer",
    email: "test@example.com",
    password: "password123",
    address: { street: "123 Test St", city: "Wellington", country: "New Zealand" },
  },
];

// Essential admin account - DO NOT REMOVE (needed for admin access)
const admins = [
  {
    name: "System Administrator",
    email: "admin@woolstore.com",
    password: "admin123",
    role: "Admin",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear old data
    await Product.deleteMany();
    await Customer.deleteMany();
    await Order.deleteMany();
    await Admin.deleteMany();

    // Hash passwords for customers
    const customersWithHashedPasswords = await Promise.all(
      customers.map(async (customer) => ({
        ...customer,
        password: await bcrypt.hash(customer.password, 10)
      }))
    );

    // Hash passwords for admins
    const adminsWithHashedPasswords = await Promise.all(
      admins.map(async (admin) => ({
        ...admin,
        password: await bcrypt.hash(admin.password, 10)
      }))
    );

    // Insert new data with hashed passwords
    const createdProducts = await Product.insertMany(products);
    const createdCustomers = await Customer.insertMany(customersWithHashedPasswords);
    await Admin.insertMany(adminsWithHashedPasswords);

    // Create minimal test orders
    const orders = [
      {
        customer: createdCustomers[0]._id,
        products: [
          { product: createdProducts[0]._id, quantity: 1 },
          { product: createdProducts[2]._id, quantity: 1 },
        ],
        totalAmount: 189.0 + 179.0, // Merino Wool Throw + Grey Style Wool Throw = 368.0
        status: "Pending",
      },
    ];

    await Order.insertMany(orders);

    console.log("🎉 Dummy data inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    mongoose.connection.close();
  }
};

seedData();
// Run with: node seed.js