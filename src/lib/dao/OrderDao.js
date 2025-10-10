import Order from '@/lib/models/Order';

export class OrderDao {
    async getAllOrders() {
        return await Order.find()
            .populate('customer', 'name email')
            .populate('products.product', 'name price');
    }

    async getOrderById(id) {
        return await Order.findById(id)
            .populate('customer', 'name email')
            .populate('products.product', 'name price');
    }

    async getOrdersByCustomer(customerId) {
        return await Order.find({ customer: customerId })
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 });
    }

    async getOrdersByStatus(status) {
        return await Order.find({ status })
            .populate('customer', 'name email')
            .populate('products.product', 'name price');
    }

    async getOrdersByDateRange(startDate, endDate) {
        return await Order.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
        .populate('customer', 'name email')
        .populate('products.product', 'name price');
    }

    async getOrdersByAmountRange(minAmount, maxAmount) {
        return await Order.find({
            totalAmount: { $gte: minAmount, $lte: maxAmount }
        })
        .populate('customer', 'name email')
        .populate('products.product', 'name price');
    }

    async createOrder(orderData) {
        const order = new Order(orderData);
        return await order.save();
    }

    async updateOrder(id, updatedData) {
        return await Order.findByIdAndUpdate(id, updatedData, { new: true })
            .populate('customer', 'name email')
            .populate('products.product', 'name price');
    }

    async updateOrderStatus(id, newStatus) {
        return await Order.findByIdAndUpdate(
            id, 
            { status: newStatus }, 
            { new: true }
        )
        .populate('customer', 'name email')
        .populate('products.product', 'name price');
    }

    async addProductToOrder(orderId, productData) {
        return await Order.findByIdAndUpdate(
            orderId,
            { $push: { products: productData } },
            { new: true }
        )
        .populate('customer', 'name email')
        .populate('products.product', 'name price');
    }

    async removeProductFromOrder(orderId, productId) {
        return await Order.findByIdAndUpdate(
            orderId,
            { $pull: { products: { product: productId } } },
            { new: true }
        )
        .populate('customer', 'name email')
        .populate('products.product', 'name price');
    }

    async deleteOrder(id) {
        return await Order.findByIdAndDelete(id);
    }

    async getOrderCount() {
        return await Order.countDocuments();
    }

    async getOrderCountByStatus() {
        return await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getTotalRevenue() {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        return result[0]?.totalRevenue || 0;
    }

    async getRevenueByDateRange(startDate, endDate) {
        const result = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            }
        ]);
        return result[0] || { totalRevenue: 0, orderCount: 0 };
    }

    async getTopCustomersByOrderCount(limit = 10) {
        return await Order.aggregate([
            {
                $group: {
                    _id: '$customer',
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' }
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customerInfo'
                }
            },
            {
                $unwind: '$customerInfo'
            },
            {
                $sort: { orderCount: -1 }
            },
            {
                $limit: limit
            },
            {
                $project: {
                    customerId: '$_id',
                    customerName: '$customerInfo.name',
                    customerEmail: '$customerInfo.email',
                    orderCount: 1,
                    totalSpent: 1
                }
            }
        ]);
    }

    async getOrdersPaginated(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const orders = await Order.find()
            .populate('customer', 'name email')
            .populate('products.product', 'name price')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Order.countDocuments();
        
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async getRecentOrders(limit = 10) {
        return await Order.find()
            .populate('customer', 'name email')
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 })
            .limit(limit);
    }
}