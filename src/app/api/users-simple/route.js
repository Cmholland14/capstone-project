import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import Admin from '@/lib/models/Admin';

// GET /api/users-simple - Get all users (simplified, no auth required for demo)
export async function GET(request) {
  try {
    await connectDB();
    
    console.log('[API] GET /api/users-simple - Request received');
    
    // Get all customers and admins
    const customers = await Customer.find({}).select('name email role createdAt').lean();
    const admins = await Admin.find({}).select('name email role createdAt').lean();
    
    // Combine and format users
    const allUsers = [
      ...customers.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'customer',
        createdAt: user.createdAt
      })),
      ...admins.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'admin',
        adminLevel: user.role, // Admin/Manager/Staff
        createdAt: user.createdAt
      }))
    ];
    
    console.log(`[API] GET /api/users-simple - Successfully returned ${allUsers.length} users`);
    
    return NextResponse.json(allUsers, { status: 200 });
    
  } catch (error) {
    console.error('[API] GET /api/users-simple - Error occurred:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Note: This is a simplified API without authentication checks for demo purposes
// In production, you would add proper authentication and authorization