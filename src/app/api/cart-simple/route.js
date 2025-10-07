import { NextResponse } from 'next/server'

// Simple in-memory cart storage (use Redis in production)
const userCarts = new Map()

// Simple in-memory sessions (shared with simple-auth)
const sessions = global.simpleSessions || (global.simpleSessions = new Map())

// Helper to get session from simple auth
function getUserFromSession(request) {
  const sessionToken = request.cookies.get('session-token')?.value
  if (!sessionToken) return null
  
  const sessionData = sessions.get(sessionToken)
  if (!sessionData) return null
  
  // Check if session expired (1 hour)
  const oneHour = 60 * 60 * 1000
  if (Date.now() - sessionData.createdAt > oneHour) {
    sessions.delete(sessionToken)
    return null
  }
  
  return sessionData
}

export async function GET(request) {
  try {
    const user = getUserFromSession(request)
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const cart = userCarts.get(user.id) || { items: [], total: 0 }
    return NextResponse.json({ success: true, cart })
    
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = getUserFromSession(request)
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { productId, quantity = 1 } = await request.json()
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }
    
    let cart = userCarts.get(user.id) || { items: [], total: 0 }
    
    // Check if item already exists
    const existingItem = cart.items.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ productId, quantity })
    }
    
    // Recalculate total (simple count)
    cart.total = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    
    userCarts.set(user.id, cart)
    
    return NextResponse.json({ success: true, cart })
    
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = getUserFromSession(request)
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { productId, quantity } = await request.json()
    
    let cart = userCarts.get(user.id) || { items: [], total: 0 }
    
    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter(item => item.productId !== productId)
    } else {
      // Update quantity
      const item = cart.items.find(item => item.productId === productId)
      if (item) {
        item.quantity = quantity
      }
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    userCarts.set(user.id, cart)
    
    return NextResponse.json({ success: true, cart })
    
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const user = getUserFromSession(request)
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    userCarts.delete(user.id)
    
    return NextResponse.json({ success: true, cart: { items: [], total: 0 } })
    
  } catch (error) {
    console.error('Clear cart error:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}