const Product = require('../models/product');

class ProductController {
    constructor() {
        // Bind methods to instance
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.setStock = this.setStock.bind(this);
        this.reorderStock = this.reorderStock.bind(this);
        this.createMany = this.createMany.bind(this);
    }

    async getAllProducts() {
        try {
            return await Product.find().lean();
        } catch (error) {
            console.error('Get all products error:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id).lean();
        } catch (error) {
            console.error('Get product by id error:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            console.error('Add product error:', error);
            throw error;
        }
    }

    async setStock(productId, stockQuantity) {
        try {
            return await Product.findByIdAndUpdate(
                productId, 
                { stockQuantity: parseInt(stockQuantity, 10) },
                { new: true }
            );
        } catch (error) {
            console.error('Set stock error:', error);
            throw error;
        }
    }

    async reorderStock(productId, quantity) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            product.stockQuantity += parseInt(quantity, 10);
            return await product.save();
        } catch (error) {
            console.error('Reorder stock error:', error);
            throw error;
        }
    }

    async createMany(products) {
        try {
            return await Product.insertMany(products);
        } catch (error) {
            console.error('Create many products error:', error);
            throw error;
        }
    }
}

// Export the class itself
module.exports = ProductController;