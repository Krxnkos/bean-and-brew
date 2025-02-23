const Order = require('../models/Order');

class OrderController {
    async getAllOrders() {
        try {
            return await Order.find().populate('user');
        } catch (error) {
            console.error('Get all orders error:', error);
            throw error;
        }
    }

    async getOrderById(id) {
        try {
            return await Order.findById(id).populate('user');
        } catch (error) {
            console.error('Get order by id error:', error);
            throw error;
        }
    }

    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            return await order.save();
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    async updateOrder(id, updateData) {
        try {
            return await Order.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            console.error('Update order error:', error);
            throw error;
        }
    }

    async deleteOrder(id) {
        try {
            return await Order.findByIdAndDelete(id);
        } catch (error) {
            console.error('Delete order error:', error);
            throw error;
        }
    }
}

module.exports = OrderController;