const Order = require('../models/order');

class OrderController {
    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            return await order.save();
        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    }

    async getUserOrders(firstName) {
        try {
            return await Order.find({ firstName }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Get orders error:', error);
            throw error;
        }
    }
}

module.exports = new OrderController();