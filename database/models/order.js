const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String, // Changed from ObjectId to String to allow guest orders
        default: 'guest'
    },
    items: [{
        productId: String,
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);