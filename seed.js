import mongoose from "mongoose";
import Product from "./models/Product.js";
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";
import Admin from "./models/Admin.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/woolstore";

// Dummy Products
const products = [
  {
    name: "Merino Wool Sweater",
    description: "Soft and breathable sweater made from 100% New Zealand merino wool.",
    price: 129.99,
    stock: 25,
    category: "Clothing",
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
    name: "Wool Yarn Bundle",
    description: "Set of 5 skeins of natural undyed wool yarn for knitting and crochet projects.",
    price: 45.0,
    stock: 100,
    category: "Craft Supplies",
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
        totalAmount: 129.99 + 2 * 45.0,
        status: "Pending",
      },
      {
        customer: createdCustomers[1]._id,
        products: [{ product: createdProducts[1]._id, quantity: 1 }],
        totalAmount: 249.5,
        status: "Shipped",
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
