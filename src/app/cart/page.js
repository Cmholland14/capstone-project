'use client';

import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ShoppingCart() {
  const { user, loading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchCart();
  }, [user, authLoading, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart-simple');
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    setUpdating(true);
    try {
      const response = await fetch('/api/cart-simple', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/cart-simple?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/cart-simple', {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-5 fw-bold mb-2">Shopping Cart</h1>
                <p className="lead text-muted">
                  {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              {cart.items.length > 0 && (
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearCart}
                  disabled={updating}
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="display-1 mb-4">🛒</div>
                  <h3 className="mb-3">Your cart is empty</h3>
                  <p className="text-muted mb-4">Looks like you haven&apos;t added any wool products yet.</p>
                  <Link href="/products" className="btn btn-primary btn-lg">
                    Browse Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0 py-3">
                  <h3 className="card-title mb-0">Cart Items</h3>
                </div>
                <div className="card-body p-0">
                  {cart.items.map((item, index) => (
                    <div key={item.productId} className={`p-4 ${index < cart.items.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img 
                            src={item.image || '/placeholder-wool.jpg'} 
                            alt={item.name}
                            className="img-fluid"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="col-md-4">
                          <h5 className="mb-1">{item.name}</h5>
                          <p className="text-muted mb-0">${item.price.toFixed(2)} each</p>
                          <small className="text-muted">{item.stock} in stock</small>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={updating || item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="mx-3 fw-bold">{item.quantity}</span>
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={updating || item.quantity >= item.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <h5 className="text-primary mb-0">${(item.price * item.quantity).toFixed(2)}</h5>
                        </div>
                        <div className="col-md-1">
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeItem(item.productId)}
                            disabled={updating}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0 py-3">
                  <h3 className="card-title mb-0">Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span>Subtotal ({cart.items.length} items):</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping:</span>
                    <span className="text-muted">Calculated at checkout</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax:</span>
                    <span className="text-muted">Calculated at checkout</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Estimated Total:</strong>
                    <strong className="text-primary">${cart.total.toFixed(2)}</strong>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Link href="/checkout" className="btn btn-primary btn-lg">
                      Proceed to Checkout
                    </Link>
                    <Link href="/products" className="btn btn-outline-secondary">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cart Info */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <h6 className="card-title">🚚 Free Shipping</h6>
                  <p className="card-text small text-muted mb-3">
                    Free shipping on orders over $75
                  </p>
                  
                  <h6 className="card-title">↩️ Easy Returns</h6>
                  <p className="card-text small text-muted mb-3">
                    30-day return policy on all wool products
                  </p>
                  
                  <h6 className="card-title">💬 Need Help?</h6>
                  <p className="card-text small text-muted">
                    Contact our support team for assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}