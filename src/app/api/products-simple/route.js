import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100) // Max 100 items
    
    let filter = { status: 'active' }
    
    // Simple filtering
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Single optimized query
    const products = await Product.find(filter)
      .select('name price description category imageUrl stockQuantity')
      .lean() // Returns plain objects (faster)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
    
    const total = await Product.countDocuments(filter)
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    await connectDB()
    
    const productData = await request.json()
    
    // Simple validation
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Name and price are required' }, 
        { status: 400 }
      )
    }
    
    const product = new Product({
      ...productData,
      status: 'active',
      stockQuantity: productData.stockQuantity || 0
    })
    
    await product.save()
    
    return NextResponse.json({
      success: true,
      product: product.toObject()
    }, { status: 201 })
    
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: 500 }
    )
  }
}