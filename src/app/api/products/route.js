import { NextResponse } from 'next/server';
import { ProductController } from '../../../lib/controllers/ProductController.js';
import connectDB from '../../../lib/mongodb.js';

// Create a controller instance
const productController = new ProductController();

// GET /api/products - Get all products with optional query parameters
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    let products;
    
    // Handle different query types
    if (category && category !== 'all') {
      products = await productController.getProductsByCategory(category, page, limit);
    } else if (search) {
      products = await productController.searchProducts(search, page, limit);
    } else {
      products = await productController.getAllProducts(page, limit);
    }
    
    // Sort products on the server side if needed
    if (sortBy && products.data) {
      products.data.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'stock':
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
    }
    
    // Return just the products array for simpler frontend handling
    const productList = products.data || products;
    
    return NextResponse.json(productList, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, description, price, category, stock, imageUrl } = body;
    
    // Basic validation
    if (!name || !description || !price || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category, stock' },
        { status: 400 }
      );
    }
    
    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (stock < 0) {
      return NextResponse.json(
        { error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }
    
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      stock: parseInt(stock),
      imageUrl: imageUrl?.trim() || `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
    };
    
    const result = await productController.createProduct(productData);
    
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}