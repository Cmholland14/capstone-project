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
          <div className="spinner-border" role="status" style={{ color: '#8b7355' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: '#6d5a47' }}>Loading admin dashboard...</p>
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
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h1 className="display-5 fw-bold mb-2" style={{ color: '#3d332a' }}>Admin Dashboard</h1>
                <p className="lead" style={{ color: '#6d5a47' }}>Welcome back, {user.name}!</p>
              </div>
              <div className="text-end">
                <span className="badge fs-6 px-3 py-2" style={{ 
                  backgroundColor: '#a67c6c', 
                  color: 'white',
                  fontWeight: '500'
                }}>{user.adminLevel || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-lg-5 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#f8f2ea', border: '1px solid #e5d4c1' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#8b7355', opacity: '0.1' }}>
                    <i className="fas fa-users fs-4" style={{ color: '#8b7355' }}></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1" style={{ color: '#3d332a', fontWeight: '600' }}>User Management</h5>
                    <small style={{ color: '#6d5a47' }}>Manage customers and admins</small>
                  </div>
                </div>
                <Link href="/admin/users" className="btn w-100 py-2" style={{ 
                  backgroundColor: '#8b7355', 
                  borderColor: '#8b7355',
                  color: 'white',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#6d5a47'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#8b7355'}>
                  Manage Users
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-5 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#f8f2ea', border: '1px solid #e5d4c1' }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle p-3 me-3" style={{ backgroundColor: '#9c8472', opacity: '0.1' }}>
                    <i className="fas fa-box fs-4" style={{ color: '#9c8472' }}></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1" style={{ color: '#3d332a', fontWeight: '600' }}>Product Management</h5>
                    <small style={{ color: '#6d5a47' }}>Add, edit, delete products & images</small>
                  </div>
                </div>
                <Link href="/admin/products" className="btn w-100 py-2" style={{ 
                  backgroundColor: '#9c8472', 
                  borderColor: '#9c8472',
                  color: 'white',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7a6b5f'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#9c8472'}>
                  Manage Products
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f8f2ea', border: '1px solid #e5d4c1' }}>
              <div className="card-header" style={{ backgroundColor: 'transparent', borderBottom: '1px solid #e5d4c1' }}>
                <h5 className="card-title mb-0" style={{ color: '#3d332a', fontWeight: '600' }}>Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <Link href="/account" className="btn w-100 py-2" style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#8b7355',
                      color: '#8b7355',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#8b7355';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#8b7355';
                    }}>
                      <i className="fas fa-user me-2"></i>
                      My Account
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/products" className="btn w-100 py-2" style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#9c8472',
                      color: '#9c8472',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#9c8472';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#9c8472';
                    }}>
                      <i className="fas fa-shopping-bag me-2"></i>
                      View Store
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/customer/orders" className="btn w-100 py-2" style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#7a8264',
                      color: '#7a8264',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#7a8264';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#7a8264';
                    }}>
                      <i className="fas fa-list me-2"></i>
                      View Orders
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/" className="btn w-100 py-2" style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: '#3d332a',
                      color: '#3d332a',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#3d332a';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#3d332a';
                    }}>
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