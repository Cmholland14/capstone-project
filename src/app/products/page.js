"use client"

import React, { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function ProductsPage() {
  const { user } = useSimpleAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);

  // Handle adding item to cart
  const handleAddToCart = async (productId) => {
    setAddingToCart(productId);
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        // Show success feedback (you could use a toast notification here)
        console.log('Item added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    // Sort products
    filtered.sort((a, b) => {
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

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className={styles.productsPage}>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading our beautiful wool collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productsPage}>
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            <h4>Oops! Something went wrong</h4>
            <p>We couldn&apos;t load our products right now. Please try again later.</p>
            <p className="small text-muted">Error: {error}</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsPage}>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className={styles.pageTitle}>Our Premium Wool Collection</h1>
              <p className={styles.pageSubtitle}>
                Discover handcrafted wool products made with 100% pure New Zealand wool
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className={styles.filtersSection}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className={styles.filtersCard}>
                <div className="row g-3 align-items-center">
                  {/* Search */}
                  <div className="col-md-4">
                    <div className={styles.searchBox}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <i className="fas fa-search"></i>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="stock">Stock Available</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="col-md-2">
                    <span className={styles.resultsCount}>
                      {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className={styles.productsGrid}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="row">
              <div className="col-12">
                <div className={styles.noProducts}>
                  <h3>No products found</h3>
                  <p>Try adjusting your search terms or filters</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-lg-4 col-md-6 mb-4">
                  <div className={styles.productCard}>
                    <Link href={`/products/${product._id}`} className={styles.productLink}>
                      <div className={styles.productImage}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
                          }}
                        />
                        {product.stock === 0 && (
                          <div className={styles.outOfStock}>
                            <span>Out of Stock</span>
                          </div>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                          <div className={styles.lowStock}>
                            <span>Only {product.stock} left!</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.productInfo}>
                        <div className={styles.categoryBadge}>
                          {product.category}
                        </div>
                        
                        <h3 className={styles.productName}>{product.name}</h3>
                        
                        <p className={styles.productDescription}>
                          {product.description.length > 100 
                            ? `${product.description.substring(0, 100)}...` 
                            : product.description
                          }
                        </p>
                        
                        <div className={styles.productFooter}>
                          <div className={styles.priceStock}>
                            <span className={styles.price}>
                              ${product.price.toFixed(2)}
                            </span>
                            <span className={styles.stock}>
                              {product.stock > 0 ? (
                                `${product.stock} in stock`
                              ) : (
                                'Out of stock'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className={styles.productActions}>
                      {user ? (
                        <button 
                          className={`btn btn-primary ${product.stock === 0 || addingToCart === product._id ? 'disabled' : ''}`}
                          disabled={product.stock === 0 || addingToCart === product._id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                        >
                          {addingToCart === product._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Adding...
                            </>
                          ) : (
                            product.stock === 0 ? 'Out of Stock' : 'Add to Cart'
                          )}
                        </button>
                      ) : (
                        <Link href="/auth/signin" className="btn btn-outline-primary" onClick={(e) => e.stopPropagation()}>
                          Sign in to Purchase
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className={styles.ctaSection}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className={styles.ctaCard}>
                  <h3>Ready to Shop?</h3>
                  <p>Create an account to start purchasing our premium wool products</p>
                  <div className={styles.ctaActions}>
                    <Link href="/auth/signup" className="btn btn-light btn-lg me-3">
                      Create Account
                    </Link>
                    <Link href="/auth/signin" className="btn btn-outline-light btn-lg">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}