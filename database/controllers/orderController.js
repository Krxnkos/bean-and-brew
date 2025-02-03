const Order = require('../models/order');

class OrderController {
    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            await order.save();
            return order;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    async getUserOrders(firstName) {
        try {
            return await Order.find({ firstName }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Get user orders error:', error);
            throw error;
        }
    }
}

module.exports = new OrderController();