// Customer Orders Page - Display list of orders for the logged-in customer

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import OrdersList from "@/components/orders/OrdersList";
import Link from "next/link";
import styles from './page.module.css';

export default function OrdersPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    return (
        <div className={styles.ordersPage}>
            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link href="/customer">Account</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        My Orders
                    </li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="text-center mb-4">
                <h1 className="display-6 mb-2">My Orders</h1>
                <p className="text-muted">Track and view your order history</p>
            </div>

            {/* Orders List Component */}
            <OrdersList userId={userId} />
        </div>
    );
}
