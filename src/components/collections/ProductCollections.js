import React, { useEffect, useState } from 'react';

export default function Collections() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.products);
        }
        fetchProducts();
    }, []);

    return (
        <div className="collections">
            {products.map(product => (
                <div key={product._id} className="product-card">
                    <img src={product.imageUrl} alt={product.name} width={200} />
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                </div>
            ))}
        </div>
    );
}