const express = require('express');
const OrderController = require('../../database/controllers/orderController');

class OrderRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new OrderController();
        this.initRoutes();
    }

    initRoutes() {
        // Public routes
        this.router.get('/', this.getOrderPage.bind(this));
        this.router.get('/:id', this.getOrderConfirmation.bind(this));
        
        // API routes
        this.router.post('/', this.createOrder.bind(this));
    }

    async getOrderPage(req, res) {
        try {
            const products = await this.controller.getAllProducts();
            res.render('order/order', {
                title: 'Order Online',
                products,
                userType: req.user?.userType || 'guest'
            });
        } catch (error) {
            console.error('Error loading order page:', error);
            res.status(500).render('error', { message: 'Failed to load order page' });
        }
    }

    async getOrderConfirmation(req, res) {
        try {
            const order = await this.controller.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).render('error', { message: 'Order not found' });
            }
            
            res.render('order/confirmation', {
                title: 'Order Confirmation',
                order,
                userType: req.user?.userType || 'guest'
            });
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).render('error', { message: 'Failed to load order confirmation' });
        }
    }

    async createOrder(req, res) {
        try {
            console.log('Received order request:', req.body);

            if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No items in cart'
                });
            }

            const orderData = {
                userId: req.user?._id || 'guest',
                items: req.body.items,
                totalAmount: req.body.totalAmount
            };

            const order = await this.controller.createOrder(orderData);
            
            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                orderId: order._id
            });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create order'
            });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new OrderRoutes().getRouter();