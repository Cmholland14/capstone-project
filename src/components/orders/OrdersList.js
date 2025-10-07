import React, { useState, useEffect } from 'react';

export default function OrdersList({ userId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders-simple?customerId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (!userId) {
        return (
            <div className="text-center py-8">
                <p>Please log in to view your orders.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center py-8">
                <p>Error loading orders: {error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <h2>No Orders Found</h2>
                <p>You haven&apos;t placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="orders-list">
            <h1>Your Orders</h1>
            <div className="row">
                {orders.map((order) => (
                    <div key={order._id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Order #{order._id.slice(-6)}</h5>
                                <p className="card-text">
                                    <strong>Status:</strong> 
                                    <span className={`badge ms-2 ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </p>
                                <p className="card-text">
                                    <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                                </p>
                                <p className="card-text">
                                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="card-text">
                                    <strong>Items:</strong> {order.products.length} item(s)
                                </p>
                                <div className="mt-3">
                                    <h6>Products:</h6>
                                    <ul className="list-unstyled">
                                        {order.products.map((item, index) => (
                                            <li key={index} className="small">
                                                {item.product.name} (Qty: {item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Pending':
            return 'bg-warning';
        case 'Shipped':
            return 'bg-info';
        case 'Delivered':
            return 'bg-success';
        default:
            return 'bg-secondary';
    }
}