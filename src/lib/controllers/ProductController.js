import { ProductDao } from '../dao/ProductDao.js';

export class ProductController {
    constructor(productDao = new ProductDao()) {
        this.productDao = productDao;
        console.log('[ProductController] ProductController initialized');
    }

    async getAllProducts() {
        try {
            console.log('[ProductController] getAllProducts: Fetching all products');
            const products = await this.productDao.getAllProducts();
            console.log(`[ProductController] getAllProducts: Found ${products.length} products`);
            return products;
        } catch (error) {
            console.error('[ProductController] getAllProducts: Error occurred', error);
            throw new Error(`Failed to get all products: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            console.log(`[ProductController] getProductById: Fetching product with ID: ${id}`);
            const product = await this.productDao.getProductById(id);
            if (!product) {
                console.log(`[ProductController] getProductById: Product not found with ID: ${id}`);
                return null;
            }
            console.log(`[ProductController] getProductById: Product found with ID: ${id}`);
            return product;
        } catch (error) {
            console.error(`[ProductController] getProductById: Error occurred for ID: ${id}`, error);
            throw new Error(`Failed to get product by ID: ${error.message}`);
        }
    }

    async getProductsByCategory(category) {
        try {
            console.log(`[ProductController] getProductsByCategory: Fetching products in category: ${category}`);
            const products = await this.productDao.getProductsByCategory(category);
            console.log(`[ProductController] getProductsByCategory: Found ${products.length} products in category: ${category}`);
            return products;
        } catch (error) {
            console.error(`[ProductController] getProductsByCategory: Error occurred for category: ${category}`, error);
            throw new Error(`Failed to get products by category: ${error.message}`);
        }
    }

    async searchProducts(searchTerm) {
        try {
            console.log(`[ProductController] searchProducts: Searching for products with term: ${searchTerm}`);
            const products = await this.productDao.searchProductsByName(searchTerm);
            console.log(`[ProductController] searchProducts: Found ${products.length} products matching: ${searchTerm}`);
            return products;
        } catch (error) {
            console.error(`[ProductController] searchProducts: Error occurred for search term: ${searchTerm}`, error);
            throw new Error(`Failed to search products: ${error.message}`);
        }
    }

    async getProductsInStock() {
        try {
            console.log('[ProductController] getProductsInStock: Fetching products with stock');
            const products = await this.productDao.getProductsInStock();
            console.log(`[ProductController] getProductsInStock: Found ${products.length} products in stock`);
            return products;
        } catch (error) {
            console.error('[ProductController] getProductsInStock: Error occurred', error);
            throw new Error(`Failed to get products in stock: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            console.log(`[ProductController] createProduct: Creating product with name: ${productData.name}`);
            
            // Validate required fields
            if (!productData.name || !productData.price) {
                console.error('[ProductController] createProduct: Missing required fields - name and price are required');
                throw new Error('Name and price are required');
            }

            // Validate price is positive
            if (productData.price <= 0) {
                console.error('[ProductController] createProduct: Invalid price - must be positive');
                throw new Error('Price must be greater than 0');
            }

            // Ensure stock is non-negative
            if (productData.stock && productData.stock < 0) {
                console.error('[ProductController] createProduct: Invalid stock - cannot be negative');
                throw new Error('Stock cannot be negative');
            }
            
            const newProduct = await this.productDao.createProduct(productData);
            console.log(`[ProductController] createProduct: Product created successfully with ID: ${newProduct._id}, name: ${productData.name}`);
            return newProduct;
        } catch (error) {
            console.error(`[ProductController] createProduct: Error creating product with name: ${productData.name}`, error);
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    async updateProduct(id, updatedData) {
        try {
            console.log(`[ProductController] updateProduct: Updating product with ID: ${id}`);
            
            // Check if product exists
            const existingProduct = await this.productDao.getProductById(id);
            if (!existingProduct) {
                console.log(`[ProductController] updateProduct: Product not found with ID: ${id}`);
                return null;
            }

            // Validate price if being updated
            if (updatedData.price !== undefined && updatedData.price <= 0) {
                console.error('[ProductController] updateProduct: Invalid price - must be positive');
                throw new Error('Price must be greater than 0');
            }

            // Validate stock if being updated
            if (updatedData.stock !== undefined && updatedData.stock < 0) {
                console.error('[ProductController] updateProduct: Invalid stock - cannot be negative');
                throw new Error('Stock cannot be negative');
            }

            const updatedProduct = await this.productDao.updateProduct(id, updatedData);
            console.log(`[ProductController] updateProduct: Product updated successfully with ID: ${id}`);
            return updatedProduct;
        } catch (error) {
            console.error(`[ProductController] updateProduct: Error updating product with ID: ${id}`, error);
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    async updateProductStock(id, newStock) {
        try {
            console.log(`[ProductController] updateProductStock: Updating stock for product ID: ${id} to: ${newStock}`);
            
            if (newStock < 0) {
                console.error('[ProductController] updateProductStock: Invalid stock - cannot be negative');
                throw new Error('Stock cannot be negative');
            }

            const updatedProduct = await this.productDao.updateProductStock(id, newStock);
            if (!updatedProduct) {
                console.log(`[ProductController] updateProductStock: Product not found with ID: ${id}`);
                return null;
            }

            console.log(`[ProductController] updateProductStock: Stock updated successfully for product ID: ${id}`);
            return updatedProduct;
        } catch (error) {
            console.error(`[ProductController] updateProductStock: Error updating stock for product ID: ${id}`, error);
            throw new Error(`Failed to update product stock: ${error.message}`);
        }
    }

    async decrementProductStock(id, quantity = 1) {
        try {
            console.log(`[ProductController] decrementProductStock: Decrementing stock for product ID: ${id} by: ${quantity}`);
            
            if (quantity <= 0) {
                console.error('[ProductController] decrementProductStock: Invalid quantity - must be positive');
                throw new Error('Quantity must be greater than 0');
            }

            const updatedProduct = await this.productDao.decrementProductStock(id, quantity);
            console.log(`[ProductController] decrementProductStock: Stock decremented successfully for product ID: ${id}`);
            return updatedProduct;
        } catch (error) {
            console.error(`[ProductController] decrementProductStock: Error decrementing stock for product ID: ${id}`, error);
            throw new Error(`Failed to decrement product stock: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            console.log(`[ProductController] deleteProduct: Deleting product with ID: ${id}`);
            const deletedProduct = await this.productDao.deleteProduct(id);
            if (!deletedProduct) {
                console.log(`[ProductController] deleteProduct: Product not found with ID: ${id}`);
                return null;
            }
            
            console.log(`[ProductController] deleteProduct: Product deleted successfully with ID: ${id}`);
            return deletedProduct;
        } catch (error) {
            console.error(`[ProductController] deleteProduct: Error deleting product with ID: ${id}`, error);
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }

    async getFeaturedProducts(limit = 10) {
        try {
            console.log(`[ProductController] getFeaturedProducts: Fetching ${limit} featured products`);
            const products = await this.productDao.getFeaturedProducts(limit);
            console.log(`[ProductController] getFeaturedProducts: Found ${products.length} featured products`);
            return products;
        } catch (error) {
            console.error('[ProductController] getFeaturedProducts: Error occurred', error);
            throw new Error(`Failed to get featured products: ${error.message}`);
        }
    }

    async getProductsPaginated(page = 1, limit = 10) {
        try {
            console.log(`[ProductController] getProductsPaginated: Fetching page ${page} with limit ${limit}`);
            const result = await this.productDao.getProductsPaginated(page, limit);
            console.log(`[ProductController] getProductsPaginated: Found ${result.products.length} products on page ${page}`);
            return result;
        } catch (error) {
            console.error(`[ProductController] getProductsPaginated: Error occurred for page ${page}`, error);
            throw new Error(`Failed to get paginated products: ${error.message}`);
        }
    }
}