// Minimal API test to isolate import issues
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== API TEST STARTING ===');
  
  try {
    // Test basic import
    console.log('Testing basic imports...');
    
    // Test relative import of Product model
    console.log('Attempting to import Product model...');
    const Product = await import('../../../lib/models/Product.js');
    console.log('Product import successful:', !!Product.default);
    
    return NextResponse.json({ 
      success: true, 
      message: 'All imports working',
      productImported: !!Product.default
    });
  } catch (error) {
    console.error('Import test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}