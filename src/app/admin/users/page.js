'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UsersPage() {
  const { user, loading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.role !== 'admin') {
      router.push('/access-denied');
      return;
    }
    
    fetchUsers();
  }, [user, authLoading, router]);

  const fetchUsers = async () => {
    try {
      console.log('[Admin Users Page] Loading users page');
      const response = await fetch('/api/users-simple');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
        console.log(`[Admin Users Page] Loaded ${userData.length} users`);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('[Admin Users Page] Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Users</h4>
          <p>There was an error loading the user data. Please try again.</p>
          <Link href="/admin" className="btn btn-primary">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-5 fw-bold mb-2">User Management</h1>
                <p className="lead text-muted">Manage customers and administrators</p>
              </div>
              <Link href="/admin" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="card-title mb-0">All Users ({users.length})</h5>
              </div>
              <div className="card-body">
                {users.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-6 text-muted mb-3">👥</div>
                    <h5>No Users Found</h5>
                    <p className="text-muted">There are no users in the database.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Avatar</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user._id || index}>
                            <td>
                              <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=40`}
                                alt={user.name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{user.name}</div>
                                <small className="text-muted">ID: {user._id}</small>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success">Active</span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary btn-sm">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-outline-warning btn-sm">
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-outline-danger btn-sm">
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="card-title mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <button className="btn btn-primary w-100">
                      <i className="fas fa-user-plus me-2"></i>
                      Add New User
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-success w-100" onClick={fetchUsers}>
                      <i className="fas fa-sync-alt me-2"></i>
                      Refresh List
                    </button>
                  </div>
                  <div className="col-md-3">
                    <Link href="/admin/images" className="btn btn-info w-100">
                      <i className="fas fa-images me-2"></i>
                      Manage Images
                    </Link>
                  </div>
                  <div className="col-md-3">
                    <Link href="/products" className="btn btn-outline-secondary w-100">
                      <i className="fas fa-box me-2"></i>
                      View Products
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