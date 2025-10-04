import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// In-memory cart storage (in production, you'd use database)
// For this demo, we'll use a simple Map to store carts by session ID
const carts = new Map();

// GET - Get user's cart
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const cart = carts.get(userId) || { items: [], total: 0 };
        
        return NextResponse.json(cart);
    } catch (error) {
        console.error('Cart GET error:', error);
        return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
    }
}

// POST - Add item to cart
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity = 1 } = await request.json();
        
        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Connect to database to get product details
        await connectDB();
        const product = await Product.findById(productId);
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.stock < quantity) {
            return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }

        const userId = session.user.id;
        let cart = carts.get(userId) || { items: [], total: 0 };

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            
            if (newQuantity > product.stock) {
                return NextResponse.json({ error: 'Cannot add more items - insufficient stock' }, { status: 400 });
            }
            
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.items.push({
                productId: product._id.toString(),
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                stock: product.stock
            });
        }

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save cart
        carts.set(userId, cart);

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Cart POST error:', error);
        return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
    }
}

// PUT - Update item quantity in cart
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity } = await request.json();
        
        if (!productId || quantity < 0) {
            return NextResponse.json({ error: 'Invalid product ID or quantity' }, { status: 400 });
        }

        const userId = session.user.id;
        let cart = carts.get(userId) || { items: [], total: 0 };

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
        }

        if (quantity === 0) {
            // Remove item from cart
            cart.items.splice(itemIndex, 1);
        } else {
            // Verify stock availability
            await connectDB();
            const product = await Product.findById(productId);
            
            if (!product) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            if (quantity > product.stock) {
                return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
            }

            cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save cart
        carts.set(userId, cart);

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Cart PUT error:', error);
        return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
}

// DELETE - Remove item from cart or clear entire cart
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const productId = url.searchParams.get('productId');

        const userId = session.user.id;
        let cart = carts.get(userId) || { items: [], total: 0 };

        if (productId) {
            // Remove specific item
            cart.items = cart.items.filter(item => item.productId !== productId);
        } else {
            // Clear entire cart
            cart.items = [];
        }

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save cart
        carts.set(userId, cart);

        return NextResponse.json(cart);
    } catch (error) {
        console.error('Cart DELETE error:', error);
        return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
    }
}