'use client';

import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (cart.items.length === 0) {
      router.push('/cart');
      return;
    }

    setLoading(false);
  }, [user, authLoading, router, cart.items.length]);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const calculateShipping = () => {
    // Simple shipping calculation
    return cart.total > 75 ? 0 : 9.99;
  };

  const calculateTax = () => {
    // Simple tax calculation (8.5%)
    return cart.total * 0.085;
  };

  const calculateTotal = () => {
    return cart.total + calculateShipping() + calculateTax();
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Validate shipping info
      if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
        alert('Please fill in all shipping information');
        setProcessing(false);
        return;
      }

      // Create order using existing orders API
      const orderData = {
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        products: cart.items.map(item => ({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: calculateTotal(),
        subtotal: cart.total,
        shipping: calculateShipping(),
        tax: calculateTax(),
        shippingAddress: shippingInfo,
        status: 'pending',
        orderDate: new Date().toISOString()
      };

      const response = await fetch('/api/orders-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        
        // Clear the cart
        await clearCart();
        
        // Redirect to success page or order confirmation
        router.push(`/customer/orders?success=true&orderId=${order._id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="display-5 fw-bold mb-4">Checkout</h1>
          </div>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="row">
            {/* Shipping Information */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-transparent border-0 py-3">
                  <h3 className="card-title mb-0">Shipping Information</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="state" className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0 py-3">
                  <h3 className="card-title mb-0">Order Items</h3>
                </div>
                <div className="card-body p-0">
                  {cart.items.map((item, index) => (
                    <div key={item.productId} className={`p-3 ${index < cart.items.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.image || '/placeholder-wool.jpg'} 
                          alt={item.name}
                          className="me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">Quantity: {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0 py-3">
                  <h3 className="card-title mb-0">Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>{calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax:</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total:</strong>
                    <strong className="text-primary">${calculateTotal().toFixed(2)}</strong>
                  </div>

                  {calculateShipping() === 0 && (
                    <div className="alert alert-success mb-3">
                      🎉 You qualify for free shipping!
                    </div>
                  )}

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                    <Link href="/cart" className="btn btn-outline-secondary">
                      Back to Cart
                    </Link>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <h6 className="card-title">🔒 Secure Checkout</h6>
                  <p className="card-text small text-muted mb-3">
                    Your payment information is encrypted and secure.
                  </p>
                  
                  <h6 className="card-title">📞 Support</h6>
                  <p className="card-text small text-muted">
                    Need help? Contact our support team for assistance with your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}