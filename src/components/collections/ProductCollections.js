import React from 'react';

// Example data; replace with your server-side data fetching logic
async function getProducts() {
    // Simulate fetching from a database or API
    return [
        { id: 1, name: 'Product A', price: '$20', image: '/images/productA.jpg' },
        { id: 2, name: 'Product B', price: '$30', image: '/images/productB.jpg' },
        { id: 3, name: 'Product C', price: '$40', image: '/images/productC.jpg' },
    ];
}

export default async function Collections() {
    const products = await getProducts();

    return (
        <div className="collections">
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} width={200} />
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                </div>
            ))}
        </div>
    );
}