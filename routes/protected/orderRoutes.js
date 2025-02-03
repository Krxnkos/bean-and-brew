const { Router } = require('express');
const { requireAuth } = require('../../middleware/authMiddleware');
const productController = require('../../database/controllers/productController');
const orderController = require('../../database/controllers/orderController');

class OrderRoutes {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/order', requireAuth, async (req, res) => {
            try {
                const products = await productController.getAllProducts();
                res.render('order/order', { 
                    user: req.user,
                    products
                });
            } catch (error) {
                res.status(500).json({ error: 'Failed to load products' });
            }
        });

        this.router.post('/order/create', requireAuth, async (req, res) => {
            try {
                const orderData = {
                    userId: req.user.firstName,
                    firstName: req.user.firstName,
                    items: req.body.items,
                    total: req.body.total,
                    status: 'pending'
                };
                await orderController.createOrder(orderData);
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({ error: 'Failed to create order' });
            }
        });
    }
}

module.exports = new OrderRoutes().router;