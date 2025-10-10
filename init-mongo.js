// MongoDB initialization script for Docker
db = db.getSiblingDB('capstone-wool-store');

// Create collections
db.createCollection('products');
db.createCollection('customers');
db.createCollection('admins');
db.createCollection('orders');

// Create indexes for better performance
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.customers.createIndex({ "email": 1 }, { unique: true });
db.admins.createIndex({ "email": 1 }, { unique: true });
db.orders.createIndex({ "customerId": 1 });
db.orders.createIndex({ "createdAt": -1 });

print('Database initialized successfully!');