import { Product } from '@/lib/models';

export class ProductDao {
    async getAllProducts() {
        return await Product.find();
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async getProductsByCategory(category) {
        return await Product.find({ category });
    }

    async getProductsByPriceRange(minPrice, maxPrice) {
        return await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
    }

    async getProductsInStock() {
        return await Product.find({ stock: { $gt: 0 } });
    }

    async searchProductsByName(searchTerm) {
        return await Product.find({
            name: { $regex: searchTerm, $options: 'i' }
        });
    }

    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async updateProduct(id, updatedData) {
        return await Product.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async updateProductStock(id, newStock) {
        return await Product.findByIdAndUpdate(
            id, 
            { stock: newStock }, 
            { new: true }
        );
    }

    async decrementProductStock(id, quantity = 1) {
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }
        return await Product.findByIdAndUpdate(
            id,
            { $inc: { stock: -quantity } },
            { new: true }
        );
    }

    async incrementProductStock(id, quantity = 1) {
        return await Product.findByIdAndUpdate(
            id,
            { $inc: { stock: quantity } },
            { new: true }
        );
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }

    async getProductCount() {
        return await Product.countDocuments();
    }

    async getProductCountByCategory() {
        return await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getFeaturedProducts(limit = 10) {
        return await Product.find()
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async getProductsPaginated(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Product.countDocuments();
        
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
}
