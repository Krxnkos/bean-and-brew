const express = require('express');
const ProductController = require('../../database/controllers/productController');
const Product = require('../../database/models/product');

class ProductRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new ProductController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', this.getAllProducts.bind(this));
        this.router.get('/:id', this.getProductById.bind(this));
        this.router.post('/bulk', this.bulkUploadProducts.bind(this));
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.controller.getAllProducts();
            
            // Define categories here
            const categories = [
                { id: 'seasonal', name: 'Seasonal Specials' },
                { id: 'originals', name: 'Bean & Brew Originals™' },
                { id: 'hot-drinks', name: 'Hot Drinks' },
                { id: 'soft-drinks', name: 'Soft Drinks' },
                { id: 'sweet-treats', name: 'Sweet Treats' }
            ];

            res.render('menu', {
                title: 'Menu',
                menu: products || [],
                categories: categories,
                userType: req.user?.userType || 'guest'
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.render('menu', {
                title: 'Menu',
                menu: [],
                categories: [],
                userType: req.user?.userType || 'guest',
                error: 'Failed to load menu items'
            });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await this.controller.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({ message: 'Error fetching product' });
        }
    }

    async bulkUploadProducts(req, res) {
        try {
            const products = req.body;

            if (!Array.isArray(products)) {
                return res.status(400).json({
                    success: false,
                    message: 'Request body must be an array of products'
                });
            }

            // Validate each product object
            for (const product of products) {
                if (!product.name || !product.price || !product.imageUrl || 
                    !product.stockQuantity || !product.description) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each product must have name, price, imageUrl, stockQuantity, and description'
                    });
                }
            }

            const createdProducts = await Product.insertMany(products);

            res.status(201).json({
                success: true,
                message: `Successfully added ${createdProducts.length} products`,
                data: createdProducts
            });

        } catch (error) {
            console.error('Bulk upload error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to upload products',
                error: error.message
            });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new ProductRoutes().router;