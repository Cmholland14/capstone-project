"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useSimpleAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Handle adding item to cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const success = await addToCart(product._id, quantity);
      if (success) {
        // Show success feedback
        alert(`Added ${quantity} ${product.name}(s) to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            throw new Error('Failed to fetch product');
          }
          return;
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.productDetailPage}>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" style={{ color: '#8b7355' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: '#6d5a47' }}>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productDetailPage}>
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            <h4>Product Not Found</h4>
            <p>{error}</p>
            <Link href="/products" className="btn btn-primary mt-3">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className={styles.productDetailPage}>
      {/* Breadcrumb */}
      <section className={styles.breadcrumb}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/products">Products</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className={styles.productDetails}>
        <div className="container">
          <div className="row">
            {/* Product Images */}
            <div className="col-lg-6 mb-4">
              <div className={styles.productImages}>
                <div className={styles.mainImage}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-fluid rounded-3"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {product.stock === 0 && (
                    <div className={styles.outOfStockOverlay}>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div className={styles.productInfo}>
                <div className={styles.categoryBadge}>
                  {product.category}
                </div>
                
                <h1 className={styles.productTitle}>{product.name}</h1>
                
                <div className={styles.productPrice}>
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
                </div>

                <div className={styles.stockInfo}>
                  {product.stock > 0 ? (
                    <>
                      <span className={styles.inStock}>✓ In Stock</span>
                      <span className={styles.stockCount}>({product.stock} available)</span>
                    </>
                  ) : (
                    <span className={styles.outOfStock}>✗ Out of Stock</span>
                  )}
                </div>

                <div className={styles.productDescription}>
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>

                {/* Product Features */}
                <div className={styles.productFeatures}>
                  <h3>Product Features</h3>
                  <ul>
                    <li>100% Pure New Zealand Wool</li>
                    <li>Handcrafted with Traditional Methods</li>
                    <li>Naturally Breathable & Temperature Regulating</li>
                    <li>Hypoallergenic & Antimicrobial Properties</li>
                    <li>Easy Care Instructions Included</li>
                  </ul>
                </div>

                {/* Add to Cart Section */}
                {product.stock > 0 && (
                  <div className={styles.addToCartSection}>
                    <div className={styles.quantitySelector}>
                      <label htmlFor="quantity">Quantity:</label>
                      <div className={styles.quantityControls}>
                        <button 
                          type="button" 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                        />
                        <button 
                          type="button" 
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.actionButtons}>
                      {user ? (
                        <button 
                          className={`btn btn-primary btn-lg ${addingToCart ? 'disabled' : ''}`}
                          disabled={addingToCart}
                          onClick={handleAddToCart}
                        >
                          {addingToCart ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Adding to Cart...
                            </>
                          ) : (
                            `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                          )}
                        </button>
                      ) : (
                        <div>
                          <p className="text-muted mb-3">Please sign in to purchase this product</p>
                          <Link href="/auth/signin" className="btn btn-primary btn-lg me-3">
                            Sign In
                          </Link>
                          <Link href="/auth/signup" className="btn btn-outline-primary btn-lg">
                            Create Account
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {product.stock === 0 && (
                  <div className={styles.outOfStockSection}>
                    <p className="text-muted">This product is currently out of stock.</p>
                    <Link href="/products" className="btn btn-outline-primary">
                      Browse Other Products
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Care & Info */}
      <section className={styles.productCare}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className={styles.careCard}>
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <h4>Care Instructions</h4>
                    <ul className={styles.careList}>
                      <li>Gentle hand wash in cool water</li>
                      <li>Use wool-specific detergent</li>
                      <li>Lay flat to dry away from direct heat</li>
                      <li>Store in breathable garment bag</li>
                    </ul>
                  </div>
                  <div className="col-md-4 mb-4">
                    <h4>Shipping & Returns</h4>
                    <ul className={styles.careList}>
                      <li>Free shipping on orders over $200</li>
                      <li>Standard delivery: 5-7 business days</li>
                      <li>30-day return policy</li>
                      <li>Satisfaction guaranteed</li>
                    </ul>
                  </div>
                  <div className="col-md-4 mb-4">
                    <h4>Quality Promise</h4>
                    <ul className={styles.careList}>
                      <li>Ethically sourced New Zealand wool</li>
                      <li>Traditional craftsmanship</li>
                      <li>Quality tested for durability</li>
                      <li>Sustainable production methods</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Products */}
      <section className={styles.backToProducts}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <Link href="/products" className="btn btn-outline-primary btn-lg">
                ← Back to All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}