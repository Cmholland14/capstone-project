import Product from '..src/lib/models/product.js';

export class ProductController {
    // Get all products
    async getProducts(req, res) {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    // Get single product by ID
    async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    }

    // Create new product
    async createProduct(req, res) {
        try {
            const product = new Product(req.body);
            await product.save();
            res.status(201).json(product);
        } catch (err) {
            res.status(400).json({ error: 'Failed to create product' });
        }
    }

    // Update product
    async updateProduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (err) {
            res.status(400).json({ error: 'Failed to update product' });
        }
    }

    // Delete product
    async deleteProduct(req, res) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
}