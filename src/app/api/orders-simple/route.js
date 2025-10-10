import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order.js';

// GET /api/orders-simple - Get orders (simplified, with optional customer filter)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    
    console.log('[API] GET /api/orders-simple - Request received', { customerId });
    
    let query = {};
    if (customerId) {
      query.customer = customerId;
    }
    
    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('products.product', 'name price imageUrl')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`[API] GET /api/orders-simple - Successfully returned ${orders.length} orders`);
    
    return NextResponse.json(orders, { status: 200 });
    
  } catch (error) {
    console.error('[API] GET /api/orders-simple - Error occurred:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// POST /api/orders-simple - Create a new order (simplified)
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('[API] POST /api/orders-simple - Request received', body);
    
    // Basic validation
    const { customerId, products, totalAmount, shippingAddress } = body;
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Products array is required and cannot be empty' },
        { status: 400 }
      );
    }
    
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Total amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Create order using the correct schema format
    const orderData = {
      customer: customerId,
      products: products.map(p => ({
        product: p.productId,
        quantity: p.quantity
      })),
      totalAmount: totalAmount,
      status: 'Pending'  // Capital P to match enum in Order model
    };
    
    console.log('[API] POST /api/orders-simple - Creating order with data:', orderData);
    
    const order = new Order(orderData);
    await order.save();
    
    console.log(`[API] POST /api/orders-simple - Order created successfully with ID: ${order._id}`);
    
    return NextResponse.json(order, { status: 201 });
    
  } catch (error) {
    console.error('[API] POST /api/orders-simple - Error occurred:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        message: error.message,
        details: error.toString()
      }, 
      { status: 500 }
    );
  }
}

// Note: This is a simplified API without authentication checks for demo purposes
// In production, you would add proper authentication and authorization