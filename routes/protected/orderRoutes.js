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
        // Use the static authenticate method from AuthMiddleware
        this.router.use(AuthMiddleware.authenticate);

        // Define routes
        this.router.get('/orders', this.getAllOrders.bind(this));
        this.router.get('/orders/:id', this.getOrderById.bind(this));
        this.router.post('/orders', this.createOrder.bind(this));
        this.router.put('/orders/:id', this.updateOrder.bind(this));
        this.router.delete('/orders/:id', this.deleteOrder.bind(this));
    }

    async getAllOrders(req, res) {
        try {
            const orders = await this.controller.getAllOrders();
            res.json(orders);
        } catch (error) {
            console.error('Get orders error:', error);
            res.status(500).json({ message: 'Error fetching orders' });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await this.controller.getOrderById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            console.error('Get order error:', error);
            res.status(500).json({ message: 'Error fetching order' });
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

    async updateOrder(req, res) {
        try {
            const order = await this.controller.updateOrder(req.params.id, req.body);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            console.error('Update order error:', error);
            res.status(500).json({ message: 'Error updating order' });
        }
    }

    async deleteOrder(req, res) {
        try {
            const result = await this.controller.deleteOrder(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Delete order error:', error);
            res.status(500).json({ message: 'Error deleting order' });
        }
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new OrderRoutes().getRouter();