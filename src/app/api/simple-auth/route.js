// Simple session management for authentication
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../../lib/mongodb.js'
import Customer from '../../../lib/models/Customer.js'
import Admin from '../../../lib/models/Admin.js'

// Simple session store (in production, use Redis)
const sessions = global.simpleSessions || (global.simpleSessions = new Map())

// Generate simple session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Login endpoint
export async function POST(request) {
  try {
    const { email, password, action } = await request.json()
    console.log(`[SimpleAuth] Login attempt for: ${email}`)
    
    if (action === 'login') {
      await connectDB()
      console.log(`[SimpleAuth] Database connected`)
      
      // Check both customer and admin collections
      let user = await Customer.findOne({ email })
      let userType = 'customer'
      
      if (!user) {
        console.log(`[SimpleAuth] User not found in Customer collection, checking Admin...`)
        user = await Admin.findOne({ email })
        userType = 'admin'
      }
      
      if (!user) {
        console.log(`[SimpleAuth] User not found in any collection: ${email}`)
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      console.log(`[SimpleAuth] User found: ${user.name} (${userType})`)
      
      const passwordMatch = await bcrypt.compare(password, user.password)
      console.log(`[SimpleAuth] Password match: ${passwordMatch}`)
      
      if (!passwordMatch) {
        console.log(`[SimpleAuth] Password mismatch for: ${email}`)
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      
      // Create simple session
      const sessionToken = generateSessionToken()
      const sessionData = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: userType === 'admin' ? 'admin' : userType, // Set as 'admin' for any admin user
        adminLevel: userType === 'admin' ? user.role : null, // Keep specific admin level (Admin/Manager/Staff)
        createdAt: Date.now()
      }
      
      console.log(`[SimpleAuth] Session created for: ${user.name} with role: ${sessionData.role}`)
      
      sessions.set(sessionToken, sessionData)
      
      // Clean old sessions (basic cleanup)
      const oneHour = 60 * 60 * 1000
      for (const [token, data] of sessions.entries()) {
        if (Date.now() - data.createdAt > oneHour) {
          sessions.delete(token)
        }
      }
      
      const response = NextResponse.json({ 
        success: true, 
        user: sessionData 
      })
      
      // Set simple cookie
      response.cookies.set('session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 // 1 hour
      })
      
      return response
    }
    
    if (action === 'logout') {
      const sessionToken = request.cookies.get('session-token')?.value
      if (sessionToken) {
        sessions.delete(sessionToken)
      }
      
      const response = NextResponse.json({ success: true })
      response.cookies.delete('session-token')
      return response
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Simple auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

// Get current session
export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }
    
    const sessionData = sessions.get(sessionToken)
    
    if (!sessionData) {
      return NextResponse.json({ user: null })
    }
    
    // Check if session expired (1 hour)
    const oneHour = 60 * 60 * 1000
    if (Date.now() - sessionData.createdAt > oneHour) {
      sessions.delete(sessionToken)
      return NextResponse.json({ user: null })
    }
    
    return NextResponse.json({ user: sessionData })
    
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}