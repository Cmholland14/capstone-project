import { OrderDao } from '@/lib/dao/OrderDao';
import { ProductDao } from '@/lib/dao/ProductDao';
import { UserDao } from '@/lib/dao/UserDao';

export class OrderController {
    constructor(orderDao = new OrderDao(), productDao = new ProductDao(), userDao = new UserDao()) {
        this.orderDao = orderDao;
        this.productDao = productDao;
        this.userDao = userDao;
        console.log('[OrderController] OrderController initialized');
    }

    async getAllOrders() {
        try {
            console.log('[OrderController] getAllOrders: Fetching all orders');
            const orders = await this.orderDao.getAllOrders();
            console.log(`[OrderController] getAllOrders: Found ${orders.length} orders`);
            return orders;
        } catch (error) {
            console.error('[OrderController] getAllOrders: Error occurred', error);
            throw new Error(`Failed to get all orders: ${error.message}`);
        }
    }

    async getOrderById(id) {
        try {
            console.log(`[OrderController] getOrderById: Fetching order with ID: ${id}`);
            const order = await this.orderDao.getOrderById(id);
            if (!order) {
                console.log(`[OrderController] getOrderById: Order not found with ID: ${id}`);
                return null;
            }
            console.log(`[OrderController] getOrderById: Order found with ID: ${id}`);
            return order;
        } catch (error) {
            console.error(`[OrderController] getOrderById: Error occurred for ID: ${id}`, error);
            throw new Error(`Failed to get order by ID: ${error.message}`);
        }
    }

    async getOrdersByCustomer(customerId) {
        try {
            console.log(`[OrderController] getOrdersByCustomer: Fetching orders for customer ID: ${customerId}`);
            const orders = await this.orderDao.getOrdersByCustomer(customerId);
            console.log(`[OrderController] getOrdersByCustomer: Found ${orders.length} orders for customer: ${customerId}`);
            return orders;
        } catch (error) {
            console.error(`[OrderController] getOrdersByCustomer: Error occurred for customer ID: ${customerId}`, error);
            throw new Error(`Failed to get orders by customer: ${error.message}`);
        }
    }

    async getOrdersByStatus(status) {
        try {
            console.log(`[OrderController] getOrdersByStatus: Fetching orders with status: ${status}`);
            const orders = await this.orderDao.getOrdersByStatus(status);
            console.log(`[OrderController] getOrdersByStatus: Found ${orders.length} orders with status: ${status}`);
            return orders;
        } catch (error) {
            console.error(`[OrderController] getOrdersByStatus: Error occurred for status: ${status}`, error);
            throw new Error(`Failed to get orders by status: ${error.message}`);
        }
    }

    async createOrder(orderData) {
        try {
            console.log(`[OrderController] createOrder: Creating order for customer: ${orderData.customer}`);
            
            // Validate required fields
            if (!orderData.customer || !orderData.products || orderData.products.length === 0) {
                console.error('[OrderController] createOrder: Missing required fields - customer and products are required');
                throw new Error('Customer and products are required');
            }

            // Validate customer exists
            const customer = await this.userDao.getUserById(orderData.customer);
            if (!customer) {
                console.error(`[OrderController] createOrder: Customer not found with ID: ${orderData.customer}`);
                throw new Error('Customer not found');
            }

            // Validate products and calculate total
            let calculatedTotal = 0;
            const validatedProducts = [];

            for (const item of orderData.products) {
                if (!item.product || !item.quantity || item.quantity <= 0) {
                    console.error('[OrderController] createOrder: Invalid product item - product ID and positive quantity required');
                    throw new Error('Each product must have a valid product ID and positive quantity');
                }

                const product = await this.productDao.getProductById(item.product);
                if (!product) {
                    console.error(`[OrderController] createOrder: Product not found with ID: ${item.product}`);
                    throw new Error(`Product not found: ${item.product}`);
                }

                // Check stock availability
                if (product.stock < item.quantity) {
                    console.error(`[OrderController] createOrder: Insufficient stock for product: ${product.name}, requested: ${item.quantity}, available: ${product.stock}`);
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                }

                calculatedTotal += product.price * item.quantity;
                validatedProducts.push({
                    product: item.product,
                    quantity: item.quantity,
                    price: product.price // Store price at time of order
                });
            }

            // Use calculated total if not provided or validate provided total
            if (!orderData.totalAmount) {
                orderData.totalAmount = calculatedTotal;
            } else if (Math.abs(orderData.totalAmount - calculatedTotal) > 0.01) {
                console.error(`[OrderController] createOrder: Total amount mismatch - calculated: ${calculatedTotal}, provided: ${orderData.totalAmount}`);
                throw new Error('Total amount does not match calculated total');
            }

            // Validate status
            const validStatuses = ['Pending', 'Shipped', 'Delivered'];
            if (orderData.status && !validStatuses.includes(orderData.status)) {
                console.error('[OrderController] createOrder: Invalid status provided');
                throw new Error('Status must be Pending, Shipped, or Delivered');
            }

            // Create the order
            const newOrder = await this.orderDao.createOrder(orderData);

            // Decrement stock for each product
            for (const item of orderData.products) {
                await this.productDao.decrementProductStock(item.product, item.quantity);
                console.log(`[OrderController] createOrder: Decremented stock for product ${item.product} by ${item.quantity}`);
            }

            console.log(`[OrderController] createOrder: Order created successfully with ID: ${newOrder._id}, customer: ${orderData.customer}`);
            
            // Return the populated order
            return await this.orderDao.getOrderById(newOrder._id);
        } catch (error) {
            console.error(`[OrderController] createOrder: Error creating order for customer: ${orderData.customer}`, error);
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    async updateOrder(id, updatedData) {
        try {
            console.log(`[OrderController] updateOrder: Updating order with ID: ${id}`);
            
            // Check if order exists
            const existingOrder = await this.orderDao.getOrderById(id);
            if (!existingOrder) {
                console.log(`[OrderController] updateOrder: Order not found with ID: ${id}`);
                return null;
            }

            // Validate status if being updated
            if (updatedData.status) {
                const validStatuses = ['Pending', 'Shipped', 'Delivered'];
                if (!validStatuses.includes(updatedData.status)) {
                    console.error('[OrderController] updateOrder: Invalid status provided');
                    throw new Error('Status must be Pending, Shipped, or Delivered');
                }
            }

            // Don't allow changing products or customer after order creation
            if (updatedData.products || updatedData.customer) {
                console.error('[OrderController] updateOrder: Cannot modify products or customer after order creation');
                throw new Error('Cannot modify products or customer after order creation');
            }

            const updatedOrder = await this.orderDao.updateOrder(id, updatedData);
            console.log(`[OrderController] updateOrder: Order updated successfully with ID: ${id}`);
            return updatedOrder;
        } catch (error) {
            console.error(`[OrderController] updateOrder: Error updating order with ID: ${id}`, error);
            throw new Error(`Failed to update order: ${error.message}`);
        }
    }

    async updateOrderStatus(id, newStatus) {
        try {
            console.log(`[OrderController] updateOrderStatus: Updating status for order ID: ${id} to: ${newStatus}`);
            
            const validStatuses = ['Pending', 'Shipped', 'Delivered'];
            if (!validStatuses.includes(newStatus)) {
                console.error(`[OrderController] updateOrderStatus: Invalid status provided: ${newStatus}`);
                throw new Error('Status must be Pending, Shipped, or Delivered');
            }

            const updatedOrder = await this.orderDao.updateOrderStatus(id, newStatus);
            if (!updatedOrder) {
                console.log(`[OrderController] updateOrderStatus: Order not found with ID: ${id}`);
                return null;
            }

            console.log(`[OrderController] updateOrderStatus: Status updated successfully for order ID: ${id} to: ${newStatus}`);
            return updatedOrder;
        } catch (error) {
            console.error(`[OrderController] updateOrderStatus: Error updating status for order ID: ${id}`, error);
            throw new Error(`Failed to update order status: ${error.message}`);
        }
    }

    async cancelOrder(id) {
        try {
            console.log(`[OrderController] cancelOrder: Cancelling order with ID: ${id}`);
            
            const order = await this.orderDao.getOrderById(id);
            if (!order) {
                console.log(`[OrderController] cancelOrder: Order not found with ID: ${id}`);
                return null;
            }

            // Only allow cancellation of pending orders
            if (order.status !== 'Pending') {
                console.error(`[OrderController] cancelOrder: Cannot cancel order with status: ${order.status}`);
                throw new Error('Can only cancel orders with Pending status');
            }

            // Restore stock for each product
            for (const item of order.products) {
                await this.productDao.incrementProductStock(item.product._id, item.quantity);
                console.log(`[OrderController] cancelOrder: Restored stock for product ${item.product._id} by ${item.quantity}`);
            }

            // Delete the order
            const deletedOrder = await this.orderDao.deleteOrder(id);
            console.log(`[OrderController] cancelOrder: Order cancelled successfully with ID: ${id}`);
            return deletedOrder;
        } catch (error) {
            console.error(`[OrderController] cancelOrder: Error cancelling order with ID: ${id}`, error);
            throw new Error(`Failed to cancel order: ${error.message}`);
        }
    }

    async deleteOrder(id) {
        try {
            console.log(`[OrderController] deleteOrder: Deleting order with ID: ${id}`);
            const deletedOrder = await this.orderDao.deleteOrder(id);
            if (!deletedOrder) {
                console.log(`[OrderController] deleteOrder: Order not found with ID: ${id}`);
                return null;
            }
            
            console.log(`[OrderController] deleteOrder: Order deleted successfully with ID: ${id}`);
            return deletedOrder;
        } catch (error) {
            console.error(`[OrderController] deleteOrder: Error deleting order with ID: ${id}`, error);
            throw new Error(`Failed to delete order: ${error.message}`);
        }
    }

    async getOrdersPaginated(page = 1, limit = 10) {
        try {
            console.log(`[OrderController] getOrdersPaginated: Fetching page ${page} with limit ${limit}`);
            const result = await this.orderDao.getOrdersPaginated(page, limit);
            console.log(`[OrderController] getOrdersPaginated: Found ${result.orders.length} orders on page ${page}`);
            return result;
        } catch (error) {
            console.error(`[OrderController] getOrdersPaginated: Error occurred for page ${page}`, error);
            throw new Error(`Failed to get paginated orders: ${error.message}`);
        }
    }

    async getRecentOrders(limit = 10) {
        try {
            console.log(`[OrderController] getRecentOrders: Fetching ${limit} recent orders`);
            const orders = await this.orderDao.getRecentOrders(limit);
            console.log(`[OrderController] getRecentOrders: Found ${orders.length} recent orders`);
            return orders;
        } catch (error) {
            console.error('[OrderController] getRecentOrders: Error occurred', error);
            throw new Error(`Failed to get recent orders: ${error.message}`);
        }
    }

    async getOrderAnalytics() {
        try {
            console.log('[OrderController] getOrderAnalytics: Fetching order analytics');
            
            const [totalRevenue, orderCountByStatus, topCustomers] = await Promise.all([
                this.orderDao.getTotalRevenue(),
                this.orderDao.getOrderCountByStatus(),
                this.orderDao.getTopCustomersByOrderCount(5)
            ]);

            const analytics = {
                totalRevenue,
                orderCountByStatus,
                topCustomers
            };

            console.log('[OrderController] getOrderAnalytics: Analytics fetched successfully');
            return analytics;
        } catch (error) {
            console.error('[OrderController] getOrderAnalytics: Error occurred', error);
            throw new Error(`Failed to get order analytics: ${error.message}`);
        }
    }

    async getRevenueByDateRange(startDate, endDate) {
        try {
            console.log(`[OrderController] getRevenueByDateRange: Fetching revenue from ${startDate} to ${endDate}`);
            const revenue = await this.orderDao.getRevenueByDateRange(startDate, endDate);
            console.log(`[OrderController] getRevenueByDateRange: Revenue data fetched successfully`);
            return revenue;
        } catch (error) {
            console.error(`[OrderController] getRevenueByDateRange: Error occurred for date range ${startDate} to ${endDate}`, error);
            throw new Error(`Failed to get revenue by date range: ${error.message}`);
        }
    }
}