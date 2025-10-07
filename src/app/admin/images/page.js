'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';

export default function ProductImageManager() {
  const { user, loading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.role !== 'admin') {
      router.push('/access-denied');
      return;
    }
    
    fetchProducts();
  }, [user, authLoading, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductImage = async (productId, imageUrl) => {
    setUploading(productId);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        // Refresh products list
        fetchProducts();
        alert('Image updated successfully!');
      } else {
        alert('Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
    } finally {
      setUploading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="display-5 fw-bold mb-4">Product Image Manager</h1>
            <p className="lead text-muted mb-5">Upload and manage images for your wool products</p>
          </div>
        </div>

        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-transparent">
                  <h5 className="card-title mb-0">{product.name}</h5>
                  <small className="text-muted">${product.price}</small>
                </div>
                
                <div className="card-body">
                  {/* Current Image */}
                  <div className="mb-3">
                    <label className="form-label">Current Image:</label>
                    <div className="border rounded p-2 text-center" style={{ minHeight: '200px' }}>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="img-fluid"
                          style={{ maxHeight: '180px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="text-muted p-4">
                          <div className="display-6 mb-2">📷</div>
                          <p>No image set</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image URL Input */}
                  <div className="mb-3">
                    <label className="form-label">Image URL:</label>
                    <input 
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/wool-image.jpg"
                      defaultValue={product.imageUrl || ''}
                      onBlur={(e) => {
                        if (e.target.value !== product.imageUrl) {
                          updateProductImage(product._id, e.target.value);
                        }
                      }}
                      disabled={uploading === product._id}
                    />
                    <div className="form-text">
                      Enter a direct URL to an image (JPG, PNG, WebP)
                    </div>
                  </div>

                  {/* Quick Image Options */}
                  <div className="mb-3">
                    <label className="form-label">Quick Options:</label>
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateProductImage(product._id, '/images/wool-placeholder.jpg')}
                        disabled={uploading === product._id}
                      >
                        Use Default Wool Image
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => updateProductImage(product._id, '')}
                        disabled={uploading === product._id}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>

                  {uploading === product._id && (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Updating...</span>
                      </div>
                      <small className="d-block text-muted mt-1">Updating image...</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Guidelines */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="card-title mb-0">📋 Image Guidelines</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>✅ Recommended:</h6>
                    <ul className="list-unstyled text-muted">
                      <li>• <strong>Aspect ratio:</strong> Square (1:1) or 4:3</li>
                      <li>• <strong>Size:</strong> 800x800px minimum</li>
                      <li>• <strong>Format:</strong> JPG, PNG, or WebP</li>
                      <li>• <strong>Background:</strong> Clean, neutral colors</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>🌐 Free Image Sources:</h6>
                    <ul className="list-unstyled">
                      <li>• <a href="https://unsplash.com/s/photos/wool" target="_blank" rel="noopener">Unsplash</a> - High-quality free photos</li>
                      <li>• <a href="https://pixabay.com/images/search/wool/" target="_blank" rel="noopener">Pixabay</a> - Free wool images</li>
                      <li>• <a href="https://pexels.com/search/wool/" target="_blank" rel="noopener">Pexels</a> - Professional photos</li>
                    </ul>
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