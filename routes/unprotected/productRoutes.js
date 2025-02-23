const express = require('express');
const ProductController = require('../../database/controllers/productController');

class ProductRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new ProductController();
        this.initRoutes();
    }

    initRoutes() {
        // Define the menu route at the root level
        this.router.get('/', this.getAllProducts.bind(this));
        this.router.get('/:id', this.getProductById.bind(this));
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.controller.getAllProducts();
            res.render('menu', { 
                products,
                user: req.session?.user || null,
                userType: req.cookies?.userType || null
            });
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).render('error', { message: 'Error loading menu' });
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

    getRouter() {
        return this.router;
    }
}

module.exports = new ProductRoutes().getRouter();