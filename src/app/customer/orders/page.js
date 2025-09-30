// list of orders for the logged-in customer 

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import OrdersList from "@/components/orders/OrdersList";
import styles from './page.module.css';

export default function OrdersPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    return (
        <div className={styles.ordersPage}>
            <OrdersList userId={userId} />
        </div>
    );
}
