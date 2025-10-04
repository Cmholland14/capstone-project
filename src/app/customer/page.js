'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/auth/signin');
    } else if (session.user.role !== 'customer') {
      router.push('/access-denied');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'customer') {
    return null; // Will redirect
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-5 fw-bold mb-2">Welcome back, {session.user.name}!</h1>
                <p className="lead text-muted">Manage your orders and account from your customer dashboard</p>
              </div>
              <div className="text-end">
                <span className="badge bg-success fs-6">Customer Account</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Quick Actions */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 py-3">
                <h3 className="card-title mb-0">Quick Actions</h3>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <Link href="/customer/orders" className="text-decoration-none">
                      <div className="card border border-primary h-100 hover-card">
                        <div className="card-body text-center py-4">
                          <div className="display-6 text-primary mb-3">📦</div>
                          <h5 className="card-title">My Orders</h5>
                          <p className="card-text text-muted">View and track your wool orders</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link href="/products" className="text-decoration-none">
                      <div className="card border border-secondary h-100 hover-card">
                        <div className="card-body text-center py-4">
                          <div className="display-6 text-secondary mb-3">🐑</div>
                          <h5 className="card-title">Browse Products</h5>
                          <p className="card-text text-muted">Explore our wool collection</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link href="/account" className="text-decoration-none">
                      <div className="card border border-info h-100 hover-card">
                        <div className="card-body text-center py-4">
                          <div className="display-6 text-info mb-3">👤</div>
                          <h5 className="card-title">Account Settings</h5>
                          <p className="card-text text-muted">Update your profile information</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <div className="card border border-warning h-100">
                      <div className="card-body text-center py-4">
                        <div className="display-6 text-warning mb-3">💬</div>
                        <h5 className="card-title">Support</h5>
                        <p className="card-text text-muted">Get help with your orders</p>
                        <small className="text-muted">Coming Soon</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 py-3">
                <h3 className="card-title mb-0">Account Summary</h3>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Account Details</h6>
                  <p className="mb-1"><strong>Name:</strong> {session.user.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {session.user.email}</p>
                  <p className="mb-3"><strong>Role:</strong> <span className="badge bg-success">Customer</span></p>
                </div>
                
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Quick Stats</h6>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Total Orders:</span>
                    <span className="badge bg-primary">-</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Active Orders:</span>
                    <span className="badge bg-warning">-</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Account Status:</span>
                    <span className="badge bg-success">Active</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/customer/orders" className="btn btn-outline-primary">
                    View All Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 py-3">
                <h3 className="card-title mb-0">Recent Activity</h3>
              </div>
              <div className="card-body">
                <div className="text-center py-5 text-muted">
                  <div className="display-6 mb-3">📝</div>
                  <p>No recent activity to display</p>
                  <Link href="/products" className="btn btn-primary">
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}
