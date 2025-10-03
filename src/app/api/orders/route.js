import { NextResponse } from 'next/server';
import { OrderController } from '@/lib/controllers/OrderController';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectDB from '@/lib/mongodb';

const orderController = new OrderController();

// GET /api/orders - Get orders (with optional customer filter)
export async function GET(request) {
    try {
        console.log('[API] GET /api/orders - Request received');
        
        // Connect to database
        await connectDB();
        
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            console.log('[API] GET /api/orders - Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');

        let orders;

        if (customerId) {
            // Get orders for specific customer
            console.log(`[API] GET /api/orders - Fetching orders for customer: ${customerId}`);
            orders = await orderController.getOrdersByCustomer(customerId);
        } else {
            // Get all orders (admin only)
            console.log('[API] GET /api/orders - Fetching all orders');
            orders = await orderController.getAllOrders();
        }

        console.log(`[API] GET /api/orders - Successfully fetched ${orders.length} orders`);
        return NextResponse.json(orders);

    } catch (error) {
        console.error('[API] GET /api/orders - Error occurred:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders', details: error.message },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create new order
export async function POST(request) {
    try {
        console.log('[API] POST /api/orders - Request received');
        
        // Connect to database
        await connectDB();
        
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            console.log('[API] POST /api/orders - Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orderData = await request.json();
        console.log('[API] POST /api/orders - Creating order with data:', orderData);

        // Ensure the customer is set to the logged-in user (security measure)
        orderData.customer = session.user.id;

        const newOrder = await orderController.createOrder(orderData);
        console.log(`[API] POST /api/orders - Order created successfully with ID: ${newOrder._id}`);

        return NextResponse.json(newOrder, { status: 201 });

    } catch (error) {
        console.error('[API] POST /api/orders - Error occurred:', error);
        return NextResponse.json(
            { error: 'Failed to create order', details: error.message },
            { status: 500 }
        );
    }
}