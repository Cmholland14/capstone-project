import { NextResponse } from 'next/server';
import { ProductController } from '@/lib/controllers/ProductController';
import connectDB from '@/lib/mongodb';

// Create a controller instance
const productController = new ProductController();

// GET /api/products/[id] - Get a single product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;  // Await params in Next.js 15
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const product = await productController.getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product by ID (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;  // Await params in Next.js 15
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Validate the update data
    const updateData = {};
    
    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: 'Product name cannot be empty' },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }
    
    if (body.description !== undefined) {
      if (!body.description.trim()) {
        return NextResponse.json(
          { error: 'Product description cannot be empty' },
          { status: 400 }
        );
      }
      updateData.description = body.description.trim();
    }
    
    if (body.price !== undefined) {
      const price = parseFloat(body.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        );
      }
      updateData.price = price;
    }
    
    if (body.stock !== undefined) {
      const stock = parseInt(body.stock);
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a non-negative number' },
          { status: 400 }
        );
      }
      updateData.stock = stock;
    }
    
    if (body.category !== undefined) {
      if (!body.category.trim()) {
        return NextResponse.json(
          { error: 'Product category cannot be empty' },
          { status: 400 }
        );
      }
      updateData.category = body.category.trim();
    }
    
    if (body.imageUrl !== undefined) {
      updateData.imageUrl = body.imageUrl.trim();
    }
    
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }
    
    const updatedProduct = await productController.updateProduct(id, updateData);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProduct, { status: 200 });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product by ID (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;  // Await params in Next.js 15
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const deletedProduct = await productController.deleteProduct(id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Product deleted successfully', product: deletedProduct },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}