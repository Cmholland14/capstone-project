'use client';

import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from "next/link";

export default function AdminPage() {
  const { user, loading } = useSimpleAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
                <p className="lead text-muted">Welcome back, {user.name}!</p>
              </div>
              <div className="text-end">
                <span className="badge bg-danger fs-6">{user.adminLevel || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-users text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-0">User Management</h5>
                    <small className="text-muted">Manage customers and admins</small>
                  </div>
                </div>
                <Link href="/admin/users" className="btn btn-primary w-100">
                  Manage Users
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-images text-success fs-4"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-0">Product Images</h5>
                    <small className="text-muted">Upload and manage images</small>
                  </div>
                </div>
                <Link href="/admin/images" className="btn btn-success w-100">
                  Manage Images
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-box text-info fs-4"></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-0">Products</h5>
                    <small className="text-muted">Manage product catalog</small>
                  </div>
                </div>
                <Link href="/products" className="btn btn-info w-100">
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <Link href="/account" className="btn btn-outline-primary w-100">
                      <i className="fas fa-user me-2"></i>
                      My Account
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/products" className="btn btn-outline-secondary w-100">
                      <i className="fas fa-shopping-bag me-2"></i>
                      View Store
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/customer/orders" className="btn btn-outline-info w-100">
                      <i className="fas fa-list me-2"></i>
                      View Orders
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/" className="btn btn-outline-dark w-100">
                      <i className="fas fa-home me-2"></i>
                      Homepage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}