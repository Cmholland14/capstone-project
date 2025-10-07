import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

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
    console.log('[API] POST /api/orders-simple - Request received');
    
    // Basic validation
    const { customerId, customerName, customerEmail, products, total, subtotal, shipping, shippingInfo } = body;
    
    if (!customerId || !customerName || !customerEmail || !products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, customerName, customerEmail, products' },
        { status: 400 }
      );
    }
    
    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Total must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Create order
    const orderData = {
      customer: customerId,
      customerName,
      customerEmail,
      products: products.map(p => ({
        product: p.productId,
        productName: p.productName,
        price: p.price,
        quantity: p.quantity
      })),
      totalAmount: total,
      subtotal: subtotal || total,
      shipping: shipping || 0,
      shippingInfo: shippingInfo || {},
      status: 'pending',
      createdAt: new Date()
    };
    
    const order = new Order(orderData);
    await order.save();
    
    console.log(`[API] POST /api/orders-simple - Order created successfully with ID: ${order._id}`);
    
    return NextResponse.json(order, { status: 201 });
    
  } catch (error) {
    console.error('[API] POST /api/orders-simple - Error occurred:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Note: This is a simplified API without authentication checks for demo purposes
// In production, you would add proper authentication and authorization