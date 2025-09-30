// Example for /app/api/products/route.js
export async function GET(request) {
    // Handle GET requests for products
    return Response.json({ products: [] })
}

export async function POST(request) {
    // Handle POST requests for products
    const data = await request.json()
    return Response.json({ message: 'Product created' })
}