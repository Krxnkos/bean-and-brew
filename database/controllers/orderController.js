const Order = require('../models/order');
const Product = require('../models/product');

class OrderController {
    constructor() {
        this.getAllProducts = this.getAllProducts.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.getOrderById = this.getOrderById.bind(this);
    }

    async getAllProducts() {
        try {
            return await Product.find().lean();
        } catch (error) {
            console.error('Get all products error:', error);
            throw error;
        }
    }

    async createOrder(orderData) {
        try {
            console.log('Creating order with data:', orderData);
            const order = new Order({
                userId: orderData.userId || 'guest',
                items: orderData.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: orderData.totalAmount
            });

            const savedOrder = await order.save();
            console.log('Order saved:', savedOrder);
            return savedOrder;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    async getOrderById(id) {
        try {
            const order = await Order.findById(id).lean();
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            console.error('Get order by id error:', error);
            throw error;
        }
    }
}

module.exports = OrderController;