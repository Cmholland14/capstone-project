import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Collections() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await res.json();
                // The API returns products directly, not wrapped in a products property
                setProducts(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="collections text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="collections">
                <div className="alert alert-danger text-center">
                    <h5>Error loading products</h5>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="collections text-center">
                <p>No products available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="collections">
            <div className="row">
                {products.slice(0, 3).map(product => (
                    <div key={product._id} className="col-lg-4 col-md-6 mb-4">
                        <Link href={`/products/${product._id}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm" style={{ transition: 'transform 0.3s ease' }} 
                                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <Image 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    width={400}
                                    height={250}
                                    className="card-img-top"
                                    style={{ height: '250px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                                    }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title" style={{ color: '#8b7355', fontWeight: '600' }}>{product.name}</h5>
                                    <p className="card-text text-muted small flex-grow-1">
                                        {product.description.length > 100 
                                            ? `${product.description.substring(0, 100)}...` 
                                            : product.description
                                        }
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <span className="h5 mb-0" style={{ color: '#b8956b', fontWeight: '700' }}>${product.price.toFixed(2)}</span>
                                        <small className="text-muted">
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}