import mongoose from "mongoose";
import Product from "./src/lib/models/Product.js";
import Customer from "./src/lib/models/Customer.js";
import Order from "./src/lib/models/Order.js";
import Admin from "./src/lib/models/Admin.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/woolstore";

// Dummy Products
const products = [
  {
    name: "Boucle Wool Throw",
    description: "High quality boucle texture throw.",
    price: 279.0,
    stock: 25,
    category: "Home & Living",
    imageUrl: "https://example.com/images/merino-sweater.jpg",
  },
  {
    name: "Chunky Knit Wool Blanket",
    description: "Handwoven chunky knit blanket made with natural wool, perfect for winter nights.",
    price: 249.5,
    stock: 10,
    category: "Home & Living",
    imageUrl: "https://example.com/images/wool-blanket.jpg",
  },
  {
    name: "Grey Style Wool Throw",
    description: "Simple and chic, this everyday throw will suit any style of home.",
    price: 179.0,
    stock: 100,
    category: "Home & Living",
    imageUrl: "https://example.com/images/grey-style-wool-throw.jpg",
  },
   {
    name: "Modern Lifestyle Wool Throw",
    description: "Ultra modern and versatile.",
    price: 279.0,
    stock: 25,
    category: "Home & Living",
    imageUrl: "https://example.com/images/merino-sweater.jpg",
  },
  {
    name: "Forest Wool Blanket",
    description: "Get cosy with this classic Wool Throw in a classic cocoa colourway. The throw is made with 100% New Zealand wool to provide generous warmth and is finished with a twisted fringe.",
    price: 249.5,
    stock: 10,
    category: "Home & Living",
    imageUrl: "https://example.com/images/wool-blanket.jpg",
  },
  {
    name: "Oslo Lambswool Throw",
    description: " Woven from soft, warming lambswool, the throw offers a lightweight yet beautifully warm layer.",
    price: 179.0,
    stock: 100,
    category: "Home & Living",
    imageUrl: "https://example.com/images/wool-yarn.jpg",
  },
];

// Dummy Customers
const customers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    address: { street: "12 Lamb St", city: "Wellington", country: "New Zealand" },
  },
  {
    name: "James Smith",
    email: "james@example.com",
    password: "password123",
    address: { street: "34 Wool Ave", city: "Auckland", country: "New Zealand" },
  },

  {
    name: "John Johnson",
    email: "john@example.com",
    password: "password123",
    address: { street: "12 Lamb St", city: "Wellington", country: "New Zealand" },
  },

  {
    name: "Sue Brown",
    email: "sue@example.com",
    password: "password123",
    address: { street: "34 Wool Ave", city: "Auckland", country: "New Zealand" },
  },
];

// Dummy Admins
const admins = [
  {
    name: "Catherine Holland",
    email: "catherine@woolstore.com",
    password: "admin123",
    role: "Admin",
  },
  {
    name: "Michael Brown",
    email: "michael@woolstore.com",
    password: "manager123",
    role: "Manager",
  },
  {
    name: "Sophie Lee",
    email: "sophie@woolstore.com",
    password: "staff123",
    role: "Staff",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB connected");

    // Clear old data
    await Product.deleteMany();
    await Customer.deleteMany();
    await Order.deleteMany();
    await Admin.deleteMany();

    // Insert new
    const createdProducts = await Product.insertMany(products);
    const createdCustomers = await Customer.insertMany(customers);
    await Admin.insertMany(admins);

    // Create Orders
    const orders = [
      {
        customer: createdCustomers[0]._id,
        products: [
          { product: createdProducts[0]._id, quantity: 1 },
          { product: createdProducts[2]._id, quantity: 2 },
        ],
        totalAmount: 279.0 + 2 * 179.0, // Boucle Wool Throw + 2x Grey Style Wool Throw = 637.0
        status: "Pending",
      },
      {
        customer: createdCustomers[1]._id,
        products: [{ product: createdProducts[1]._id, quantity: 1 }],
        totalAmount: 249.5, // Chunky Knit Wool Blanket
        status: "Shipped",
      },
      {
        customer: createdCustomers[2]._id,
        products: [
          { product: createdProducts[3]._id, quantity: 1 },
          { product: createdProducts[5]._id, quantity: 1 },
        ],
        totalAmount: 279.0 + 179.0, // Modern Lifestyle + Oslo Lambswool = 458.0
        status: "Delivered",
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