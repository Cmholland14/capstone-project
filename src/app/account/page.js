"use client"

import { useSimpleAuth } from "@/contexts/SimpleAuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, loading } = useSimpleAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title mb-0">My Account</h1>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt="Profile" 
                      className="rounded-circle img-fluid mb-3"
                      style={{ maxWidth: "150px" }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: "150px", height: "150px" }}
                    >
                      <i className="fas fa-user fa-3x text-white"></i>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h3>Welcome, {user?.name || 'User'}!</h3>
                  <hr />
                  <div className="row">
                    <div className="col-sm-6">
                      <p><strong>Name:</strong></p>
                      <p>{user?.name || 'Not provided'}</p>
                    </div>
                    <div className="col-sm-6">
                      <p><strong>Email:</strong></p>
                      <p>{user?.email || 'Not provided'}</p>
                    </div>
                    <div className="col-sm-6">
                      <p><strong>Role:</strong></p>
                      <p className="text-capitalize">
                        <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {user?.role || 'customer'}
                        </span>
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <p><strong>Status:</strong></p>
                      <p>
                        <span className={`badge ${user?.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                          {user?.status || 'active'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-12">
                  <h5>Quick Actions</h5>
                  <div className="btn-group-vertical d-grid gap-2 d-md-flex justify-content-md-start">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => router.push('/customer/orders')}
                    >
                      <i className="fas fa-shopping-bag me-2"></i>
                      View My Orders
                    </button>
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => router.push('/products')}
                    >
                      <i className="fas fa-store me-2"></i>
                      Browse Products
                    </button>
                    {user?.role === 'admin' && (
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => router.push('/admin')}
                      >
                        <i className="fas fa-cog me-2"></i>
                        Admin Panel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}