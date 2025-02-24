const express = require('express');
const AuthMiddleware = require('../../middleware/authMiddleware');
const OrderController = require('../../database/controllers/orderController');

class OrderRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new OrderController();
        this.initRoutes();
    }

    initRoutes() {
        // Public route for the order page
        this.router.get('/', this.renderOrderPage.bind(this));
        
        // Protected routes
        this.router.post('/', AuthMiddleware.authenticate, this.createOrder.bind(this));
    }

    async renderOrderPage(req, res) {
        try {
            const products = await this.controller.getAllProducts();
            
            res.render('order/order', {
                title: 'Order Online',
                products: products || [],
                user: req.session?.user || null,
                userType: req.cookies?.userType || null
            });
        } catch (error) {
            console.error('Error rendering order page:', error);
            res.status(500).render('error', { 
                message: 'Error loading order page',
                error: error
            });
        }
    }

    async createOrder(req, res) {
        try {
            const order = await this.controller.createOrder(req.body);
            res.status(201).json(order);
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ message: 'Error creating order' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new OrderRoutes().getRouter();