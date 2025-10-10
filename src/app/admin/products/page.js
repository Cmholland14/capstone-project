'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductManagement() {
  const { user, loading: authLoading } = useSimpleAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [categories] = useState(['Clothing', 'Home & Living', 'Accessories']);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Clothing',
    imageUrl: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }
    
    fetchProducts();
  }, [user, authLoading, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Clothing',
      imageUrl: ''
    });
    setEditing(null);
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      imageUrl: product.imageUrl
    });
    setEditing(product._id);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        imageUrl: formData.imageUrl
      };

      let response;
      if (editing) {
        // Update existing product
        response = await fetch(`/api/products/${editing}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        // Create new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }

      if (response.ok) {
        await fetchProducts(); // Refresh the list
        resetForm();
        alert(editing ? 'Product updated successfully!' : 'Product created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts(); // Refresh the list
        alert('Product deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-5 fw-bold mb-2">Product Management</h1>
                <p className="lead text-muted">Manage your product catalog - add, edit, delete products and update images</p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(true);
                  }}
                  disabled={processing}
                >
                  <i className="fas fa-plus me-2"></i>Add Product
                </button>
                <Link href="/admin" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {(showAddForm || editing) && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent">
                  <h5 className="card-title mb-0">
                    {editing ? 'Edit Product' : 'Add New Product'}
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Product Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="price" className="form-label">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="stock" className="form-label">Stock Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                          className="form-select"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="imageUrl" className="form-label">Image URL</label>
                        <input
                          type="url"
                          className="form-control"
                          id="imageUrl"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                    </div>
                    
                    {formData.imageUrl && (
                      <div className="mb-3">
                        <label className="form-label">Image Preview</label>
                        <div>
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                            className="img-thumbnail"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {editing ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          editing ? 'Update Product' : 'Create Product'
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={resetForm}
                        disabled={processing}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="card-title mb-0">Current Products ({products.length})</h5>
              </div>
              <div className="card-body p-0">
                {products.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h5>No products found</h5>
                    <p className="text-muted">Start by adding your first product!</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Category</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td>
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                className="rounded"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                            </td>
                            <td className="fw-bold">{product.name}</td>
                            <td>
                              <span title={product.description}>
                                {product.description.length > 50 
                                  ? `${product.description.substring(0, 50)}...` 
                                  : product.description
                                }
                              </span>
                            </td>
                            <td>${product.price.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                {product.stock} in stock
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-secondary">{product.category}</span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(product)}
                                  disabled={processing}
                                  title="Edit Product"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(product._id)}
                                  disabled={processing}
                                  title="Delete Product"
                                >
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
      </div>
    </div>
  );
}